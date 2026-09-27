import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  CreditCard,
  FileCheck2,
  Sparkles,
  Loader2,
  UserCheck,
  Play,
  RotateCcw,
  Building,
  Truck,
  Users,
  ShieldCheck,
} from 'lucide-react';
import transportService from '../../services/transportService';

export default function TransporterVerification() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transporterStatus, setTransporterStatus] = useState('NOT_STARTED');
  const [verification, setVerification] = useState({
    basicDetails: { status: 'pending' },
    identity: { status: 'pending' },
    businessRegistration: { status: 'pending' },
    bankAccount: { status: 'pending' },
    vehiclesStep: { status: 'pending' },
    driversStep: { status: 'pending' },
    overallStatus: 'NOT_STARTED',
  });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const res = await transportService.getVerification();
      if (res.verification) {
        setVerification(res.verification);
      }
      if (res.verificationStatus) {
        setTransporterStatus(res.verificationStatus);
      }
      if (res.vehicles) setVehicles(res.vehicles);
      if (res.drivers) setDrivers(res.drivers);
      if (res.verificationNotes) setNotes(res.verificationNotes);
    } catch {
      toast.error(t('transporterVerification.failedToLoadStatus', { defaultValue: 'Failed to load transporter verification status.' }));
    } finally {
      setLoading(false);
    }
  };

  const isVerified = transporterStatus === 'VERIFIED';
  const isUnderReview = transporterStatus === 'UNDER_REVIEW';
  const isActionRequired = transporterStatus === 'ACTION_REQUIRED';

  const requiredKeys = ['basicDetails', 'identity', 'bankAccount', 'vehiclesStep'];
  const completedRequiredCount = requiredKeys.filter((k) => {
    const s = verification?.[k]?.status;
    return s === 'submitted' || s === 'verified';
  }).length;

  const wizardPath = '/transporter/verification/wizard';
  const badgeTitle = t('transporterVerification.verifiedBadge', { defaultValue: '✓ VERIFIED TRANSPORTER' });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-[#00684a] animate-spin" />
        <p className="text-sm font-bold text-[#001e2b] font-display">
          {t('transporterVerification.loadingDashboard', { defaultValue: 'Loading transporter verification dashboard...' })}
        </p>
      </div>
    );
  }

  const checkCards = [
    {
      key: 'basicDetails',
      title: t('transporterVerification.basicDetailsTitle', { defaultValue: 'Basic Transporter & Company Details' }),
      req: true,
      icon: UserCheck,
      description: t('transporterVerification.basicDetailsDesc', { defaultValue: 'Company name, contact person, mobile, email, and service areas' }),
      details: verification?.basicDetails?.companyName ? `${verification.basicDetails.companyName} (${verification.basicDetails.transporterType || 'INDIVIDUAL'})` : null,
    },
    {
      key: 'identity',
      title: t('transporterVerification.identityTitle', { defaultValue: 'Identity Verification (Aadhaar / PAN)' }),
      req: true,
      icon: Lock,
      description: t('transporterVerification.identityDesc', { defaultValue: 'Identity check of proprietor or authorized business owner' }),
      details: verification?.identity?.panNumber ? `PAN: ${verification.identity.panNumber} ${verification.identity.aadhaarNumberMasked ? `· Aadhaar: ${verification.identity.aadhaarNumberMasked}` : ''}` : null,
    },
    {
      key: 'businessRegistration',
      title: t('transporterVerification.businessTitle', { defaultValue: 'Business Registration & Tax (GST / Udyam)' }),
      req: false,
      icon: Building,
      description: t('transporterVerification.businessDesc', { defaultValue: 'Optional/conditional business incorporation certificate or GST registration' }),
      details: verification?.businessRegistration?.gstin ? `GSTIN: ${verification.businessRegistration.gstin}` : null,
    },
    {
      key: 'bankAccount',
      title: t('transporterVerification.bankTitle', { defaultValue: 'Bank Account Verification' }),
      req: true,
      icon: CreditCard,
      description: t('transporterVerification.bankDesc', { defaultValue: 'Verified bank account details for direct freight payout settlement' }),
      details: verification?.bankAccount?.accountNumberMasked ? `Bank: ${verification.bankAccount.bankName} (${verification.bankAccount.accountNumberMasked})` : null,
    },
    {
      key: 'vehiclesStep',
      title: t('transporterVerification.vehiclesTitle', { defaultValue: 'Vehicle Fleet & Document Verification' }),
      req: true,
      icon: Truck,
      description: t('transporterVerification.vehiclesDesc', { defaultValue: 'Registered transport vehicles with RC, Insurance, Fitness, and PUC certificates' }),
      details: vehicles.length > 0 ? `${vehicles.length} ${t('transporterVerification.vehiclesRegistered', { defaultValue: 'vehicle(s) added' })}` : null,
    },
    {
      key: 'driversStep',
      title: t('transporterVerification.driversTitle', { defaultValue: 'Driver Roster & License Verification' }),
      req: false,
      icon: Users,
      description: t('transporterVerification.driversDesc', { defaultValue: 'Driver credentials and valid commercial driving license verification' }),
      details: drivers.length > 0 ? `${drivers.length} ${t('transporterVerification.driversRegistered', { defaultValue: 'driver(s) added' })}` : null,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8eddb] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#00ed64]/20 text-[#00684a] border border-[#00ed64]/30">
            <ShieldCheck className="w-4 h-4 text-[#00684a]" />
            {t('transporterVerification.portalBadge', { defaultValue: 'TRANSPORTER VERIFICATION GATEWAY' })}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#001e2b] font-display mt-2 tracking-tight">
            {t('transporterVerification.heading', { defaultValue: 'Transporter Verification & Fleet Compliance' })}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-sans max-w-xl">
            {t('transporterVerification.subtitle', { defaultValue: 'Complete identity, fleet, and banking verification to get verified and unlock quotation capabilities on AgriBazaar.' })}
          </p>
        </div>

        {isVerified ? (
          <div className="flex items-center gap-2 bg-[#E8F5E9] border border-[#00E676] px-4 py-2.5 rounded-2xl shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#00C853]" />
            <div>
              <p className="text-xs font-black text-[#002B36] tracking-wide">{badgeTitle}</p>
              <p className="text-[11px] text-emerald-700 font-medium">{t('transporterVerification.verifiedSub', { defaultValue: 'Eligible to submit freight quotes' })}</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate(wizardPath)}
            className="px-6 py-3.5 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold text-sm rounded-2xl flex items-center gap-2 shadow-md transition font-display shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            {completedRequiredCount === 0
              ? t('transporterVerification.startVerification', { defaultValue: 'Start Transporter Verification' })
              : t('transporterVerification.continueVerification', { defaultValue: 'Continue Verification' })}
          </button>
        )}
      </div>

      {/* Action Required Banner if admin requested corrections */}
      {isActionRequired && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-black font-display text-base">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>{t('transporterVerification.actionRequiredHeading', { defaultValue: 'Action Required — Review Notes' })}</span>
          </div>
          <p className="text-xs text-amber-800 font-sans">{notes || t('transporterVerification.actionRequiredMsg', { defaultValue: 'Admin has requested updates or missing documents. Please click Continue Verification to fix issues.' })}</p>
        </div>
      )}

      {/* OVERALL PROGRESS SUMMARY CARD */}
      <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#001e2b] font-display">{t('transporterVerification.overallProgress', { defaultValue: 'Verification Progress' })}</h2>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              {t('transporterVerification.stepsCompletedSummary', { count: completedRequiredCount, defaultValue: `${completedRequiredCount} of 4 required sections completed` })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-black font-display text-[#00684a]">
              {Math.round((completedRequiredCount / 4) * 100)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00684a] to-[#00ed64] transition-all duration-500 rounded-full"
            style={{ width: `${(completedRequiredCount / 4) * 100}%` }}
          />
        </div>

        {!isVerified && (
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              {isUnderReview
                ? t('transporterVerification.underReviewNotice', { defaultValue: 'Your verification documents are currently under admin review.' })
                : t('transporterVerification.pendingNotice', { defaultValue: 'Complete all required steps to unlock verified transporter status & quote eligibility.' })}
            </p>
            <button
              type="button"
              onClick={() => navigate(wizardPath)}
              className="px-5 py-2.5 bg-[#001e2b] text-[#00ed64] hover:bg-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition font-display shrink-0"
            >
              {t('transporterVerification.continueVerification', { defaultValue: 'Continue Verification' })} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* VERIFIED BADGE BANNER */}
      {isVerified && (
        <div className="bg-gradient-to-r from-[#001e2b] to-[#003847] text-white p-8 rounded-3xl text-center space-y-3 shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 bg-[#00ed64] text-[#001e2b] rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#00ed64] font-display">
            {badgeTitle}
          </h3>
          <p className="text-xs sm:text-sm text-gray-200 max-w-md mx-auto font-sans">
            {t('transporterVerification.verifiedBannerMsg', { defaultValue: 'Congratulations! Your transporter account is fully verified. You can now view freight requests and submit quotations.' })}
          </p>
          <button
            type="button"
            onClick={() => navigate(wizardPath)}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t('transporterVerification.updateFleet', { defaultValue: 'Update Fleet & Credentials' })}
          </button>
        </div>
      )}

      {/* CHECK CARDS GRID */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[#001e2b] font-display">
          {t('transporterVerification.checksBreakdown', { defaultValue: 'Verification Requirements Breakdown' })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checkCards.map((item) => {
            const IconComponent = item.icon;
            const status = verification?.[item.key]?.status || 'pending';
            const isCompleted = status === 'submitted' || status === 'verified';
            const isSkipped = status === 'skipped';

            return (
              <div
                key={item.key}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-[#fafcf8] border-[#00ed64]'
                    : isSkipped
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted ? 'bg-emerald-100 text-[#00684a]' : isSkipped ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#001e2b] font-display">{item.title}</h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {item.req ? t('transporterVerification.requiredCheck', { defaultValue: 'Required Step' }) : t('transporterVerification.optionalCheck', { defaultValue: 'Optional Step' })}
                        </span>
                      </div>
                    </div>

                    {isCompleted ? (
                      <span className="text-xs font-black text-[#00684a] bg-emerald-100 px-3 py-1 rounded-full shrink-0">
                        {t('status.completedBadge', { defaultValue: '✓ Completed' })}
                      </span>
                    ) : isSkipped ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full shrink-0">
                        {t('status.skippedBadge', { defaultValue: '○ Skipped' })}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full shrink-0">
                        {t('status.pendingBadge', { defaultValue: '○ Pending' })}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 font-sans leading-relaxed">{item.description}</p>

                  {item.details && (
                    <div className="p-2.5 bg-gray-50 rounded-xl text-xs font-mono text-gray-700">
                      {item.details}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-400">
                    {isCompleted ? t('transporterVerification.statusSaved', { defaultValue: 'Status: Info Saved' }) : t('transporterVerification.statusPending', { defaultValue: 'Status: Pending' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(wizardPath)}
                    className="text-xs font-bold text-[#00684a] hover:underline flex items-center gap-1"
                  >
                    {isCompleted ? t('transporterVerification.viewEdit', { defaultValue: 'View / Edit' }) : t('transporterVerification.completeInWizard', { defaultValue: 'Complete Step' })} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
