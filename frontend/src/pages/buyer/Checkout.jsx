import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle } from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import Button from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import cartService from '../../services/cartService';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [address, setAddress] = useState({ deliveryAddress: '', deliveryCity: '', deliveryState: '', deliveryPincode: '' });
  const navigate = useNavigate();

  useEffect(() => {
    cartService.getCart().then(r => {
      setCart(r.cart);
      if (!r.cart?.items?.length) navigate('/buyer/cart');
    });
  }, []);

  const loadRazorpay = () => new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Unable to load secure payment checkout.'));
    document.body.appendChild(script);
  });

  const openCheckout = (checkout) => new Promise((resolve, reject) => {
    const razorpayOrderId = checkout.razorpayOrderId || checkout.order_id || checkout.id;
    const razorpayKey = checkout.keyId || checkout.key || checkout.key_id;

    if (checkout.isMock || razorpayOrderId?.startsWith('order_mock_') || !window.Razorpay) {
      paymentService.verifyPayment({
        paymentId: checkout.paymentId,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_signature: 'mock_signature',
      }).then(resolve).catch(reject);
      return;
    }

    const rawContact = String(user?.mobileNumber || user?.phone || '').replace(/\D/g, '');
    const validContact = rawContact.length >= 10 ? rawContact.slice(-10) : '';

    const prefillObj = {
      name: user?.fullName || 'AgriBazaar Customer',
      email: user?.email || '',
    };
    if (validContact) {
      prefillObj.contact = validContact;
    }

    const options = {
      key: razorpayKey,
      amount: checkout.amount,
      currency: checkout.currency || 'INR',
      name: 'AgriBazaar',
      description: `Order ${checkout.orderId}`,
      order_id: razorpayOrderId,
      prefill: prefillObj,
      notes: {
        orderId: String(checkout.orderId),
      },
      handler: async (response) => {
        try {
          const verified = await paymentService.verifyPayment({
            paymentId: checkout.paymentId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (!verified.verified) throw new Error('Payment is awaiting gateway confirmation.');
          resolve(verified);
        } catch (error) { reject(error); }
      },
      modal: {
        ondismiss: async () => {
          try {
            const statusRes = await paymentService.getPaymentStatus(checkout.paymentId);
            if (statusRes && statusRes.verified) {
              return resolve(statusRes);
            }
          } catch {
            // ignore fallback
          }
          reject(new Error('Payment was cancelled.'));
        },
      },
      theme: { color: '#00684a' },
    };

    if (import.meta.env.DEV) {
      console.log('[Checkout] Initializing Razorpay Checkout with options:', {
        key: options.key,
        amount: options.amount,
        currency: options.currency,
        order_id: options.order_id,
        orderId: checkout.orderId,
        paymentId: checkout.paymentId,
        prefill: options.prefill,
      });
    }

    const razorpay = new window.Razorpay(options);

    razorpay.on('payment.failed', async (response) => {
      if (import.meta.env.DEV) {
        console.log('[Checkout] Razorpay payment.failed event received:', {
          code: response?.error?.code,
          description: response?.error?.description,
          reason: response?.error?.reason,
          payment_id: response?.error?.metadata?.payment_id,
          order_id: response?.error?.metadata?.order_id,
        });
      }

      const gatewayPaymentId = response?.error?.metadata?.payment_id;

      if (gatewayPaymentId) {
        try {
          // Query backend for authoritative Razorpay server-side status
          const statusRes = await paymentService.getPaymentStatus(checkout.paymentId, gatewayPaymentId);
          const paymentStatus = statusRes?.payment?.status || (statusRes?.verified ? 'CAPTURED' : 'PENDING');

          if (paymentStatus === 'CAPTURED' || statusRes?.verified) {
            return resolve(statusRes);
          } else if (paymentStatus === 'AUTHORIZED') {
            const err = new Error('Payment authorization is pending. We are confirming your payment.');
            err.isPendingStatus = true;
            return reject(err);
          } else if (paymentStatus === 'CREATED' || paymentStatus === 'PENDING') {
            const err = new Error('Payment is still being processed. Please wait while we confirm your payment.');
            err.isPendingStatus = true;
            return reject(err);
          } else if (paymentStatus === 'REFUNDED') {
            return reject(new Error('Payment was refunded.'));
          } else if (paymentStatus === 'FAILED') {
            const description = response?.error?.description || 'Payment was declined by bank or gateway.';
            return reject(new Error(description));
          }
        } catch (err) {
          if (import.meta.env.DEV) console.warn('[Checkout] Server payment status check error:', err.message);
        }
      }

      const errorMsg = response?.error?.description || 'Payment could not be completed on Razorpay.';
      reject(new Error(errorMsg));
    });

    razorpay.open();
  });

  const handleOrder = async () => {
    if (!address.deliveryAddress) { toast.error(t('checkout.enterAddress')); return; }
    setLoading(true);
    try {
      const items = cart.items.map(i => ({ productId: i.productId, quantity: i.quantity }));
      setPaymentError('');
      const created = await orderService.createOrder({ items, ...address });
      await loadRazorpay();
      const targetId = created.orderGroupId || created.orders?.[0]?._id;
      const checkout = await paymentService.createPaymentOrder(targetId);
      await openCheckout(checkout);
      toast.success(t('checkout.paymentVerified'));
      setStep(3);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Payment could not be completed.';
      setPaymentError(message);
      if (err.isPendingStatus) {
        toast(message, { icon: '⏳', duration: 6000 });
      } else {
        toast.error(message);
      }
    } finally { setLoading(false); }
  };

  if (!cart) return null;

  // Step 3: Success
  if (step === 3) {
    return (
      <div className="min-h-[calc(100vh-var(--app-header-height))] bg-[#fafcf8] py-16">
        <PageContainer className="max-w-xl text-center">
          <div className="w-20 h-20 bg-[#00ed64] text-[#001e2b] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircle className="w-10 h-10" />
          </div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('checkout.paymentVerifiedLabel')}</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-3">{t('checkout.paymentSuccess')}</h1>
          <p className="mt-2 text-sm text-gray-600 font-sans max-w-md mx-auto">{t('checkout.paymentVerifiedDescription')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/buyer/orders')}>
              {t('checkout.viewOrders')}
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/marketplace')}>
              {t('checkout.continueShopping')}
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-var(--app-header-height))] bg-[#fafcf8] py-10">
      <PageContainer className="max-w-4xl">
        <div className="mb-8">
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('checkout.secureSettlement')}</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('checkout.title')}</h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">{t('checkout.addressReviewHint')}</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-10 bg-white p-4 rounded-3xl border border-[#e8eddb] max-w-md shadow-sm">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black font-display transition-colors ${step >= s ? 'bg-[#00ed64] text-[#001e2b]' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
              <span className={`text-xs font-bold font-display uppercase tracking-wider ${step >= s ? 'text-[#001e2b]' : 'text-gray-400'}`}>{s === 1 ? t('checkout.stepShipping', { defaultValue: '1. Shipping' }) : t('checkout.stepPayment', { defaultValue: '2. Payment' })}</span>
              {s < 2 && <div className="w-12 h-0.5 bg-[#e8eddb]" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-3xl border border-[#e8eddb] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-[#f0f4e8] pb-4">
              <div className="w-10 h-10 bg-[#00684a] text-white rounded-2xl flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#001e2b] font-display">{t('checkout.deliveryAddress')}</h2>
                <p className="text-xs text-gray-500 font-sans">{t('checkout.addressHint')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <TextArea
                label={t('checkout.fullDeliveryAddress', { defaultValue: 'Full Delivery Address *' })}
                required
                rows={2}
                placeholder={t('checkout.placeholderAddress', { defaultValue: 'Street address, building, village...' })}
                value={address.deliveryAddress}
                onChange={e => setAddress({ ...address, deliveryAddress: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={t('checkout.cityDistrict', { defaultValue: 'City / District' })}
                  placeholder={t('checkout.placeholderCity', { defaultValue: 'e.g. Pune' })}
                  value={address.deliveryCity}
                  onChange={e => setAddress({ ...address, deliveryCity: e.target.value })}
                />
                <Input
                  label={t('checkout.stateLabel', { defaultValue: 'State' })}
                  placeholder={t('checkout.placeholderState', { defaultValue: 'e.g. Maharashtra' })}
                  value={address.deliveryState}
                  onChange={e => setAddress({ ...address, deliveryState: e.target.value })}
                />
                <Input
                  label={t('checkout.pincodeLabel', { defaultValue: 'Pincode' })}
                  placeholder={t('checkout.placeholderPincode', { defaultValue: 'e.g. 411001' })}
                  value={address.deliveryPincode}
                  onChange={e => setAddress({ ...address, deliveryPincode: e.target.value })}
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => { if (!address.deliveryAddress) { toast.error(t('checkout.addressRequired', { defaultValue: 'Address required.' })); return; } setStep(2); }}
            >
              {t('checkout.continueToReview', { defaultValue: 'Continue to Order Review →' })}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e8eddb] p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-extrabold text-[#001e2b] font-display border-b border-[#f0f4e8] pb-4">{t('checkout.itemsSummary')}</h2>
              <div className="space-y-3">
                {cart.items.map(item => (
                  <div key={item._id} className="flex justify-between items-center p-4 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-[#001e2b] font-display">{item.productName}</p>
                      <p className="text-xs text-gray-500 font-sans mt-0.5">{item.farmerName} · {item.quantity} {item.unit}</p>
                    </div>
                    <p className="font-black text-[#001e2b] font-display">₹{item.subtotal}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#f0f4e8] space-y-2 text-sm font-sans">
                <div className="flex justify-between text-gray-600"><span>{t('checkout.subtotal')}</span><span className="font-bold text-[#001e2b] font-display">₹{cart.totalAmount}</span></div>
                <div className="flex justify-between text-gray-600"><span>{t('checkout.delivery')}</span><span className="text-[#00684a] font-bold font-display">{t('checkout.free')}</span></div>
                <div className="flex justify-between text-xl font-black text-[#001e2b] border-t border-[#f0f4e8] pt-3 mt-3 font-display"><span>{t('checkout.totalOrder')}</span><span>₹{cart.totalAmount}</span></div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e8eddb] p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-[#f0f4e8] pb-4">
                <div className="w-10 h-10 bg-[#001e2b] text-[#00ed64] rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#001e2b] font-display">{t('checkout.securePayment')}</h2>
                  <p className="text-xs text-gray-500 font-sans">{t('checkout.razorpayTestMode')}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                {t('checkout.razorpayVerificationNote', { defaultValue: 'Your order is confirmed only after Razorpay payment verification succeeds.' })}
              </p>

              {paymentError && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{t('checkout.paymentFailed')}: {paymentError}</p>}

              <div className="flex gap-3">
                <Button variant="outline" size="md" onClick={() => setStep(1)}>
                  {t('common.back', { defaultValue: 'Back' })}
                </Button>
                <Button variant="primary" size="md" fullWidth loading={loading} onClick={handleOrder}>
                  {t('checkout.paySecurely', { amount: cart.totalAmount, defaultValue: `Pay Securely · ₹${cart.totalAmount}` })}
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
