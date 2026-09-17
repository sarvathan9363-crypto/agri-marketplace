import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import adminService from '../../services/adminService';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getPayments().then(r => setPayments(r.payments || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      header: 'Payment Tx Reference',
      key: '_id',
      render: (p) => <span className="font-mono text-xs text-gray-500 font-bold">#PAY-{p._id?.slice(-8)}</span>
    },
    { header: 'Amount', key: 'amount', type: 'currency' },
    { header: 'Status', key: 'status', type: 'status' },
    {
      header: 'Date',
      key: 'createdAt',
      render: (p) => <span className="text-xs text-gray-500 font-sans">{new Date(p.createdAt || Date.now()).toLocaleDateString()}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Financial Audit</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Payment Audit Logs</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">Audit platform transaction settlements and gateway status logs.</p>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        emptyTitle="No payment records found"
        emptyDescription="Transactions will be recorded here when buyer orders are processed."
      />
    </div>
  );
}
