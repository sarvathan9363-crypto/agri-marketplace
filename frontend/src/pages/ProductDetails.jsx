import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, BadgeCheck, ShoppingCart, Zap, Minus, Plus, Package, Calendar, Leaf } from 'lucide-react';
import { LoadingState, StatusBadge } from '../components/ui/Components';
import ProductCard from '../components/common/ProductCard';
import BlockchainAuditBadge from '../components/common/BlockchainAuditBadge';
import PageContainer from '../components/ui/PageContainer';
import Button from '../components/ui/Button';
import productService from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const { isAuthenticated, isBuyer } = useAuth();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id, i18n.resolvedLanguage]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProduct(id);
      setProduct(data.product);
      setFarmer(data.farmer);
      // Fetch related
      const rel = await productService.getProducts({ category: data.product.category, limit: 4 });
      setRelated((rel.products || []).filter(p => p._id !== id).slice(0, 4));
    } catch {
      toast.error(t('errors.PRODUCT_NOT_FOUND'));
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error(t('productDetails.loginFirst')); navigate('/login'); return; }
    if (!isBuyer) { toast.error(t('productDetails.buyersOnly')); return; }
    setAdding(true);
    try {
      await addToCart(product._id, qty);
      toast.success(t('productDetails.addedToCart', { name: product.productName }));
    } catch (err) {
      toast.error(err.response?.data?.message || t('productDetails.addToCartFailed'));
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!product) return null;

  const imgSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600';

  return (
    <div className="min-h-[calc(100vh-var(--app-header-height))] bg-[#F7F9F3] py-10">
      <PageContainer>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-8 uppercase tracking-wider">
          <Link to="/marketplace" className="hover:text-[#00C853] flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> {t('marketplace.title')}
          </Link>
          <span>/</span>
          <span className="text-[#082B36]">{product.productName}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Image */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-6">
            <div className="rounded-3xl border border-[#E2E8E5] overflow-hidden bg-white shadow-sm aspect-square p-2">
              <img
                src={imgSrc}
                alt={product.productName}
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600'; }}
              />
            </div>
          </motion.div>

          {/* Right Column: Information */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#002B36] text-[#00E676] text-xs font-bold uppercase tracking-wider rounded-full">
                {t(`categories.${product.category}`, { defaultValue: product.category })}
              </span>
              <StatusBadge status={product.status} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#082B36] leading-tight">{product.productName}</h1>

            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-slate-700">{product.farmerName}</span>
              {product.farmerVerificationStatus === 'VERIFIED' && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#00C853] bg-[#00E676]/15 border border-[#00E676]/30 px-2.5 py-0.5 rounded-full">
                  <BadgeCheck className="w-4 h-4 text-[#00C853]" /> {t('productDetails.verifiedProducer')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-[#00C853]" /> {product.location}
            </div>

            {/* Blockchain Audit Badge */}
            <BlockchainAuditBadge entityType="LISTING" entityId={product._id} />

            {/* Price Box */}
            <div className="p-6 bg-white border border-[#E2E8E5] rounded-3xl shadow-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#082B36]">₹{product.pricePerUnit}</span>
                <span className="text-sm font-bold text-slate-500">per {product.unit}</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1">{product.quantity} {product.unit} available in stock</p>
            </div>

            {product.description && (
              <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-sm">
                <h3 className="font-extrabold text-[#082B36] text-base mb-2">{t('productDetails.specifications')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {product.harvestDate && (
                <div className="flex items-center gap-2.5 p-3.5 bg-white border border-[#E2E8E5] rounded-2xl text-xs font-bold text-slate-700">
                  <Calendar className="w-4 h-4 text-[#00C853]" /> Harvest: {product.harvestDate}
                </div>
              )}
              {product.availableFrom && (
                <div className="flex items-center gap-2.5 p-3.5 bg-white border border-[#E2E8E5] rounded-2xl text-xs font-bold text-slate-700">
                  <Package className="w-4 h-4 text-[#00C853]" /> Available: {product.availableFrom}
                </div>
              )}
            </div>

            {/* Quantity & Actions */}
            {product.status === 'ACTIVE' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#082B36]">Quantity ({product.unit}):</span>
                  <div className="flex items-center border border-[#E2E8E5] rounded-xl overflow-hidden bg-white">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3.5 py-2 hover:bg-slate-100 font-bold"><Minus className="w-4 h-4 text-[#082B36]" /></button>
                    <span className="px-4 py-2 font-black text-[#082B36] min-w-[3rem] text-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.quantity, qty + 1))} className="px-3.5 py-2 hover:bg-slate-100 font-bold"><Plus className="w-4 h-4 text-[#082B36]" /></button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="primary" size="lg" icon={ShoppingCart} fullWidth onClick={handleAddToCart} loading={adding}>
                    {t('marketplace.addToCart')}
                  </Button>
                  <Button variant="secondary" size="lg" icon={Zap} fullWidth onClick={() => handleAddToCart().then(() => navigate('/buyer/cart'))}>
                    {t('marketplace.buyNow')}
                  </Button>
                </div>
              </div>
            )}

            {/* Farmer Info */}
            {farmer && (
              <div className="p-6 bg-[#002B36] text-white rounded-3xl border border-[#E2E8E5]/20 shadow-md">
                <h3 className="font-extrabold text-base mb-3 flex items-center gap-2 text-[#00E676]">
                  <Leaf className="w-5 h-5" /> About the Farmer / Producer
                </h3>
                <div className="space-y-2 text-xs">
                  <p><span className="text-slate-400">Producer Name:</span> <span className="text-white font-bold">{farmer.fullName}</span></p>
                  <p><span className="text-slate-400">Farm / FPO Name:</span> <span className="text-white font-bold">{farmer.farmName}</span></p>
                  <p><span className="text-slate-400">Type:</span> <span className="text-white font-bold">{farmer.farmerType}</span></p>
                  <p><span className="text-slate-400">Location:</span> <span className="text-white font-bold">{farmer.location}</span></p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-[#E2E8E5] pt-12">
            <h2 className="text-2xl font-black text-[#082B36] mb-8">{t('productDetails.related')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
