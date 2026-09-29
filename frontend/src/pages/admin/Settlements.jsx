import { useTranslation } from 'react-i18next';
import { translateStatus } from '../../utils/enumTranslations';
import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import adminService from '../../services/adminService';
import BlockchainAuditBadge from '../../components/common/BlockchainAuditBadge';
import toast from 'react-hot-toast';
import { DollarSign, ShieldCheck, CreditCard, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminSettlements() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeEnabled, setRouteEnabled] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSettlements();
  }, [filterStatus]);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const res = await adminService.getFarmerSettlements({
        status: filterStatus || undefined,
        search: searchTerm || undefined,
      });
      setItems(res.items || []);
      setRouteEnabled(res.routeEnabled ?? false);
    } catch {
      toast.error('Failed to load farmer settlements.');
    } finally {
      setLoading(false);
    }
  };

  const statusBadgeColors = {
    NOT_STARTED: 'bg-gray-100 text-gray-700 border-gray-300',
    ONBOARDING: 'bg-amber-50 text-amber-800 border-amber-300',
    PENDING: 'bg-amber-50 text-amber-800 border-amber-300',
    ACTIVE: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    REJECTED: 'bg-red-50 text-red-800 border-red-300',
    SUSPENDED: 'bg-red-50 text-red-800 border-red-300',
  };

  const columns = [
    {
      header: t('adminSettlements.colFarmerProducer', { defaultValue: 'FARMER / PRODUCER' }),
      key: 'fullName',
      render: (f) => (
        <div>
          <p className="font-extrabold text-[#001e2b] font-display">{f.fullName}</p>
          <p className="text-xs text-gray-500 font-sans">{f.farmName} · #{f._id?.slice(-6)}</p>
        </div>
      ),
    },
    {
      header: t('adminSettlements.colVerification', { defaultValue: 'AGRIBAZAAR VERIFICATION' }),
      key: 'verificationStatus',
      render: (f) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
          f.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {f.verificationStatus === 'VERIFIED' ? t('status.verified', { defaultValue: 'VERIFIED' }) : t('status.pendingVerification', { defaultValue: 'PENDING VERIFICATION' })}
        </span>
      ),
    },
    {
      header: t('adminSettlements.colRazorpayStatus', { defaultValue: 'RAZORPAY SELLER STATUS' }),
      key: 'razorpaySellerStatus',
      render: (f) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadgeColors[f.razorpaySellerStatus] || statusBadgeColors.NOT_STARTED}`}>
          {translateStatus(t, f.razorpaySellerStatus)}
        </span>
      ),
    },
    {
      header: t('adminSettlements.colSettlementAccount', { defaultValue: 'SETTLEMENT ACCOUNT' }),
      key: 'bankAccountMasked',
      render: (f) => (
        <div className="text-xs font-sans text-gray-700">
          <p><span className="font-bold text-[#001e2b]">{t('admin.account')}</span> {f.bankAccountMasked}</p>
          <p><span className="font-bold text-[#001e2b]">{t('admin.ifsc')}</span> {f.ifsc}</p>
          {f.linkedAccountIdMasked && (
            <p className="text-[#00684a] font-mono text-[10px] mt-0.5">Linked: {f.linkedAccountIdMasked}</p>
          )}
        </div>
      ),
    },
    {
      header: t('adminSettlements.colTotalSettled', { defaultValue: 'TOTAL SETTLED' }),
      key: 'totalSettled',
      render: (f) => <span className="font-black text-[#00684a] font-display">₹{f.totalSettled.toLocaleString()}</span>,
    },
    {
      header: t('adminSettlements.colPendingSettlement', { defaultValue: 'PENDING SETTLEMENT' }),
      key: 'pendingAmount',
      render: (f) => <span className="font-bold text-amber-700 font-display">₹{f.pendingAmount.toLocaleString()}</span>,
    },
    {
      header: t('adminSettlements.colAuditProvenance', { defaultValue: 'AUDIT PROVENANCE' }),
      key: 'audit',
      render: (f) => <BlockchainAuditBadge entityType="SETTLEMENT" entityId={f._id} compact={true} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">
            {t('adminSettlements.financialControlBadge', { defaultValue: 'Marketplace Financial Control' })}
          </span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">
            {t('adminSettlements.headline', { defaultValue: 'Payment & Settlement Overview' })}
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            {t('adminSettlements.subtitle', { defaultValue: 'Track Razorpay seller account onboarding, Route activation, and marketplace split settlements across farmers.' })}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchSettlements}
          className="btn-mongo-primary text-xs px-4 py-2.5 flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> {t('adminSettlements.refreshSettlements', { defaultValue: 'Refresh Settlements' })}
        </button>
      </div>

      {!routeEnabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs font-sans text-amber-900 space-y-1">
            <p className="font-bold text-sm">{t('adminSettlements.razorpayRoutePendingTitle', { defaultValue: 'Razorpay Route Capability is Pending Activation (Test Mode)' })}</p>
            <p>
              {t('adminSettlements.razorpayRoutePendingDesc', { defaultValue: 'Environment flag RAZORPAY_ROUTE_ENABLED=false is active. Normal buyer checkout payments function properly. Marketplace farmer settlements remain recorded as PENDING until Razorpay Route is enabled on your merchant account.' })}
            </p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap bg-white p-3 rounded-3xl border border-[#e8eddb] shadow-sm">
        {['', 'ACTIVE', 'PENDING', 'ONBOARDING', 'NOT_STARTED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all font-display ${
              filterStatus === st ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {st === '' ? t('adminSettlements.allFarmers', { defaultValue: 'All Farmers' }) : translateStatus(t, st)}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        emptyTitle={t('adminSettlements.noSettlementRecords', { defaultValue: 'No seller settlement records' })}
        emptyDescription={t('adminSettlements.noSettlementDesc', { defaultValue: 'Farmer settlement statuses will appear here.' })}
      />
    </div>
  );
}
