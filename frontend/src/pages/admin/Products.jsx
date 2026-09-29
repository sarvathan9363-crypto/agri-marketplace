import { useTranslation } from 'react-i18next';
import { translateStatus } from '../../utils/enumTranslations';
import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Components';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetch(); }, [filter]);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.status = filter;
      const res = await adminService.getProducts(params);
      setProducts(res.products || []);
    } catch {} finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateProductStatus(id, status);
      toast.success('Product listing status updated.');
      fetch();
    } catch { toast.error('Failed to update product status.'); }
  };

  const columns = [
    {
      header: t('adminProducts.colCropListing', { defaultValue: 'CROP LISTING' }),
      key: 'productName',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=80'} alt="" className="w-10 h-10 rounded-xl object-cover border border-[#e8eddb]" />
          <span className="font-extrabold text-[#001e2b] font-display">{p.productName}</span>
        </div>
      )
    },
    { header: t('adminProducts.colFarmerFpo', { defaultValue: 'FARMER / FPO' }), key: 'farmerName' },
    { header: t('adminProducts.colCategory', { defaultValue: 'CATEGORY' }), key: 'category' },
    {
      header: t('adminProducts.colPriceUnit', { defaultValue: 'PRICE / UNIT' }),
      key: 'pricePerUnit',
      render: (p) => <span className="font-black text-[#001e2b] font-display">₹{p.pricePerUnit} / {p.unit}</span>
    },
    { header: t('adminProducts.colListingStatus', { defaultValue: 'LISTING STATUS' }), key: 'status', type: 'status' },
    {
      header: t('adminProducts.colActions', { defaultValue: 'ACTIONS' }),
      key: 'actions',
      headerClassName: 'text-right',
      render: (p) => (
        <div className="text-right">
          {p.status === 'ACTIVE' ? (
            <Button variant="danger" size="sm" onClick={() => updateStatus(p._id, 'INACTIVE')}>
              {t('adminProducts.disableListing', { defaultValue: 'Disable Listing' })}
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => updateStatus(p._id, 'ACTIVE')}>
              {t('adminProducts.enableListing', { defaultValue: 'Enable Listing' })}
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('common.catalogModeration')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('common.productModeration')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('common.reviewActiveDraftAndPausedCrop')}</p>
      </div>

      <div className="flex gap-2 flex-wrap bg-white p-3 rounded-3xl border border-[#e8eddb] shadow-sm">
        {['', 'ACTIVE', 'DRAFT', 'INACTIVE', 'OUT_OF_STOCK'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all font-display ${
              filter === s ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s ? translateStatus(t, s) : t('adminProducts.allListings', { defaultValue: 'All Listings' })}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyTitle={t('adminProducts.noProduceListingsFound', { defaultValue: 'No produce listings found' })}
      />
    </div>
  );
}
