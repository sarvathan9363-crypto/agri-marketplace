import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, TrendingUp, AlertCircle, DollarSign, PlusCircle } from 'lucide-react';
import { StatsCard, StatusBadge, LoadingState } from '../../components/ui/Components';
import farmerService from '../../services/farmerService';
import toast from 'react-hot-toast';

export default function FarmerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await farmerService.getDashboard();
      setData(res.dashboard);
    } catch {
      toast.error('Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Seller Dashboard</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Farmer Overview</h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">Manage your agricultural products, incoming orders, and revenue.</p>
        </div>
        <Link to="/farmer/products/add" className="btn-mongo-primary text-sm px-6 py-3">
          <PlusCircle className="w-4 h-4" /> Add New Listing
        </Link>
      </div>

      {data.verificationStatus === 'PENDING_VERIFICATION' && (
        <div className="p-5 bg-[#fffbeb] border border-amber-300 rounded-2xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-900 font-display">Verification Pending</p>
            <p className="text-xs text-amber-700 mt-0.5 font-sans">Your farm profile is currently under review by AgriBazaar admin. You can save products as DRAFT.</p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={Package} label="Total Products" value={data.totalProducts} color="primary" />
        <StatsCard icon={Package} label="Active Listings" value={data.activeListings} color="emerald" />
        <StatsCard icon={ShoppingBag} label="Pending Orders" value={data.pendingOrders} color="amber" />
        <StatsCard icon={DollarSign} label="Total Sales" value={`₹${(data.totalSales || 0).toLocaleString()}`} color="blue" />
      </div>

      {/* Tables Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5 border-b border-[#f0f4e8] pb-4">
            <h2 className="font-extrabold text-[#001e2b] text-lg font-display">Recent Orders</h2>
            <Link to="/farmer/orders" className="text-xs font-bold text-[#00684a] hover:underline font-display">View All →</Link>
          </div>
          {data.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {data.recentOrders.map(order => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-[#001e2b] font-display">{order.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.buyerName} · {order.quantity} {order.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#001e2b] font-display">₹{order.totalAmount}</p>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-10 font-sans">No orders received yet.</p>
          )}
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5 border-b border-[#f0f4e8] pb-4">
            <h2 className="font-extrabold text-[#001e2b] text-lg font-display">Active Listings</h2>
            <Link to="/farmer/products" className="text-xs font-bold text-[#00684a] hover:underline font-display">View All →</Link>
          </div>
          {data.activeProducts?.length > 0 ? (
            <div className="space-y-3">
              {data.activeProducts.map(product => (
                <div key={product._id} className="flex items-center gap-3.5 p-3.5 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl">
                  <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100'} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#001e2b] truncate font-display">{product.productName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{product.quantity} {product.unit} · ₹{product.pricePerUnit}/{product.unit}</p>
                  </div>
                  <StatusBadge status={product.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400">No active listings.</p>
              <Link to="/farmer/products/add" className="mt-3 inline-block btn-mongo-primary text-xs px-4 py-2">+ Add Product</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
