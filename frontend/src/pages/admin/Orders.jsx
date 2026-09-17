import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Components';
import adminService from '../../services/adminService';

export default function AdminOrders() {
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
      header: 'Order Reference',
      key: '_id',
      render: (o) => <span className="font-mono text-xs text-gray-500 font-bold">#{o._id?.slice(-8)}</span>
    },
    {
      header: 'Produce Item',
      key: 'productName',
      render: (o) => <span className="font-extrabold text-[#001e2b] font-display">{o.productName}</span>
    },
    { header: 'Buyer', key: 'buyerName' },
    { header: 'Farmer / FPO', key: 'farmerName' },
    { header: 'Total Value', key: 'totalAmount', type: 'currency' },
    { header: 'Payment Status', key: 'paymentStatus', type: 'status' },
    { header: 'Order Status', key: 'orderStatus', type: 'status' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Platform Fulfillment</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">All Platform Orders</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">Full oversight of orders, fulfillment statuses, and buyer/farmer transactions.</p>
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
            {s || 'All Orders'}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyTitle="No orders found"
      />
    </div>
  );
}
