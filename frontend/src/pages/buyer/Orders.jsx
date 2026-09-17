import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Components';
import orderService from '../../services/orderService';
import toast from 'react-hot-toast';

const tabs = ['ALL', 'CREATED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL');

  useEffect(() => { fetchOrders(); }, [tab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getBuyerOrders({ status: tab });
      setOrders(res.orders || []);
    } catch { toast.error('Failed to load orders.'); }
    finally { setLoading(false); }
  };

  const columns = [
    {
      header: 'Produce Item',
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
      header: 'Farmer / Producer',
      key: 'farmerName',
      render: (o) => <span className="font-bold text-[#001e2b] text-xs font-display">{o.farmerName}</span>
    },
    {
      header: 'Quantity',
      key: 'quantity',
      render: (o) => <span className="font-semibold text-gray-700">{o.quantity} {o.unit}</span>
    },
    { header: 'Total Price', key: 'totalAmount', type: 'currency' },
    { header: 'Order Status', key: 'orderStatus', type: 'status' },
    {
      header: 'Action',
      key: 'action',
      headerClassName: 'text-right',
      render: (o) => (
        <div className="text-right">
          <Link to={`/marketplace/${o.productId}`}>
            <Button variant="ghost" size="sm">View Crop</Button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Order Tracking</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">My Orders</h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">View shipment progress and purchase history across all sellers.</p>
        </div>
        <Link to="/marketplace">
          <Button variant="primary" size="md">Browse Produce</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap bg-white p-3 rounded-3xl border border-[#e8eddb] shadow-sm">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all font-display ${
              tab === t ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t === 'ALL' ? 'All Orders' : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyTitle="No orders found"
        emptyDescription="Your placed produce orders will appear here."
      />
    </div>
  );
}
