import { useTranslation } from 'react-i18next';
import { translateStatus } from '../../utils/enumTranslations';
import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Components';
import adminService from '../../services/adminService';

export default function AdminOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetch(); }, [filter]);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.orderStatus = filter;
      const res = await adminService.getOrders(params);
      setOrders(res.orders || []);
    } catch {} finally { setLoading(false); }
  };

  const columns = [
    {
      header: t('adminOrders.colOrderRef', { defaultValue: 'ORDER REFERENCE' }),
      key: '_id',
      render: (o) => <span className="font-mono text-xs text-gray-500 font-bold">#{o._id?.slice(-8)}</span>
    },
    {
      header: t('adminOrders.colProduceItem', { defaultValue: 'PRODUCE ITEM' }),
      key: 'productName',
      render: (o) => <span className="font-extrabold text-[#001e2b] font-display">{o.productName}</span>
    },
    { header: t('adminOrders.colBuyer', { defaultValue: 'BUYER' }), key: 'buyerName' },
    { header: t('adminOrders.colFarmerFpo', { defaultValue: 'FARMER / FPO' }), key: 'farmerName' },
    { header: t('adminOrders.colTotalValue', { defaultValue: 'TOTAL VALUE' }), key: 'totalAmount', type: 'currency' },
    { header: t('adminOrders.colPaymentStatus', { defaultValue: 'PAYMENT STATUS' }), key: 'paymentStatus', type: 'status' },
    { header: t('adminOrders.colOrderStatus', { defaultValue: 'ORDER STATUS' }), key: 'orderStatus', type: 'status' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('common.platformFulfillment')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('common.allPlatformOrders')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('common.fullOversightOfOrdersFulfillmentStatuses')}</p>
      </div>

      <div className="flex gap-2 flex-wrap bg-white p-3 rounded-3xl border border-[#e8eddb] shadow-sm">
        {['', 'CREATED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all font-display ${
              filter === s ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s ? translateStatus(t, s) : t('adminOrders.allOrders', { defaultValue: 'All Orders' })}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyTitle={t('adminOrders.noOrdersFound', { defaultValue: 'No orders found' })}
      />
    </div>
  );
}
