import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { TextArea } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Components';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    setLoading(true);
    try { const res = await adminService.getDisputes(); setDisputes(res.disputes || []); }
    catch {} finally { setLoading(false); }
  };

  const update = async (id, status) => {
    try {
      await adminService.updateDispute(id, { status, adminResponse: response });
      toast.success(`Dispute status updated to ${status.toLowerCase()}.`);
      setModal(null);
      setResponse('');
      fetch();
    } catch { toast.error('Failed to update dispute.'); }
  };

  const columns = [
    {
      header: 'Complainant',
      key: 'raisedByName',
      render: (d) => <span className="font-extrabold text-[#001e2b] font-display">{d.raisedByName}</span>
    },
    { header: 'Dispute Reason', key: 'reason' },
    { header: 'Status', key: 'status', type: 'status' },
    {
      header: 'Actions',
      key: 'actions',
      headerClassName: 'text-right',
      render: (d) => (
        <div className="flex gap-2 justify-end">
          {d.status === 'OPEN' && (
            <>
              <Button variant="outline" size="sm" onClick={() => update(d._id, 'UNDER_REVIEW')}>
                Review
              </Button>
              <Button variant="primary" size="sm" onClick={() => setModal(d)}>
                Resolve
              </Button>
            </>
          )}
          {d.status === 'UNDER_REVIEW' && (
            <Button variant="primary" size="sm" onClick={() => setModal(d)}>
              Resolve Issue
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Conflict Oversight</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Dispute Resolution</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">Arbitrate buyer and farmer claims, quality issues, or payment holds.</p>
      </div>

      <DataTable
        columns={columns}
        data={disputes}
        loading={loading}
        emptyTitle="No open disputes"
        emptyDescription="Platform trade operations are running smoothly with 0 open claims."
      />

      {/* Resolution Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e8eddb] shadow-2xl p-8 max-w-md w-full space-y-4">
            <h3 className="text-xl font-extrabold text-[#001e2b] font-display">Resolve Dispute</h3>
            <p className="text-xs text-gray-500 font-sans">Issue: {modal.reason}</p>
            <TextArea
              rows={3}
              placeholder="Admin response details..."
              value={response}
              onChange={e => setResponse(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="md" onClick={() => { setModal(null); setResponse(''); }}>
                Cancel
              </Button>
              <Button variant="danger" size="md" onClick={() => update(modal._id, 'REJECTED')}>
                Reject Claim
              </Button>
              <Button variant="primary" size="md" onClick={() => update(modal._id, 'RESOLVED')}>
                Resolve Claim
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
