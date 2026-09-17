import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { LoadingState, EmptyState } from '../../components/ui/Components';
import PageContainer from '../../components/ui/PageContainer';
import Button from '../../components/ui/Button';
import cartService from '../../services/cartService';
import toast from 'react-hot-toast';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try { const res = await cartService.getCart(); setCart(res.cart); }
    catch {} finally { setLoading(false); }
  };

  const updateQty = async (itemId, qty) => {
    if (qty < 1) return;
    try { const res = await cartService.updateCartItem(itemId, qty); setCart(res.cart); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to update.'); }
  };

  const remove = async (itemId) => {
    try { const res = await cartService.removeFromCart(itemId); setCart(res.cart); toast.success('Item removed.'); }
    catch { toast.error('Failed to remove.'); }
  };

  if (loading) return <LoadingState />;

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <PageContainer className="py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping cart is empty"
          description="Browse the agricultural marketplace and add produce directly from verified farmers."
          action={
            <Link to="/marketplace">
              <Button variant="primary" size="md">Browse Marketplace</Button>
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <div className="min-h-[calc(100vh-var(--app-header-height))] bg-[#fafcf8] py-8">
      <PageContainer>
        <div className="mb-8">
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Checkout Bag</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Shopping Cart</h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">Review your selected agricultural items before proceeding to payment.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {items.map(item => (
              <div key={item._id} className="bg-white rounded-3xl border border-[#e8eddb] p-5 flex flex-col sm:flex-row gap-5 items-center justify-between shadow-sm">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img src={item.productImage || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100'} alt="" className="w-20 h-20 rounded-2xl object-cover border border-[#e8eddb]" />
                  <div>
                    <Link to={`/marketplace/${item.productId}`} className="font-extrabold text-[#001e2b] hover:text-[#00684a] text-lg font-display">{item.productName}</Link>
                    <p className="text-xs text-gray-500 font-sans mt-0.5">{item.farmerName}</p>
                    <p className="text-xs font-black text-[#001e2b] font-display mt-1">₹{item.pricePerUnit} / {item.unit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between border-t sm:border-t-0 border-[#f0f4e8] pt-3 sm:pt-0">
                  <div className="flex items-center border border-[#d0d7de] rounded-xl overflow-hidden bg-white">
                    <button onClick={() => updateQty(item._id, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gray-100 font-bold"><Minus className="w-3.5 h-3.5 text-[#001e2b]" /></button>
                    <span className="px-3 text-sm font-black text-[#001e2b] min-w-[2.5rem] text-center font-display">{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.quantity + 1)} className="px-3 py-1.5 hover:bg-gray-100 font-bold"><Plus className="w-3.5 h-3.5 text-[#001e2b]" /></button>
                  </div>
                  <p className="font-black text-[#001e2b] text-lg min-w-[5rem] text-right font-display">₹{item.subtotal}</p>
                  <button onClick={() => remove(item._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#e8eddb] p-6 lg:p-8 shadow-sm lg:sticky lg:top-6">
            <h2 className="font-extrabold text-[#001e2b] text-xl mb-6 font-display border-b border-[#f0f4e8] pb-4">Order Summary</h2>
            <div className="space-y-4 text-sm font-sans">
              <div className="flex justify-between text-gray-600"><span className="font-medium">Items Subtotal</span><span className="font-bold text-[#001e2b] font-display">₹{cart.totalAmount}</span></div>
              <div className="flex justify-between text-gray-600"><span className="font-medium">Estimated Shipping</span><span className="text-[#00684a] font-bold uppercase tracking-wider font-display">Free Direct Delivery</span></div>
              <div className="flex justify-between border-t border-[#f0f4e8] pt-4"><span className="font-extrabold text-[#001e2b] text-base font-display">Total Amount</span><span className="text-2xl font-black text-[#001e2b] font-display">₹{cart.totalAmount}</span></div>
            </div>
            <div className="mt-8">
              <Button variant="primary" size="lg" fullWidth icon={ArrowRight} onClick={() => navigate('/buyer/checkout')}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
