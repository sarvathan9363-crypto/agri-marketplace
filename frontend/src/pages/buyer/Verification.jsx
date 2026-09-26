import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Building2,
  FileCheck2,
  UserCheck,
  CreditCard,
  FolderCheck,
  FileText,
  Smartphone,
  MapPin,
  Award,
} from 'lucide-react';
import buyerService from '../../services/buyerService';
import { getBuyerVerificationConfig } from '../../config/buyerVerificationConfig';
import { translateRole, translateStatus } from '../../utils/enumTranslations';
import { useAuth } from '../../context/AuthContext';

export default function BuyerVerification() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  const rawBuyerType = profile?.buyerType || 'INDIVIDUAL';
  const allConfigs = getBuyerVerificationConfig(t);
  const config = allConfigs[rawBuyerType] || allConfigs.INDIVIDUAL;

  const [verification, setVerification] = useState({
    mobile: { status: 'pending' },
    identity: { status: 'pending' },
    address: { status: 'pending' },
    business: { status: 'pending' },
    pan: { status: 'pending' },
    gstin: { status: 'pending' },
    representative: { status: 'pending' },
    bank: { status: 'pending' },
    udyam: { status: 'pending' },
    fssai: { status: 'pending' },
    documents: { status: 'pending' },
    overallStatus: 'incomplete',
  });
  const [overallStatus, setOverallStatus] = useState('PENDING_VERIFICATION');
  const [verifiedAt, setVerifiedAt] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await buyerService.getVerificationStatus();
      if (res.success && res.verification) {
        setVerification(res.verification);
        setOverallStatus(res.verificationStatus || 'PENDING_VERIFICATION');
        setVerifiedAt(res.verifiedAt);
      }
    } catch {
      toast.error(t('buyerVerification.failedToLoad', { defaultValue: 'Failed to load verification status.' }));
    } finally {
      setLoading(false);
    }
  };

  const isVerified = overallStatus === 'VERIFIED';
  const stepList = config.steps.filter((s) => s.key !== 'summary');

  // Count completed steps
  const completedCount = stepList.filter((s) => {
    const st = verification[s.key]?.status;
    return st === 'verified' || st === 'not_applicable';
  }).length;

  const totalSteps = stepList.length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-sm text-slate-500 font-semibold">{t('buyerVerification.loadingBuyerVerificationStatus')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-[#e8eddb] rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold tracking-wider uppercase text-[#00684a] bg-[#00ed64]/20 px-3 py-1 rounded-full font-display">
              {translateRole(t, rawBuyerType)} {t('buyerVerification.buyerLabel', { defaultValue: 'BUYER' })}
            </span>
            <span className="text-xs font-semibold text-slate-400">{t('buyerVerification.officialPortal', { defaultValue: '• Official Verification Portal' })}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#001e2b] font-display mt-2">
            {t('buyerVerification.title', { defaultValue: 'Buyer Verification Status' })}
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-sans">
            {t('buyerVerification.subtitle', { defaultValue: 'Manage identity, business compliance, and regulatory credentials on AgriBazaar.' })}
          </p>
        </div>

        {isVerified ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl px-5 py-3 flex items-center space-x-3 text-emerald-900">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-display">{t('buyerVerification.status')}</p>
              <p className="text-sm font-extrabold font-display">{config.badgeText}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/buyer/verification/wizard')}
            className="inline-flex items-center space-x-2 bg-[#00684a] hover:bg-[#00523a] text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition font-display"
          >
            <span>{completedCount > 0 ? t('buyerVerification.continueVerification', { defaultValue: 'Continue Verification' }) : t('buyerVerification.startVerification', { defaultValue: 'Start Verification' })}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Status Card */}
      <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="font-extrabold text-[#001e2b] text-lg font-display">{t('buyerVerification.overallStatus')}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  isVerified ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-sm font-bold uppercase tracking-wider text-slate-700 font-display">
                {isVerified ? config.badgeText : translateStatus(t, 'PENDING_VERIFICATION')}
              </span>
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5 font-display">
              <span>{t('buyerVerification.progress')}</span>
              <span>
                {t('buyerVerification.completedCountOfTotal', { count: completedCount, total: totalSteps, defaultValue: `${completedCount} of ${totalSteps} completed` })}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="bg-[#00684a] h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Verification Checklist */}
        <div>
          <h3 className="font-extrabold text-[#001e2b] text-base mb-4 font-display">
            {t('buyerVerification.checklistHeading', { defaultValue: 'Verification Checklist' })}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stepList.map((st) => {
              const statusVal = verification[st.key]?.status;
              const isDone = statusVal === 'verified';
              const isNotApp = statusVal === 'not_applicable';
              const IconComp = st.icon;

              return (
                <div
                  key={st.key}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isNotApp
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-[#fafcf8] border-[#e8eddb]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isNotApp
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#001e2b] font-display">{st.name}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{st.shortLabel}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border font-display ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : isNotApp
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {isDone ? translateStatus(t, 'VERIFIED') : isNotApp ? 'N/A' : translateStatus(t, 'PENDING_VERIFICATION')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action / Completion Card */}
        {isVerified ? (
          <div className="bg-emerald-900 text-white p-6 rounded-3xl space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h4 className="text-base font-extrabold font-display">{config.badgeText}</h4>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              {t('buyerVerification.allChecksCompletedDesc', { defaultValue: 'All required verification checks have been successfully completed and audited against Indian regulatory standards. You now enjoy priority buyer privileges and direct access to wholesale farmer listings.' })}
            </p>
            {verifiedAt && (
              <p className="text-[11px] text-emerald-300 font-semibold font-mono">
                {t('buyerVerification.verifiedOn', { defaultValue: 'Verified On:' })} {new Date(verifiedAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            )}
            <div className="pt-2">
              <button
                onClick={() => navigate('/buyer/verification/wizard')}
                className="inline-flex items-center space-x-1.5 text-xs font-bold bg-white text-emerald-900 hover:bg-emerald-100 px-4 py-2 rounded-xl transition font-display"
              >
                <span>{t('buyerVerification.viewVerificationDetails')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#fafcf8] border border-[#e8eddb] p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-extrabold text-[#001e2b] font-display">
                {t('buyerVerification.wizardCardHeading', { defaultValue: 'Complete Your Verification Wizard' })}
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-lg font-sans">
                {t('buyerVerification.wizardCardDesc', { defaultValue: 'Finish all required identity, tax, bank, and documentation checks to build trust with farmers and unlock verified buyer badges.' })}
              </p>
            </div>

            <button
              onClick={() => navigate('/buyer/verification/wizard')}
              className="inline-flex items-center justify-center space-x-2 bg-[#00684a] hover:bg-[#00523a] text-white font-bold text-xs px-6 py-3 rounded-2xl shadow transition font-display shrink-0"
            >
              <span>{completedCount > 0 ? t('buyerVerification.continueVerification', { defaultValue: 'Continue Verification' }) : t('buyerVerification.startVerification', { defaultValue: 'Start Verification' })}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
