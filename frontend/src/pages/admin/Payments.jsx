import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
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
    {
      header: 'Amount',
      key: 'amount',
      render: (p) => (
        <span className="font-extrabold font-display text-gray-900">
          ₹{(Number(p.amount || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
    { header: 'Status', key: 'status', type: 'status' },
    {
      header: 'Date',
      key: 'createdAt',
      render: (p) => <span className="text-xs text-gray-500 font-sans">{new Date(p.createdAt || Date.now()).toLocaleDateString()}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Financial Audit</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Payment Audit Logs</h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">Audit platform transaction settlements and gateway status logs.</p>
        </div>

        <Link
          to="/admin/blockchain"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#001e2b] to-[#003846] text-white hover:brightness-125 transition-all shadow-md"
        >
          <ShieldCheck className="w-4 h-4 text-[#00ed64]" />
          View On-Chain Blockchain Audit
        </Link>
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
