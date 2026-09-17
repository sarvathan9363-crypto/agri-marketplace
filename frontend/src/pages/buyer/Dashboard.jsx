import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, DollarSign, Package } from 'lucide-react';
import { StatsCard, StatusBadge, LoadingState } from '../../components/ui/Components';
import ProductCard from '../../components/common/ProductCard';
import buyerService from '../../services/buyerService';
import toast from 'react-hot-toast';

export default function BuyerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buyerService.getDashboard().then(r => setData(r.dashboard)).catch(() => toast.error('Failed to load dashboard.')).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Buyer Portal</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Buyer Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">Track your orders, spending, and fresh produce recommendations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={ShoppingBag} label="Total Orders" value={data.totalOrders} color="primary" />
        <StatsCard icon={Package} label="Active Orders" value={data.activeOrders} color="amber" />
        <StatsCard icon={TrendingUp} label="Completed" value={data.completedOrders} color="emerald" />
        <StatsCard icon={DollarSign} label="Total Spent" value={`₹${(data.totalSpent || 0).toLocaleString()}`} color="blue" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 border-b border-[#f0f4e8] pb-4">
          <h2 className="font-extrabold text-[#001e2b] text-lg font-display">Recent Orders</h2>
          <Link to="/buyer/orders" className="text-xs font-bold text-[#00684a] hover:underline font-display">View All Orders →</Link>
        </div>
        {data.recentOrders?.length > 0 ? (
          <div className="space-y-3">
            {data.recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-[#001e2b] font-display">{order.productName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.farmerName} · {order.quantity} {order.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#001e2b] font-display">₹{order.totalAmount}</p>
                  <StatusBadge status={order.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">No orders placed yet.</p>
            <Link to="/marketplace" className="mt-3 inline-block btn-mongo-primary text-xs px-5 py-2.5">Browse Marketplace</Link>
          </div>
        )}
      </div>

      {/* Recommended */}
      {data.recommendedProducts?.length > 0 && (
        <div>
          <h2 className="font-extrabold text-[#001e2b] text-xl mb-4 font-display">Recommended Produce</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recommendedProducts.slice(0, 3).map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
