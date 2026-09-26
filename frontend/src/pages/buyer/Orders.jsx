import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Components';
import BlockchainAuditBadge from '../../components/common/BlockchainAuditBadge';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import toast from 'react-hot-toast';

import { translateStatus } from '../../utils/enumTranslations';

const tabs = ['ALL', 'CREATED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];

export default function BuyerOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [tab, setTab] = useState('ALL');

  useEffect(() => { fetchOrders(); }, [tab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getBuyerOrders({ status: tab });
      setOrders(res.orders || []);
    } catch { toast.error(t('buyerOrders.failedToLoadOrders', { defaultValue: 'Failed to load orders.' })); }
    finally { setLoading(false); }
  };

  const loadRazorpay = () => new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Unable to load secure payment checkout.'));
    document.body.appendChild(script);
  });

  const handlePayNow = async (order) => {
    setPayingOrderId(order._id);
    try {
      await loadRazorpay();
      const checkout = await paymentService.createPaymentOrder(order._id);
      if (checkout.isMock || checkout.razorpayOrderId?.startsWith('order_mock_') || !window.Razorpay) {
        await paymentService.verifyPayment({
          paymentId: checkout.paymentId,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'mock_signature',
        });
        toast.success('Payment verified successfully!');
        fetchOrders();
        return;
      }

      const razorpay = new window.Razorpay({
        key: checkout.keyId, amount: checkout.amount, currency: checkout.currency,
        name: 'AgriBazaar', description: `Order ${checkout.orderId}`, order_id: checkout.razorpayOrderId,
        handler: async (response) => {
          try {
            const verified = await paymentService.verifyPayment({
              paymentId: checkout.paymentId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            if (!verified.verified) throw new Error('Payment is awaiting gateway confirmation.');
            toast.success('Payment verified successfully!');
            fetchOrders();
          } catch (error) { toast.error(error.message || 'Payment verification failed.'); }
        },
        modal: { ondismiss: () => toast.error('Payment was cancelled.') },
        theme: { color: '#00684a' },
      });
      razorpay.on('payment.failed', (response) => {
        toast.error(response?.error?.description || 'Payment failed on Razorpay.');
      });
      razorpay.open();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Unable to initiate payment.');
    } finally {
      setPayingOrderId(null);
    }
  };

  const columns = [
    {
      header: t('buyerOrders.colProduceItem', { defaultValue: 'PRODUCE ITEM' }),
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
      header: t('buyerOrders.colFarmerProducer', { defaultValue: 'FARMER / PRODUCER' }),
      key: 'farmerName',
      render: (o) => <span className="font-bold text-[#001e2b] text-xs font-display">{o.farmerName}</span>
    },
    {
      header: t('buyerOrders.colQuantity', { defaultValue: 'QUANTITY' }),
      key: 'quantity',
      render: (o) => <span className="font-semibold text-gray-700">{o.quantity} {o.unit}</span>
    },
    { header: t('buyerOrders.colTotalPrice', { defaultValue: 'TOTAL PRICE' }), key: 'totalAmount', type: 'currency' },
    { header: t('buyerOrders.colOrderStatus', { defaultValue: 'ORDER STATUS' }), key: 'orderStatus', type: 'status' },
    {
      header: t('buyerOrders.colBlockchainAudit', { defaultValue: 'BLOCKCHAIN AUDIT' }),
      key: 'audit',
      render: (o) => <BlockchainAuditBadge entityType="ORDER" entityId={o._id} compact={true} />
    },
    {
      header: t('buyerOrders.colAction', { defaultValue: 'ACTION' }),
      key: 'action',
      headerClassName: 'text-right',
      render: (o) => (
        <div className="flex items-center justify-end gap-2">
          {o.orderStatus === 'PENDING_PAYMENT' && (
            <Button
              variant="primary"
              size="sm"
              loading={payingOrderId === o._id}
              onClick={() => handlePayNow(o)}
            >
              {t('common.payNow', { defaultValue: 'Pay Now' })}
            </Button>
          )}
          <Link to={`/marketplace/${o.productId}`}>
            <Button variant="ghost" size="sm">{t('buyerOrders.viewCrop')}</Button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('buyerOrders.orderTracking')}</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('buyerOrders.myOrders')}</h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">{t('buyerOrders.viewShipmentProgressAndPurchaseHistory')}</p>
        </div>
        <Link to="/marketplace">
          <Button variant="primary" size="md">{t('buyerOrders.browseProduce')}</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap bg-white p-3 rounded-3xl border border-[#e8eddb] shadow-sm">
        {tabs.map(tabItem => (
          <button
            key={tabItem}
            onClick={() => setTab(tabItem)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all font-display ${
              tab === tabItem ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tabItem === 'ALL' ? t('common.allOrders', { defaultValue: 'All Orders' }) : translateStatus(t, tabItem)}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyTitle={t('buyerOrders.noOrdersFound', { defaultValue: 'No orders found' })}
        emptyDescription={t('buyerOrders.noOrdersDesc', { defaultValue: 'Your placed produce orders will appear here.' })}
      />
    </div>
  );
}
