import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Components';
import BlockchainAuditBadge from '../../components/common/BlockchainAuditBadge';
import orderService from '../../services/orderService';
import toast from 'react-hot-toast';
import { translateStatus, translateUnit } from '../../utils/enumTranslations';

const tabs = ['ALL', 'CREATED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];

export default function FarmerOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL');

  useEffect(() => { fetchOrders(); }, [tab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getFarmerOrders({ status: tab });
      setOrders(res.orders || []);
    } catch {
      toast.error(t('farmerOrders.failedToLoadOrders', { defaultValue: 'Failed to load orders.' }));
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, orderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { orderStatus });
      toast.success(t('farmerOrders.statusUpdatedToast', { status: translateStatus(t, orderStatus), defaultValue: `Order status updated to ${orderStatus}.` }));
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || t('farmerOrders.failedToUpdateStatus', { defaultValue: 'Failed to update order status.' }));
    }
  };

  const columns = [
    {
      header: t('farmerOrders.colProduceItems', { defaultValue: 'PRODUCE ITEMS' }),
      key: 'productName',
      render: (o) => (
        <div className="flex items-center gap-3">
          <img src={o.productImage || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=80'} alt="" className="w-10 h-10 rounded-xl object-cover border border-[#e8eddb]" />
          <div>
            <p className="font-extrabold text-[#001e2b] font-display">{o.productName}</p>
            <p className="text-xs text-gray-500 font-sans">ID: #{o._id?.slice(-6)}</p>
          </div>
        </div>
      )
    },
    {
      header: t('farmerOrders.colBuyerInfo', { defaultValue: 'BUYER INFO' }),
      key: 'buyerName',
      render: (o) => (
        <div>
          <p className="font-bold text-[#001e2b] text-xs font-display">{o.buyerName}</p>
          <p className="text-[11px] text-gray-500 font-sans">{o.deliveryCity || t('farmerOrders.standardDelivery', { defaultValue: 'Standard Delivery' })}</p>
        </div>
      )
    },
    {
      header: t('farmerOrders.colQuantity', { defaultValue: 'QUANTITY' }),
      key: 'quantity',
      render: (o) => <span className="font-bold text-gray-700">{o.quantity} {translateUnit(t, o.unit)}</span>
    },
    { header: t('farmerOrders.colTotalValue', { defaultValue: 'TOTAL VALUE' }), key: 'totalAmount', type: 'currency' },
    {
      header: t('farmerOrders.colOrderStatus', { defaultValue: 'ORDER STATUS' }),
      key: 'orderStatus',
      render: (o) => (
        <div className="flex flex-col gap-1">
          <StatusBadge status={o.orderStatus} />
        </div>
      )
    },
    {
      header: t('farmerOrders.colAuditProvenance', { defaultValue: 'AUDIT PROVENANCE' }),
      key: 'audit',
      render: (o) => <BlockchainAuditBadge entityType="ORDER" entityId={o._id} compact={true} />
    },
    {
      header: t('farmerOrders.colActions', { defaultValue: 'ACTIONS' }),
      key: 'actions',
      headerClassName: 'text-right',
      render: (o) => (
        <div className="flex items-center justify-end gap-2">
          {o.orderStatus === 'CREATED' && (
            <>
              <Button variant="primary" size="sm" onClick={() => updateStatus(o._id, 'CONFIRMED')}>
                {t('farmerOrders.confirmBtn', { defaultValue: 'Confirm' })}
              </Button>
              <Button variant="danger" size="sm" onClick={() => updateStatus(o._id, 'CANCELLED')}>
                {t('farmerOrders.cancelBtn', { defaultValue: 'Cancel' })}
              </Button>
            </>
          )}
          {o.orderStatus === 'CONFIRMED' && (
            <Button variant="secondary" size="sm" onClick={() => updateStatus(o._id, 'DISPATCHED')}>
              {t('farmerOrders.dispatchBtn', { defaultValue: 'Dispatch' })}
            </Button>
          )}
          {o.orderStatus === 'DISPATCHED' && (
            <Button variant="primary" size="sm" onClick={() => updateStatus(o._id, 'DELIVERED')}>
              {t('farmerOrders.markDeliveredBtn', { defaultValue: 'Mark Delivered' })}
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('farmerOrders.orderManagement')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('farmerOrders.incomingProduceOrders')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('farmerOrders.fulfillPurchaseOrdersReceivedFromRetail')}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap bg-white p-3 rounded-3xl border border-[#e8eddb] shadow-sm">
        {tabs.map(tKey => (
          <button
            key={tKey}
            onClick={() => setTab(tKey)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all font-display ${
              tab === tKey ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tKey === 'ALL' ? t('farmerOrders.allOrdersTab', { defaultValue: 'All Orders' }) : translateStatus(t, tKey)}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyTitle={t('farmerOrders.noOrdersInStatus', { defaultValue: 'No orders in this status' })}
        emptyDescription={t('farmerOrders.noOrdersDescription', { defaultValue: 'When buyers place orders for your produce, they will show up here.' })}
      />
    </div>
  );
}
