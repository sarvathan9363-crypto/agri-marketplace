import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, MapPin, CheckCircle, Clock, ShieldCheck, Star, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Components';
import BlockchainAuditBadge from '../../components/common/BlockchainAuditBadge';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import transportService from '../../services/transportService';
import toast from 'react-hot-toast';
import TransportQuoteSelector from '../buyer/TransportQuoteSelector';
import { translateStatus } from '../../utils/enumTranslations';

const tabs = ['ALL', 'CREATED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];

export default function BuyerOrders() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [tab, setTab] = useState('ALL');
  const [selectedTransportReqId, setSelectedTransportReqId] = useState(null);
  const [viewOrderModal, setViewOrderModal] = useState(null);

  useEffect(() => { fetchOrders(); }, [tab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getBuyerOrders({ status: tab });
      setOrders(res.orders || []);
    } catch {
      toast.error(t('buyerOrders.failedToLoadOrders', { defaultValue: 'Failed to load orders.' }));
    } finally {
      setLoading(false);
    }
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
      const targetId = order.orderGroupId || order._id;
      const checkout = await paymentService.createPaymentOrder(targetId);
      if (checkout.isMock || checkout.razorpayOrderId?.startsWith('order_mock_') || !window.Razorpay) {
        await paymentService.verifyPayment({
          paymentId: checkout.paymentId,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'mock_signature',
        });
        toast.success(t('checkout.paymentVerified', { defaultValue: 'Payment verified successfully!' }));
        fetchOrders();
        if (viewOrderModal) setViewOrderModal(null);
        return;
      }

      const razorpay = new window.Razorpay({
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: 'AgriBazaar',
        description: `Order ${checkout.orderId}`,
        order_id: checkout.razorpayOrderId,
        handler: async (response) => {
          try {
            const verified = await paymentService.verifyPayment({
              paymentId: checkout.paymentId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (!verified.verified) throw new Error('Payment is awaiting gateway confirmation.');
            toast.success(t('checkout.paymentVerified', { defaultValue: 'Payment verified successfully!' }));
            fetchOrders();
            if (viewOrderModal) setViewOrderModal(null);
          } catch (error) {
            toast.error(error.message || 'Payment verification failed.');
          }
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

  const handleRequestTransportForOrder = async (order) => {
    try {
      const crops = order.items?.map(i => i.productName).join(', ') || 'Agricultural Produce';
      const totalQty = order.items?.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0) || 1;
      const itemsList = order.items?.map(i => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unit: i.unit || 'KG',
        weightKg: Number(i.quantity) || 10,
        farmerId: i.farmerId,
      })) || [];

      const res = await transportService.createRequest({
        orderId: order._id,
        orderGroupId: order.orderGroupId || '',
        cropName: crops,
        quantity: totalQty,
        unit: order.items?.[0]?.unit || 'KG',
        pickupLocation: 'Multi-Farmer Farm Gates',
        deliveryLocation: [order.deliveryAddress, order.deliveryCity, order.deliveryState, order.deliveryPincode].filter(Boolean).join(', ') || 'Buyer Address',
        deliveryCity: order.deliveryCity || '',
        deliveryState: order.deliveryState || '',
        deliveryPincode: order.deliveryPincode || '',
        estimatedWeightKg: order.totalWeightKg || totalQty * 10,
        items: itemsList,
        forceNew: true,
      });
      toast.success(t('transport.requestCreated', { defaultValue: 'Transport request sent! Transporters will submit quotations.' }));
      setSelectedTransportReqId(res.request._id);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || t('transport.failedToCreateRequest', { defaultValue: 'Could not create transport request.' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">
            {t('buyerOrders.orderTracking', { defaultValue: 'ORDER TRACKING & FULFILLMENT' })}
          </span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">
            {t('buyerOrders.myOrders', { defaultValue: 'My Orders' })}
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            {t('buyerOrders.orderLevelDesc', { defaultValue: 'Manage order-level cargo transport requests, transporter quotations, and payment settlements.' })}
          </p>
        </div>
        <Link to="/marketplace">
          <Button variant="primary" size="md">{t('buyerOrders.browseProduce', { defaultValue: 'Browse Produce' })}</Button>
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

      {/* Orders List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#e8eddb]">
          <p className="text-sm font-bold text-gray-500">{t('common.loading', { defaultValue: 'Loading orders...' })}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#e8eddb] space-y-3">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-[#001e2b]">{t('buyerOrders.noOrdersFound', { defaultValue: 'No orders found' })}</h3>
          <p className="text-xs text-gray-500">{t('buyerOrders.noOrdersDesc', { defaultValue: 'Your placed produce orders will appear here.' })}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const trDoc = order.transportRequestId;
            const quote = trDoc?.selectedQuotationId;

            return (
              <div
                key={order.orderGroupId || order._id}
                className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-sm space-y-5 transition hover:border-[#00684a]/40"
              >
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f4e8] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00684a] font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-[#001e2b] font-display">{order.orderNumber}</span>
                        <span className="text-xs text-gray-400 font-mono">({new Date(order.createdAt).toLocaleDateString()})</span>
                      </div>
                      <p className="text-xs text-gray-500 font-sans mt-0.5">
                        {order.itemCount} {t('buyerOrders.products', { defaultValue: 'Products' })} · {order.farmerCount} {t('buyerOrders.farmers', { defaultValue: 'Farmers' })} · {order.totalWeightKg} KG Cargo
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={order.orderStatus} />
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-display ${order.paymentStatus === 'CAPTURED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                      {order.paymentStatus === 'CAPTURED' ? t('status.paid', { defaultValue: 'PAID' }) : t('status.pendingPayment', { defaultValue: 'PAYMENT PENDING' })}
                    </span>
                    <BlockchainAuditBadge entityType="ORDER" entityId={order._id} compact={true} />
                  </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  {/* Products */}
                  <div className="md:col-span-6 space-y-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-display">
                      {t('buyerOrders.includedProducts', { defaultValue: 'Included Produce Items' })}
                    </p>
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div key={item._id || idx} className="flex items-center justify-between p-2.5 bg-[#fafcf8] rounded-2xl border border-[#e8eddb] text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={item.productImage || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=80'} alt="" className="w-8 h-8 rounded-lg object-cover border border-[#e8eddb]" />
                            <div className="truncate">
                              <span className="font-extrabold text-[#001e2b] font-display block truncate">{item.productName}</span>
                              <span className="text-[11px] text-gray-500 font-sans">{item.farmerName}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-gray-700 block">{item.quantity} {item.unit}</span>
                            <span className="font-black text-[#001e2b] font-display">₹{item.totalAmount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transport */}
                  <div className="md:col-span-3 bg-[#fafcf8] p-4 rounded-2xl border border-[#e8eddb] space-y-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-display">
                      {t('buyerOrders.transportFreightStatus', { defaultValue: 'Transport Status' })}
                    </p>
                    {trDoc ? (
                      <div className="space-y-1.5">
                        {quote ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-300">
                              ✓ {t('transport.transporterSelected', { defaultValue: 'Transporter Selected' })}
                            </span>
                            <p className="text-xs font-bold text-[#001e2b] truncate font-display">
                              🚚 {quote.transporterCompany || quote.transporterName}
                            </p>
                            <p className="text-xs font-black text-[#00684a] font-display">
                              ₹{order.transportCharge}
                            </p>
                          </div>
                        ) : order.quotesCount > 0 ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200 font-display">
                              🟢 {order.quotesCount} {t('transport.quotationsAvailable', { defaultValue: 'Quotations Available' })}
                            </span>
                            <p className="text-[11px] text-gray-500">{t('transport.selectToFinalize', { defaultValue: 'Select quotation to finalize.' })}</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-lg border border-amber-200 font-display">
                              🟡 {t('transport.awaitingQuotations', { defaultValue: 'Awaiting Quotations' })}
                            </span>
                            <p className="text-[11px] text-gray-500">{t('transport.transportersNotified', { defaultValue: 'Transporters notified.' })}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs text-gray-400 italic block">{t('transport.notRequested', { defaultValue: 'Transport Not Requested' })}</span>
                        <button
                          onClick={() => handleRequestTransportForOrder(order)}
                          className="mt-2 text-xs font-bold text-[#00684a] hover:underline block font-display"
                        >
                          + {t('transport.requestTransport', { defaultValue: 'Request Transport' })}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Payment & Actions */}
                  <div className="md:col-span-3 text-right space-y-3 border-t md:border-t-0 md:border-l border-[#f0f4e8] pt-3 md:pt-0 md:pl-4">
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-display">
                        {t('buyerOrders.totalPayable', { defaultValue: 'Total Payable' })}
                      </p>
                      <p className="text-2xl font-black text-[#001e2b] font-display">₹{order.finalPayableAmount}</p>
                      <p className="text-[11px] text-gray-500 font-mono">
                        ({t('buyerOrders.produceLabel', { defaultValue: 'Produce' })} ₹{order.totalProductAmount} {order.transportCharge > 0 ? `+ ${t('buyerOrders.transportLabel', { defaultValue: 'Transport' })} ₹${order.transportCharge}` : ''})
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setViewOrderModal(order)}>
                          {t('buyerOrders.viewOrder', { defaultValue: 'View Order' })}
                        </Button>

                        {trDoc && (
                          <Button variant="ghost" size="sm" onClick={() => setSelectedTransportReqId(trDoc._id || trDoc)}>
                            {order.quotesCount > 0 ? `${t('transport.quotations', { defaultValue: 'Quotes' })} (${order.quotesCount})` : t('transport.quotations', { defaultValue: 'Quotations' })}
                          </Button>
                        )}
                      </div>

                      {order.paymentStatus === 'CAPTURED' ? (
                        <div className="text-center p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold font-display">
                          ✓ {t('status.paid', { defaultValue: 'PAID' })}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {!order.paymentAllowed && (
                            <div className="text-center p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold font-display">
                              🔒 {order.quotesCount > 0 
                                ? t('transport.quotationsAvailableSelectionRequired', { count: order.quotesCount, defaultValue: `${order.quotesCount} Quotations Available - Selection Required` })
                                : t('transport.awaitingTransporterQuotations', { defaultValue: 'Awaiting Transporter Quotations' })}
                            </div>
                          )}
                          <Button
                            variant="primary"
                            size="md"
                            fullWidth
                            onClick={() => {
                              const targetId = order.orderGroupId || order._id;
                              navigate('/buyer/checkout?orderGroupId=' + encodeURIComponent(targetId), { state: { orderGroupId: targetId } });
                            }}
                          >
                            {order.paymentAllowed
                              ? `${t('common.payNow', { defaultValue: 'Pay Now' })} →`
                              : `${t('checkout.continueCheckout', { defaultValue: 'Continue Checkout' })} →`}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW ORDER DETAILS MODAL */}
      {viewOrderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e8eddb] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#f0f4e8] pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#00684a] bg-[#00ed64]/20 px-3 py-1 rounded-full font-display">
                  {t('buyerOrders.orderDetails', { defaultValue: 'Order Details' })}
                </span>
                <h2 className="text-2xl font-black text-[#001e2b] font-display mt-2">
                  {viewOrderModal.orderNumber}
                </h2>
                <p className="text-xs text-gray-500 font-sans">
                  {t('buyerOrders.placedOn', { defaultValue: 'Placed on' })}: {new Date(viewOrderModal.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setViewOrderModal(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl border border-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Products Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-[#001e2b] uppercase tracking-wider font-display">
                {t('buyerOrders.orderProducts', { defaultValue: 'Order Products' })} ({viewOrderModal.itemCount})
              </h3>
              <div className="space-y-2">
                {viewOrderModal.items?.map((item, idx) => (
                  <div key={item._id || idx} className="p-3 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.productImage || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=80'} alt="" className="w-12 h-12 rounded-xl object-cover border border-[#e8eddb]" />
                      <div>
                        <p className="font-extrabold text-[#001e2b] text-sm font-display">{item.productName}</p>
                        <p className="text-xs text-gray-500 font-sans">Seller / Farmer: {item.farmerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-700">{item.quantity} {item.unit} × ₹{item.pricePerUnit}</p>
                      <p className="text-sm font-black text-[#001e2b] font-display">₹{item.totalAmount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pickup & Delivery */}
            <div className="grid md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="bg-[#fafcf8] p-4 rounded-2xl border border-[#e8eddb] space-y-2">
                <h4 className="font-extrabold text-[#001e2b] font-display uppercase tracking-wider text-[11px]">
                  📍 {t('transport.pickupLocations', { defaultValue: 'Pickup Locations (Multi-Farmer)' })}
                </h4>
                {viewOrderModal.transportRequestId?.pickupLocations?.length > 0 ? (
                  <div className="space-y-2">
                    {viewOrderModal.transportRequestId.pickupLocations.map((p, i) => (
                      <div key={i} className="p-2 bg-white rounded-xl border border-[#e8eddb]">
                        <p className="font-bold text-[#001e2b]">{p.farmerName}</p>
                        <p className="text-gray-600 text-[11px]">{p.address}</p>
                        <p className="text-[#00684a] text-[10px] font-mono mt-0.5">Items: {p.items?.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">{t('transport.farmGatePickupLocations', { defaultValue: 'Farm Gate Pickup Locations' })}</p>
                )}
              </div>

              <div className="bg-[#fafcf8] p-4 rounded-2xl border border-[#e8eddb] space-y-2">
                <h4 className="font-extrabold text-[#001e2b] font-display uppercase tracking-wider text-[11px]">
                  🚚 {t('transport.deliveryAddress', { defaultValue: 'Delivery Address' })}
                </h4>
                <p className="font-bold text-[#001e2b]">{viewOrderModal.deliveryAddress}</p>
                {(viewOrderModal.deliveryCity || viewOrderModal.deliveryState) && (
                  <p className="text-gray-600">{viewOrderModal.deliveryCity}, {viewOrderModal.deliveryState} - {viewOrderModal.deliveryPincode}</p>
                )}
              </div>
            </div>

            {/* Transport Info */}
            <div className="bg-[#fafcf8] p-4 rounded-2xl border border-[#e8eddb] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-[#001e2b] font-display text-sm">
                  {t('transport.transportDetails', { defaultValue: 'Transport & Freight Details' })}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Status: <span className="font-bold text-[#00684a]">{viewOrderModal.transportStatus}</span> · Quotes: {viewOrderModal.quotesCount}
                </p>
              </div>

              {viewOrderModal.transportRequestId && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const trId = viewOrderModal.transportRequestId._id || viewOrderModal.transportRequestId;
                    setViewOrderModal(null);
                    setSelectedTransportReqId(trId);
                  }}
                >
                  {t('transport.viewSelectQuotes', { defaultValue: 'View Transport Quotations' })} →
                </Button>
              )}
            </div>

            {/* Order Billing Summary */}
            <div className="bg-[#001e2b] text-white p-5 rounded-2xl space-y-3 font-display">
              <h4 className="font-black text-[#00ed64] uppercase tracking-wider text-xs">
                {t('checkout.orderSummary', { defaultValue: 'Order Payment Summary' })}
              </h4>
              <div className="space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>{t('checkout.productSubtotal', { defaultValue: 'Product Subtotal' })}</span>
                  <span className="font-bold text-white">₹{viewOrderModal.totalProductAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('transport.transportChargeLabel', { defaultValue: 'Transport & Freight Charge' })}</span>
                  <span className="font-bold text-white">₹{viewOrderModal.transportCharge}</span>
                </div>
                <div className="flex justify-between border-t border-[#003847] pt-2 text-base font-black text-white">
                  <span>{t('checkout.finalPayableAmount', { defaultValue: 'Final Payable Amount' })}</span>
                  <span className="text-[#00ed64]">₹{viewOrderModal.finalPayableAmount}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-[#f0f4e8] pt-4">
              <Button variant="outline" size="md" onClick={() => setViewOrderModal(null)}>
                {t('common.close', { defaultValue: 'Close' })}
              </Button>
              {viewOrderModal.paymentStatus === 'CAPTURED' ? (
                <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold font-display">
                  ✓ {t('status.paid', { defaultValue: 'PAID' })}
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    const targetId = viewOrderModal.orderGroupId || viewOrderModal._id;
                    setViewOrderModal(null);
                    navigate('/buyer/checkout?orderGroupId=' + encodeURIComponent(targetId), { state: { orderGroupId: targetId } });
                  }}
                >
                  {viewOrderModal.paymentAllowed
                    ? `${t('common.payNow', { defaultValue: 'Pay Now' })} →`
                    : `${t('checkout.continueCheckout', { defaultValue: 'Continue Checkout' })} →`}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TRANSPORT QUOTE SELECTOR MODAL */}
      {selectedTransportReqId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <TransportQuoteSelector
              requestId={selectedTransportReqId}
              onSelectQuote={() => {
                setSelectedTransportReqId(null);
                fetchOrders();
              }}
              onClose={() => setSelectedTransportReqId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
