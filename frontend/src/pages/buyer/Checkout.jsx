import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle } from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import Button from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import cartService from '../../services/cartService';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import toast from 'react-hot-toast';

export default function Checkout() {
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
    if (checkout.isMock || checkout.razorpayOrderId?.startsWith('order_mock_') || !window.Razorpay) {
      paymentService.verifyPayment({
        paymentId: checkout.paymentId,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_signature: 'mock_signature',
      }).then(resolve).catch(reject);
      return;
    }

    const razorpay = new window.Razorpay({
      key: checkout.keyId, amount: checkout.amount, currency: checkout.currency,
      name: 'AgriBazaar', description: `Order ${checkout.orderId}`, order_id: checkout.razorpayOrderId,
      handler: async (response) => {
        try {
          const verified = await paymentService.verifyPayment({ paymentId: checkout.paymentId, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature });
          if (!verified.verified) throw new Error('Payment is awaiting gateway confirmation.');
          resolve(verified);
        } catch (error) { reject(error); }
      },
      modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
      theme: { color: '#00684a' },
    });
    razorpay.on('payment.failed', (response) => {
      const errorMsg = response?.error?.description || 'Payment could not be completed on Razorpay.';
      reject(new Error(errorMsg));
    });
    razorpay.open();
  });


  const handleOrder = async () => {
    if (!address.deliveryAddress) { toast.error('Please enter delivery address.'); return; }
    setLoading(true);
    try {
      const items = cart.items.map(i => ({ productId: i.productId, quantity: i.quantity }));
      setPaymentError('');
      const created = await orderService.createOrder({ items, ...address });
      await loadRazorpay();
      for (const order of created.orders) {
        const checkout = await paymentService.createPaymentOrder(order._id);
        await openCheckout(checkout);
      }
      toast.success('Payment verified successfully!');
      setStep(3);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Payment could not be completed.';
      setPaymentError(message);
      toast.error(message);
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
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Payment Verified</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-3">Payment Successful!</h1>
          <p className="mt-2 text-sm text-gray-600 font-sans max-w-md mx-auto">Your payment was verified by AgriBazaar. Track delivery updates in your orders tab.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/buyer/orders')}>
              View My Orders
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/marketplace')}>
              Continue Shopping
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
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Secure Settlement</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Checkout</h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">Complete your shipping address and review produce details.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-10 bg-white p-4 rounded-3xl border border-[#e8eddb] max-w-md shadow-sm">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black font-display transition-colors ${step >= s ? 'bg-[#00ed64] text-[#001e2b]' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
              <span className={`text-xs font-bold font-display uppercase tracking-wider ${step >= s ? 'text-[#001e2b]' : 'text-gray-400'}`}>{s === 1 ? '1. Shipping' : '2. Payment'}</span>
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
                <h2 className="text-lg font-extrabold text-[#001e2b] font-display">Delivery Address</h2>
                <p className="text-xs text-gray-500 font-sans">Where should the farmer ship your produce?</p>
              </div>
            </div>

            <div className="space-y-4">
              <TextArea
                label="Full Delivery Address *"
                required
                rows={2}
                placeholder="Street address, building, village..."
                value={address.deliveryAddress}
                onChange={e => setAddress({ ...address, deliveryAddress: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City / District"
                  placeholder="e.g. Pune"
                  value={address.deliveryCity}
                  onChange={e => setAddress({ ...address, deliveryCity: e.target.value })}
                />
                <Input
                  label="State"
                  placeholder="e.g. Maharashtra"
                  value={address.deliveryState}
                  onChange={e => setAddress({ ...address, deliveryState: e.target.value })}
                />
                <Input
                  label="Pincode"
                  placeholder="e.g. 411001"
                  value={address.deliveryPincode}
                  onChange={e => setAddress({ ...address, deliveryPincode: e.target.value })}
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => { if (!address.deliveryAddress) { toast.error('Address required.'); return; } setStep(2); }}
            >
              Continue to Order Review →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e8eddb] p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-extrabold text-[#001e2b] font-display border-b border-[#f0f4e8] pb-4">Items Summary</h2>
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
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-bold text-[#001e2b] font-display">₹{cart.totalAmount}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="text-[#00684a] font-bold font-display">Free</span></div>
                <div className="flex justify-between text-xl font-black text-[#001e2b] border-t border-[#f0f4e8] pt-3 mt-3 font-display"><span>Total Order</span><span>₹{cart.totalAmount}</span></div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e8eddb] p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-[#f0f4e8] pb-4">
                <div className="w-10 h-10 bg-[#001e2b] text-[#00ed64] rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#001e2b] font-display">Secure Payment</h2>
                  <p className="text-xs text-gray-500 font-sans">Razorpay Test Mode</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Your order is confirmed only after Razorpay payment verification succeeds.
              </p>

              {paymentError && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">Payment Failed: {paymentError}</p>}

              <div className="flex gap-3">
                <Button variant="outline" size="md" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" size="md" fullWidth loading={loading} onClick={handleOrder}>
                  Pay Securely · ₹{cart.totalAmount}
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
