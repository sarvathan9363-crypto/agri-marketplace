import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { TextArea } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Components';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminDisputes() {
  const { t } = useTranslation();
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
      header: t('adminDisputes.colComplainant', { defaultValue: 'COMPLAINANT' }),
      key: 'raisedByName',
      render: (d) => <span className="font-extrabold text-[#001e2b] font-display">{d.raisedByName}</span>
    },
    { header: t('adminDisputes.colReason', { defaultValue: 'DISPUTE REASON' }), key: 'reason' },
    { header: t('adminDisputes.colStatus', { defaultValue: 'STATUS' }), key: 'status', type: 'status' },
    {
      header: t('adminDisputes.colActions', { defaultValue: 'ACTIONS' }),
      key: 'actions',
      headerClassName: 'text-right',
      render: (d) => (
        <div className="flex gap-2 justify-end">
          {d.status === 'OPEN' && (
            <>
              <Button variant="outline" size="sm" onClick={() => update(d._id, 'UNDER_REVIEW')}>
                {t('common.review', { defaultValue: 'Review' })}
              </Button>
              <Button variant="primary" size="sm" onClick={() => setModal(d)}>
                {t('common.resolve', { defaultValue: 'Resolve' })}
              </Button>
            </>
          )}
          {d.status === 'UNDER_REVIEW' && (
            <Button variant="primary" size="sm" onClick={() => setModal(d)}>
              {t('adminDisputes.resolveIssue', { defaultValue: 'Resolve Issue' })}
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('common.conflictOversight')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('common.disputeResolution')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('common.arbitrateBuyerAndFarmerClaimsQuality')}</p>
      </div>

      <DataTable
        columns={columns}
        data={disputes}
        loading={loading}
        emptyTitle={t('adminDisputes.noDisputes', { defaultValue: 'No open disputes' })}
        emptyDescription={t('adminDisputes.noDisputesDesc', { defaultValue: 'Platform trade operations are running smoothly with 0 open claims.' })}
      />

      {/* Resolution Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e8eddb] shadow-2xl p-8 max-w-md w-full space-y-4">
            <h3 className="text-xl font-extrabold text-[#001e2b] font-display">{t('common.resolveDispute')}</h3>
            <p className="text-xs text-gray-500 font-sans">Issue: {modal.reason}</p>
            <TextArea
              rows={3}
              placeholder={t('adminDisputes.placeholderResponse', { defaultValue: 'Admin response details...' })}
              value={response}
              onChange={e => setResponse(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="md" onClick={() => { setModal(null); setResponse(''); }}>
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button variant="danger" size="md" onClick={() => update(modal._id, 'REJECTED')}>
                {t('adminDisputes.rejectClaim', { defaultValue: 'Reject Claim' })}
              </Button>
              <Button variant="primary" size="md" onClick={() => update(modal._id, 'RESOLVED')}>
                {t('adminDisputes.resolveClaim', { defaultValue: 'Resolve Claim' })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
