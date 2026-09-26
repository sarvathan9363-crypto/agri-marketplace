import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, TrendingUp, DollarSign, Package, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { StatsCard, StatusBadge, LoadingState } from '../../components/ui/Components';
import ProductCard from '../../components/common/ProductCard';
import buyerService from '../../services/buyerService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getBuyerVerificationConfig } from '../../config/buyerVerificationConfig';
import { translateRole, translateStatus } from '../../utils/enumTranslations';

export default function BuyerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [data, setData] = useState(null);
  const [verification, setVerification] = useState(null);
  const [verStatus, setVerStatus] = useState('PENDING_VERIFICATION');
  const [loading, setLoading] = useState(true);

  const rawBuyerType = profile?.buyerType || 'INDIVIDUAL';
  const allConfigs = getBuyerVerificationConfig(t);
  const config = allConfigs[rawBuyerType] || allConfigs.INDIVIDUAL;

  useEffect(() => {
    Promise.all([
      buyerService.getDashboard(),
      buyerService.getVerificationStatus().catch(() => null),
    ])
      .then(([dashRes, verRes]) => {
        if (dashRes?.dashboard) setData(dashRes.dashboard);
        if (verRes?.verification) {
          setVerification(verRes.verification);
          setVerStatus(verRes.verificationStatus || 'PENDING_VERIFICATION');
        }
      })
      .catch(() => toast.error(t('buyerDashboard.failedToLoad', { defaultValue: 'Failed to load dashboard.' })))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return null;

  const isVerified = verStatus === 'VERIFIED';
  const stepList = config.steps.filter((s) => s.key !== 'summary');
  const completedCount = stepList.filter((s) => {
    const st = verification?.[s.key]?.status;
    return st === 'verified' || st === 'not_applicable';
  }).length;
  const totalSteps = stepList.length;

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('buyerDashboard.buyerPortal')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('buyerDashboard.buyerDashboard')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('buyerDashboard.trackYourOrdersSpendingAndFresh')}</p>
      </div>

      {user?.accountHash && (
        <div className="bg-[#001e2b] text-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-900/40">
          <div className="min-w-0">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00ed64] font-display flex items-center gap-1.5">
              {t('buyerDashboard.accountHashTitle', { defaultValue: '🛡️ BUYER CRYPTOGRAPHIC ACCOUNT HASH (ON-CHAIN IDENTITY)' })}
            </span>
            <p className="font-mono text-xs text-gray-300 mt-1 truncate max-w-full sm:max-w-xl" title={user.accountHash}>
              {user.accountHash}
            </p>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(user.accountHash); toast.success(t('buyerDashboard.accountHashCopied', { defaultValue: 'Buyer Account Hash copied!' })); }}
            className="px-3.5 py-1.5 bg-[#00ed64] text-[#001e2b] font-bold text-xs rounded-xl hover:bg-[#00c954] transition-colors shrink-0"
          >
            {t('common.copyHash', { defaultValue: '📋 Copy Hash' })}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={ShoppingBag} label={t('buyerDashboard.totalOrders', { defaultValue: 'Total Orders' })} value={data.totalOrders} color="primary" />
        <StatsCard icon={Package} label={t('buyerDashboard.activeOrders', { defaultValue: 'Active Orders' })} value={data.activeOrders} color="amber" />
        <StatsCard icon={TrendingUp} label={t('buyerDashboard.completed', { defaultValue: 'Completed' })} value={data.completedOrders} color="emerald" />
        <StatsCard icon={DollarSign} label={t('buyerDashboard.totalSpent', { defaultValue: 'Total Spent' })} value={`₹${(data.totalSpent || 0).toLocaleString()}`} color="blue" />
      </div>

      {/* DASHBOARD VERIFICATION SECTION */}
      <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-[#001e2b] text-lg font-display">{t('buyerDashboard.buyerVerificationStatus')}</h2>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border font-display ${isVerified ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                  {isVerified ? config.badgeText : translateStatus(t, 'PENDING_VERIFICATION')}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 font-sans">
                {isVerified
                  ? t('buyerDashboard.allRequiredVerificationCompleted', { defaultValue: 'All required verification checks have been successfully completed.' })
                  : t('buyerDashboard.completeVerificationSubtitle', { defaultValue: 'Complete your required verification steps to unlock verified buyer features.' })}
              </p>
              {!isVerified && (
                <div className="mt-2 flex items-center space-x-3 text-xs font-semibold text-gray-600 font-display">
                  <span>{t('buyerDashboard.progressText', { count: completedCount, total: totalSteps, defaultValue: `Progress: ${completedCount} of ${totalSteps} completed` })}</span>
                  <div className="w-32 bg-gray-100 rounded-full h-2 border border-gray-200">
                    <div className="bg-[#00684a] h-2 rounded-full transition-all" style={{ width: `${(completedCount / totalSteps) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {isVerified ? (
              <Link
                to="/buyer/verification"
                className="inline-flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold px-5 py-2.5 rounded-2xl transition font-display"
              >
                <span>{t('buyerDashboard.viewVerificationDetails')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={() => navigate('/buyer/verification/wizard')}
                className="inline-flex items-center space-x-2 bg-[#00684a] hover:bg-[#00523a] text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow transition font-display"
              >
                <span>{completedCount > 0 ? t('buyerDashboard.continueVerification', { defaultValue: 'Continue Verification' }) : t('buyerDashboard.startVerification', { defaultValue: 'Start Verification' })}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 border-b border-[#f0f4e8] pb-4">
          <h2 className="font-extrabold text-[#001e2b] text-lg font-display">{t('buyerDashboard.recentOrders')}</h2>
          <Link to="/buyer/orders" className="text-xs font-bold text-[#00684a] hover:underline font-display">{t('buyerDashboard.viewAllOrders', { defaultValue: 'View All Orders →' })}</Link>
        </div>
        {data.recentOrders?.length > 0 ? (
          <div className="space-y-3">
            {data.recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-[#001e2b] font-display">{order.productName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.farmerName} · {order.quantity} {order.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#001e2b] font-display">₹{order.totalAmount}</p>
                  <StatusBadge status={order.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">{t('buyerDashboard.noOrdersPlacedYet')}</p>
            <Link to="/marketplace" className="mt-3 inline-block btn-mongo-primary text-xs px-5 py-2.5">{t('buyerDashboard.browseMarketplace')}</Link>
          </div>
        )}
      </div>

      {/* Recommended */}
      {data.recommendedProducts?.length > 0 && (
        <div>
          <h2 className="font-extrabold text-[#001e2b] text-xl mb-4 font-display">{t('buyerDashboard.recommendedProduce')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recommendedProducts.slice(0, 3).map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

