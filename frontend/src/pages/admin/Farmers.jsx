import { useTranslation } from 'react-i18next';
import { translateStatus } from '../../utils/enumTranslations';
import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { TextArea } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Components';
import BlockchainAuditBadge from '../../components/common/BlockchainAuditBadge';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminFarmers() {
  const { t } = useTranslation();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [verifyModal, setVerifyModal] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => { fetchFarmers(); }, [filter]);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.verificationStatus = filter;
      const res = await adminService.getFarmers(params);
      setFarmers(res.farmers || []);
    } catch {} finally { setLoading(false); }
  };

  const handleVerify = async (id, status) => {
    try {
      await adminService.verifyFarmer(id, { status, notes });
      toast.success(`Farmer verification ${status.toLowerCase()}.`);
      setVerifyModal(null);
      setNotes('');
      fetchFarmers();
    } catch { toast.error('Failed to update verification.'); }
  };

  const statuses = ['', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'];

  const columns = [
    {
      header: t('adminFarmers.colFarmerName', { defaultValue: 'FARMER / FPO NAME' }),
      key: 'fullName',
      render: (f) => (
        <div>
          <p className="font-extrabold text-[#001e2b] font-display">{f.fullName}</p>
          <p className="text-xs text-gray-500 font-sans">{f.farmName}</p>
        </div>
      )
    },
    { header: t('adminFarmers.colSellerType', { defaultValue: 'SELLER TYPE' }), key: 'farmerType' },
    {
      header: t('adminFarmers.colContactInfo', { defaultValue: 'CONTACT INFO' }),
      key: 'contact',
      render: (f) => (
        <div className="text-xs font-sans">
          <p className="font-bold text-[#001e2b]">{f.email}</p>
          <p className="text-gray-500">{f.mobileNumber}</p>
        </div>
      )
    },
    { header: t('adminFarmers.colLocation', { defaultValue: 'LOCATION' }), key: 'location' },
    { header: t('adminFarmers.colVerification', { defaultValue: 'VERIFICATION' }), key: 'verificationStatus', type: 'status' },
    {
      header: t('adminFarmers.colAuditProvenance', { defaultValue: 'AUDIT PROVENANCE' }),
      key: 'audit',
      render: (f) => <BlockchainAuditBadge entityType="FARMER" entityId={f._id} compact={true} />
    },
    {
      header: t('adminFarmers.colActions', { defaultValue: 'ACTIONS' }),
      key: 'actions',
      headerClassName: 'text-right',
      render: (f) => (
        <div className="flex gap-2 justify-end">
          {f.verificationStatus === 'PENDING_VERIFICATION' && (
            <>
              <Button variant="primary" size="sm" onClick={() => handleVerify(f._id, 'VERIFIED')}>
                {t('common.verify', { defaultValue: 'Verify' })}
              </Button>
              <Button variant="danger" size="sm" onClick={() => setVerifyModal(f)}>
                {t('common.reject', { defaultValue: 'Reject' })}
              </Button>
            </>
          )}
          {f.verificationStatus === 'REJECTED' && (
            <Button variant="primary" size="sm" onClick={() => handleVerify(f._id, 'VERIFIED')}>
              {t('adminFarmers.approveVerification', { defaultValue: 'Approve Verification' })}
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('common.kycVerificationPipeline')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('adminFarmers.approvalHeadline', { defaultValue: 'Farmers & FPOs Approval' })}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('common.reviewFarmRegistrationsVerifyIdentityAnd')}</p>
      </div>

      <div className="flex gap-2 flex-wrap bg-white p-3 rounded-3xl border border-[#e8eddb] shadow-sm">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all font-display ${
              filter === s ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s ? translateStatus(t, s) : t('adminFarmers.allApplications', { defaultValue: 'All Applications' })}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={farmers}
        loading={loading}
        emptyTitle={t('adminFarmers.noVerificationApps', { defaultValue: 'No verification applications found' })}
      />

      {/* Reject Modal */}
      {verifyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e8eddb] shadow-2xl p-8 max-w-md w-full space-y-4">
            <h3 className="text-xl font-extrabold text-[#001e2b] font-display">{t('adminFarmers.rejectFarmerModalTitle', { name: verifyModal.fullName, defaultValue: `Reject ${verifyModal.fullName}?` })}</h3>
            <TextArea
              rows={3}
              placeholder={t('adminFarmers.placeholderRejection', { defaultValue: 'Provide reason for verification rejection...' })}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="md" onClick={() => { setVerifyModal(null); setNotes(''); }}>
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </Button>
              <Button variant="danger" size="md" onClick={() => handleVerify(verifyModal._id, 'REJECTED')}>
                {t('adminFarmers.rejectFarmerBtn', { defaultValue: 'Reject Farmer' })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
