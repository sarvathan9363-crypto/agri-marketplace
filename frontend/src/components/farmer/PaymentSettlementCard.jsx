import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertTriangle, Clock, RefreshCw, ShieldCheck, HelpCircle } from 'lucide-react';
import farmerService from '../../services/farmerService';
import toast from 'react-hot-toast';

export default function PaymentSettlementCard() {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await farmerService.getPaymentAccountStatus();
      setAccountData(res);
    } catch {
      toast.error('Failed to load payment settlement status.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!accountData) return;
    const { sellerStatus } = accountData;

    setActionLoading(true);
    try {
      if (sellerStatus === 'NOT_STARTED' || sellerStatus === 'REJECTED') {
        const res = await farmerService.initiatePaymentAccountOnboarding();
        if (res.onboardingUrl) {
          window.open(res.onboardingUrl, '_blank');
        } else if (res.message) {
          toast(res.message, { icon: res.success ? 'ℹ️' : '⚠️' });
        }
      } else if (sellerStatus === 'ONBOARDING' || sellerStatus === 'PENDING') {
        const res = await farmerService.refreshPaymentAccountStatus();
        if (res.message) toast.info(res.message);
        else toast.success('Status updated!');
      } else if (sellerStatus === 'SUSPENDED') {
        toast.info('Please contact AgriBazaar support at support@agribazaar.org');
      } else {
        const res = await farmerService.refreshPaymentAccountStatus();
        if (res.message) toast.info(res.message);
      }
      await fetchStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
      </div>
    );
  }

  const sellerStatus = accountData?.sellerStatus || 'NOT_STARTED';
  const routeEnabled = accountData?.routeEnabled ?? false;
  const lastSynced = accountData?.lastSyncedAt ? new Date(accountData.lastSyncedAt).toLocaleString() : 'Never';
  const bankInfo = accountData?.bankInfo;

  const statusConfigs = {
    NOT_STARTED: {
      badgeBg: 'bg-gray-100 text-gray-700 border-gray-300',
      badgeText: 'Payment account not connected',
      headline: 'Payment & Settlement Setup',
      description: 'Connect your payment settlement account to receive direct payouts for marketplace produce orders.',
      buttonText: 'Connect Payment Account',
      buttonVariant: 'bg-[#001e2b] text-[#00ed64] hover:bg-[#002b3d]',
      icon: CreditCard,
    },
    ONBOARDING: {
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
      badgeText: 'Payment account setup in progress',
      headline: 'Settlement Verification Underway',
      description: 'Razorpay is reviewing your submitted seller account details and banking information.',
      buttonText: 'Continue Setup',
      buttonVariant: 'bg-amber-600 text-white hover:bg-amber-700',
      icon: Clock,
    },
    PENDING: {
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
      badgeText: 'Razorpay verification pending',
      headline: 'Razorpay Verification In Progress',
      description: 'Account information has been submitted. Verification is pending Razorpay compliance approval.',
      buttonText: 'Check Status',
      buttonVariant: 'bg-amber-600 text-white hover:bg-amber-700',
      icon: Clock,
    },
    ACTIVE: {
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      badgeText: '✓ Payment account connected',
      headline: 'Settlement Account Active',
      description: 'Your Razorpay linked account is active. Marketplace sales payouts will settle automatically.',
      buttonText: 'Payment Account Connected',
      buttonVariant: 'bg-emerald-600 text-white cursor_default opacity-90',
      icon: CheckCircle2,
    },
    REJECTED: {
      badgeBg: 'bg-red-50 text-red-800 border-red-300',
      badgeText: 'Razorpay verification/review required',
      headline: 'Verification Review Required',
      description: accountData?.rejectionReason || 'Additional documents or review required by Razorpay.',
      buttonText: 'Resolve Verification',
      buttonVariant: 'bg-red-600 text-white hover:bg-red-700',
      icon: AlertTriangle,
    },
    SUSPENDED: {
      badgeBg: 'bg-red-50 text-red-800 border-red-300',
      badgeText: 'Payment settlement temporarily unavailable',
      headline: 'Settlement Suspended',
      description: 'Payment settlements are temporarily unavailable for this account. Please contact support.',
      buttonText: 'Contact Support',
      buttonVariant: 'bg-gray-800 text-white hover:bg-gray-900',
      icon: HelpCircle,
    },
  };

  const cfg = statusConfigs[sellerStatus] || statusConfigs.NOT_STARTED;
  const StatusIcon = cfg.icon;

  return (
    <div className="bg-white rounded-3xl border-2 border-[#e8eddb] p-6 shadow-sm hover:border-[#00684a] transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">
              Government Settlement Portal
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${cfg.badgeBg}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {cfg.badgeText}
            </span>
          </div>

          <h2 className="text-xl font-black text-[#001e2b] font-display flex items-center gap-2">
            Payment & Settlement
          </h2>

          <p className="text-xs text-gray-600 font-sans leading-relaxed max-w-2xl">
            {cfg.description}
          </p>

          {!routeEnabled && (
            <p className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-xl font-sans inline-block">
              ℹ️ Marketplace settlement setup is pending Razorpay activation. Normal checkout payments continue working normally.
            </p>
          )}

          {/* Masked Banking Metadata */}
          {bankInfo && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700 bg-[#fafcf8] border border-[#e8eddb] p-3 rounded-2xl font-sans mt-2">
              <div><span className="font-bold text-[#001e2b]">Bank:</span> {bankInfo.bankName}</div>
              <div><span className="font-bold text-[#001e2b]">Account:</span> {bankInfo.accountNumberMasked}</div>
              <div><span className="font-bold text-[#001e2b]">IFSC:</span> {bankInfo.ifsc}</div>
              {accountData?.linkedAccountId && (
                <div><span className="font-bold text-[#001e2b]">Linked Account:</span> {accountData.linkedAccountId}</div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 font-sans pt-1">
            <span>Settlement: <strong className="text-[#001e2b]">{accountData?.settlementEnabled ? 'Enabled' : 'Pending'}</strong></span>
            <span>·</span>
            <span>Last Synced: <strong className="text-[#001e2b]">{lastSynced}</strong></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 justify-center">
          <button
            type="button"
            disabled={actionLoading || sellerStatus === 'ACTIVE'}
            onClick={handleAction}
            className={`px-6 py-3 rounded-2xl text-xs font-black transition-all font-display shadow-sm flex items-center justify-center gap-2 ${cfg.buttonVariant}`}
          >
            {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            {cfg.buttonText}
          </button>

          <button
            type="button"
            onClick={fetchStatus}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}
