import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { LoadingState, EmptyState } from '../components/ui/Components';
import PageContainer from '../components/ui/PageContainer';
import Button from '../components/ui/Button';
import productService from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const categories = ['ALL', 'FRUITS', 'VEGETABLES', 'GRAINS', 'PULSES', 'SPICES', 'MILLETS', 'DAIRY', 'OTHER'];
export default function Marketplace() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isBuyer } = useAuth();
  const { addToCart } = useCart();
  const sortOptions = [
    { value: 'newest', label: t('home.marketplace.newest') }, { value: 'price_asc', label: t('home.marketplace.lowPrice') },
    { value: 'price_desc', label: t('home.marketplace.highPrice') }, { value: 'popular', label: t('home.marketplace.popular') },
  ];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) { toast.error(t('productDetails.loginFirst')); navigate('/login'); return; }
    if (!isBuyer) { toast.error(t('productDetails.buyersOnly')); return; }
    try {
      await addToCart(product._id, 1);
      toast.success(t('productDetails.addedToCart', { name: product.productName }));
    } catch (err) {
      toast.error(err.response?.data?.message || t('productDetails.addToCartFailed'));
    }
  };

  const category = searchParams.get('category') || 'ALL';
  const sort = searchParams.get('sort') || 'newest';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    fetchProducts();
  }, [category, sort, page, i18n.resolvedLanguage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (category !== 'ALL') params.category = category;
      if (search) params.search = search;
      const data = await productService.getProducts(params);
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch {
      toast.error(t('messages.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
    fetchProducts();
  };

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'ALL') params.delete(key);
    else params.set(key, value);
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="min-h-[calc(100vh-var(--app-header-height))] bg-[#F7F9F3] py-10">
      <PageContainer>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[#002B36] font-bold text-xs tracking-wider uppercase bg-[#00E676]/20 px-3.5 py-1 rounded-full border border-[#00E676]/30">{t('home.marketplace.exchange')}</span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#082B36] mt-4">{t('marketplace.title')}</h1>
          <p className="mt-3 text-base text-slate-600">{t('home.marketplace.description')}</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('marketplace.searchPlaceholder')}
              className="w-full pl-12 pr-32 py-3.5 bg-white border border-[#E2E8E5] rounded-full text-sm text-[#082B36] focus:outline-none focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/15 shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 btn-agri-primary text-xs px-6 py-2.5 rounded-full"
            >
              {t('common.search')}
            </button>
          </div>
        </form>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-8">
          {categories.map(cat => {
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter('category', cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#002B36] text-[#00E676] shadow-sm'
                    : 'bg-white text-slate-700 border border-[#E2E8E5] hover:border-[#00E676]'
                }`}
              >
                {cat === 'ALL' ? t('common.all') : t(`categories.${cat}`, { defaultValue: cat.charAt(0) + cat.slice(1).toLowerCase() })}
              </button>
            );
          })}
        </div>

        {/* Filter / Sort Subbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2E8E5]">
          <p className="text-sm font-bold text-[#082B36]">
            {t('home.marketplace.showing', { count: pagination.total || 0 })}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('marketplace.sort')}:</span>
            <select
              value={sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="py-2 px-4 bg-white border border-[#E2E8E5] rounded-xl text-xs font-bold text-[#082B36] focus:outline-none focus:border-[#00E676]"
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <LoadingState message={t('common.loading')} />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setFilter('page', String(p))}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      Number(page) === p
                        ? 'bg-[#002B36] text-[#00E676] shadow-sm'
                        : 'bg-white text-slate-700 border border-[#E2E8E5] hover:border-[#00E676]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title={t('marketplace.noProducts')}
            description={t('common.noResults')}
            action={
              <Button variant="outline" onClick={() => setFilter('category', 'ALL')}>
                {t('marketplace.filters')}
              </Button>
            }
          />
        )}
      </PageContainer>
    </div>
  );
}
