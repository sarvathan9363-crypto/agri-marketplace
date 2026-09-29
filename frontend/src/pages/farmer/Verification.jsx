import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Building2,
  Landmark,
  CreditCard,
  FileCheck2,
  Award,
  Sparkles,
  Loader2,
  UserCheck,
  Play,
  RotateCcw,
  Building,
  FileText,
  FolderCheck,
} from 'lucide-react';
import farmerService from '../../services/farmerService';

export default function FarmerVerification() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [farmerType, setFarmerType] = useState('FARMER');

  const [verification, setVerification] = useState({
    aadhaar: { status: 'pending' },
    farmerRegistry: { status: 'pending' },
    landRecord: { status: 'pending' },
    bankAccount: { status: 'pending' },
    pan: { status: 'pending' },
    pmKisan: { status: 'pending' },
    orgIdentity: { status: 'pending' },
    orgPan: { status: 'pending' },
    gstin: { status: 'pending' },
    representative: { status: 'pending' },
    orgBank: { status: 'pending' },
    orgDocuments: { status: 'pending' },
    overallStatus: 'incomplete',
  });

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const res = await farmerService.getVerification();
      if (res.verification) {
        setVerification(res.verification);
      }
      if (res.farmerType) {
        setFarmerType(res.farmerType);
      }
    } catch {
      toast.error(t('farmerVerification.failedToLoadStatus', { defaultValue: 'Failed to load verification status.' }));
    } finally {
      setLoading(false);
    }
  };

  const isFpo = farmerType === 'FPO';

  const isFarmerVerified =
    verification?.aadhaar?.status === 'verified' &&
    verification?.farmerRegistry?.status === 'verified' &&
    verification?.landRecord?.status === 'verified' &&
    verification?.bankAccount?.status === 'verified' &&
    verification?.pan?.status === 'verified';

  const isGstinOk = verification?.gstin?.status === 'verified' || verification?.gstin?.status === 'not_applicable';
  const isFpoVerified =
    verification?.orgIdentity?.status === 'verified' &&
    verification?.orgPan?.status === 'verified' &&
    verification?.representative?.status === 'verified' &&
    verification?.orgBank?.status === 'verified' &&
    verification?.orgDocuments?.status === 'verified' &&
    isGstinOk;

  const isFullyVerified = isFpo ? isFpoVerified : isFarmerVerified;

  const requiredKeys = isFpo
    ? ['orgIdentity', 'orgPan', 'representative', 'orgBank', 'orgDocuments']
    : ['aadhaar', 'farmerRegistry', 'landRecord', 'bankAccount', 'pan'];

  const completedRequiredCount = requiredKeys.filter((k) => {
    if (k === 'gstin') return isGstinOk;
    return verification?.[k]?.status === 'verified';
  }).length;

  const allKeys = isFpo
    ? ['orgIdentity', 'orgPan', 'gstin', 'representative', 'orgBank', 'orgDocuments']
    : ['aadhaar', 'farmerRegistry', 'landRecord', 'bankAccount', 'pan', 'pmKisan'];

  const skippedCount = allKeys.filter((k) => verification?.[k]?.status === 'skipped').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-[#00C853] animate-spin" />
        <p className="text-sm font-bold text-[#082B36] font-display">{t('farmerVerification.loadingVerificationDashboard', { defaultValue: 'Loading verification dashboard...' })}</p>
      </div>
    );
  }

  const farmerCheckCards = [
    { key: 'aadhaar', title: t('farmerVerification.aadhaarTitle', { defaultValue: 'Verify Aadhaar Identity' }), req: true, icon: Lock, description: t('farmerVerification.aadhaarDesc', { defaultValue: 'Official 12-digit Aadhaar card identity check' }), details: verification?.aadhaar?.verifiedName ? `${t('farmerVerification.verifiedNameLabel', { defaultValue: 'Verified Name' })}: ${verification.aadhaar.verifiedName}` : null },
    { key: 'farmerRegistry', title: t('farmerVerification.farmerRegistryTitle', { defaultValue: 'Verify Farmer Registry ID' }), req: true, icon: Building2, description: t('farmerVerification.farmerRegistryDesc', { defaultValue: 'State or Central Agristack / Farmer ID validation' }), details: verification?.farmerRegistry?.farmerIdMasked ? `${t('farmerVerification.farmerIdLabel', { defaultValue: 'Farmer ID' })}: ${verification.farmerRegistry.farmerIdMasked}` : null },
    { key: 'landRecord', title: t('farmerVerification.landRecordTitle', { defaultValue: 'Verify Land Record / Patta' }), req: true, icon: Landmark, description: t('farmerVerification.landRecordDesc', { defaultValue: 'Agricultural land ownership or lease agreement check' }), details: verification?.landRecord?.pattaNumberMasked ? `${t('farmerVerification.pattaLabel', { defaultValue: 'Patta' })}: ${verification.landRecord.pattaNumberMasked}` : null },
    { key: 'bankAccount', title: t('farmerVerification.bankAccountTitle', { defaultValue: 'Verify Bank Account (Penny Drop)' }), req: true, icon: CreditCard, description: t('farmerVerification.bankAccountDesc', { defaultValue: 'Bank account validation for payout settlements' }), details: verification?.bankAccount?.accountNumberMasked ? `${t('farmerVerification.bankLabel', { defaultValue: 'Bank' })}: ${verification.bankAccount.bankName} (${verification.bankAccount.accountNumberMasked})` : null },
    { key: 'pan', title: t('farmerVerification.panTitle', { defaultValue: 'Verify Individual PAN' }), req: true, icon: FileCheck2, description: t('farmerVerification.panDesc', { defaultValue: 'Tax identification number validation' }), details: verification?.pan?.panMasked ? `PAN: ${verification.pan.panMasked}` : null },
    { key: 'pmKisan', title: t('farmerVerification.pmKisanTitle', { defaultValue: 'Verify PM-KISAN Beneficiary ID' }), req: false, icon: Award, description: t('farmerVerification.pmKisanDesc', { defaultValue: 'Government farmer scheme beneficiary validation' }), details: verification?.pmKisan?.referenceId ? `Ref: ${verification.pmKisan.referenceId}` : null },
  ];

  const fpoCheckCards = [
    { key: 'orgIdentity', title: t('farmerVerification.orgIdentityTitle', { defaultValue: 'Verify FPO / FPC Registration' }), req: true, icon: Building, description: t('farmerVerification.orgIdentityDesc', { defaultValue: 'Incorporation certificate & CIN verification' }), details: verification?.orgIdentity?.orgName ? `Org: ${verification.orgIdentity.orgName} (${verification.orgIdentity.registrationNumber})` : null },
    { key: 'orgPan', title: t('farmerVerification.orgPanTitle', { defaultValue: 'Verify Organization PAN' }), req: true, icon: FileCheck2, description: t('farmerVerification.orgPanDesc', { defaultValue: 'PAN issued in legal organization name' }), details: verification?.orgPan?.panMasked ? `PAN: ${verification.orgPan.panMasked}` : null },
    { key: 'gstin', title: t('farmerVerification.gstinTitle', { defaultValue: 'Verify Business Tax (GSTIN)' }), req: false, icon: FileText, description: t('farmerVerification.gstinDesc', { defaultValue: 'GSTIN registration (optional/conditional)' }), details: verification?.gstin?.status === 'not_applicable' ? t('farmerVerification.gstinNotApplicable', { defaultValue: 'GSTIN Not Applicable' }) : verification?.gstin?.gstinNumber ? `GSTIN: ${verification.gstin.gstinNumber}` : null },
    { key: 'representative', title: t('farmerVerification.representativeTitle', { defaultValue: 'Verify Authorized Representative' }), req: true, icon: UserCheck, description: t('farmerVerification.representativeDesc', { defaultValue: 'Managing officer identity & designation' }), details: verification?.representative?.repName ? `Rep: ${verification.representative.repName} (${verification.representative.designation})` : null },
    { key: 'orgBank', title: t('farmerVerification.orgBankTitle', { defaultValue: 'Verify Organization Bank Account' }), req: true, icon: CreditCard, description: t('farmerVerification.orgBankDesc', { defaultValue: 'Entity-owned bank account for settlements' }), details: verification?.orgBank?.accountNumberMasked ? `Bank: ${verification.orgBank.bankName} (${verification.orgBank.accountNumberMasked})` : null },
    { key: 'orgDocuments', title: t('farmerVerification.orgDocumentsTitle', { defaultValue: 'Organization Documents' }), req: true, icon: FolderCheck, description: t('farmerVerification.orgDocumentsDesc', { defaultValue: 'Upload reg certificate, PAN doc, bank proof & auth letter' }), details: verification?.orgDocuments?.status === 'verified' ? t('farmerVerification.allDocsVerified', { defaultValue: 'All Required Documents Verified' }) : null },
  ];

  const checkCards = isFpo ? fpoCheckCards : farmerCheckCards;
  const wizardPath = isFpo ? '/fpo/verification/onboarding' : '/farmer/verification/wizard';
  const badgeTitle = isFpo ? t('farmerVerification.verifiedFpoBadge', { defaultValue: '✓ VERIFIED FPO' }) : t('farmerVerification.verifiedFarmerBadge', { defaultValue: '✓ VERIFIED FARMER' });

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      {/* Dashboard Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E5] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#00E676]/15 text-[#00C853] border border-[#00E676]/30">
            <UserCheck className="w-4 h-4" /> {isFpo ? t('farmerVerification.fpoVerificationDashboard', { defaultValue: 'FPO / FPC VERIFICATION DASHBOARD' }) : t('farmerVerification.farmerVerificationDashboard', { defaultValue: 'FARMER VERIFICATION DASHBOARD' })}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B36] font-display mt-2 tracking-tight">
            {t('farmerVerification.verificationStatusHeading', { defaultValue: 'Verification Status & Credentials' })}
          </h1>
          <p className="text-xs sm:text-sm text-[#52636A] mt-1 font-sans max-w-xl">
            {isFpo ? t('farmerVerification.centralDashboardOrg', { defaultValue: 'Central dashboard to view your organization credentials, progress, and official status.' }) : t('farmerVerification.centralDashboardAgri', { defaultValue: 'Central dashboard to view your agricultural credentials, progress, and official status.' })}
          </p>
        </div>

        {isFullyVerified ? (
          <div className="flex items-center gap-2 bg-[#E8F5E9] border border-[#00E676] px-4 py-2.5 rounded-2xl shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#00C853]" />
            <div>
              <p className="text-xs font-black text-[#002B36] tracking-wide">{badgeTitle}</p>
              <p className="text-[11px] text-emerald-700 font-medium">{t('farmerVerification.all5RequiredChecksActive', { defaultValue: 'All 5 required checks active' })}</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate(wizardPath)}
            className="btn-agri-primary text-sm px-6 py-3.5 flex items-center gap-2 font-bold shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            {completedRequiredCount === 0 ? t('farmerVerification.startVerification', { defaultValue: 'Start Verification' }) : t('farmerVerification.continueVerification', { defaultValue: 'Continue Verification' })}
          </button>
        )}
      </div>

      {/* OVERALL PROGRESS SUMMARY CARD */}
      <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#082B36] font-display">{t('farmerVerification.overallProgress', { defaultValue: 'Overall Progress' })}</h2>
            <p className="text-xs text-[#52636A] font-sans mt-0.5">
              {t('farmerVerification.checksCompletedSummary', { count: completedRequiredCount, defaultValue: `${completedRequiredCount} of 5 required checks completed` })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-black font-display text-[#00C853]">
              {Math.round((completedRequiredCount / 5) * 100)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00C853] to-[#00E676] transition-all duration-500 rounded-full"
            style={{ width: `${(completedRequiredCount / 5) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs font-medium text-gray-500 pt-1">
          <span>{t('farmerVerification.verifiedStat', { count: completedRequiredCount, defaultValue: `${completedRequiredCount} Verified` })}</span>
          <span>{t('farmerVerification.skippedStat', { count: skippedCount, defaultValue: `${skippedCount} Skipped` })}</span>
          <span>{t('farmerVerification.pendingStat', { count: 5 - completedRequiredCount, defaultValue: `${5 - completedRequiredCount} Pending Required` })}</span>
        </div>

        {!isFullyVerified && (
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              {t('farmerVerification.verificationIncompleteNotice', { badgeTitle, defaultValue: `Verification Incomplete — Complete remaining steps to earn your ${badgeTitle} badge.` })}
            </p>
            <button
              type="button"
              onClick={() => navigate(wizardPath)}
              className="btn-agri-primary text-xs px-5 py-2.5 font-bold flex items-center justify-center gap-1.5 shrink-0"
            >
              {t('farmerVerification.continueVerification', { defaultValue: 'Continue Verification' })} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* VERIFIED BADGE BOX (IF FULLY VERIFIED) */}
      {isFullyVerified && (
        <div className="bg-gradient-to-r from-[#002B36] to-[#004D5A] text-white p-8 rounded-3xl text-center space-y-3 shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 bg-[#00E676] text-[#002B36] rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#00E676] font-display">
            {badgeTitle}
          </h3>
          <p className="text-xs sm:text-sm text-gray-200 max-w-md mx-auto font-sans">
            {t('farmerVerification.congratulationsVerifiedMsg', { defaultValue: 'Congratulations! All required identity and organization credentials are fully verified. Your produce listings now show the official verified badge.' })}
          </p>
          <button
            type="button"
            onClick={() => navigate(wizardPath)}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t('farmerVerification.reviewUpdateCredentials', { defaultValue: 'Review / Update Credentials' })}
          </button>
        </div>
      )}

      {/* STATUS CARDS GRID FOR CHECKS */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[#082B36] font-display">{t('farmerVerification.verificationChecksBreakdown', { defaultValue: 'Verification Checks Breakdown' })}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checkCards.map((item) => {
            const IconComponent = item.icon;
            const status = verification?.[item.key]?.status || 'pending';
            const isVerified = status === 'verified';
            const isSkipped = status === 'skipped';
            const isNotApp = status === 'not_applicable';

            return (
              <div
                key={item.key}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isVerified
                    ? 'bg-[#FBFCF9] border-[#00E676]'
                    : isNotApp
                    ? 'bg-blue-50/50 border-blue-200'
                    : isSkipped
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isVerified ? 'bg-emerald-100 text-[#00C853]' : isNotApp ? 'bg-blue-100 text-blue-700' : isSkipped ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-extrabold text-[#082B36] font-display">{item.title}</h3>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {item.req ? t('farmerVerification.requiredCheck', { defaultValue: 'Required Check' }) : t('farmerVerification.optionalCheck', { defaultValue: 'Optional Check' })}
                        </span>
                      </div>
                    </div>

                    {isVerified ? (
                      <span className="text-xs font-black text-[#00C853] bg-emerald-100 px-3 py-1 rounded-full shrink-0">
                        {t('status.verifiedBadge', { defaultValue: '✓ Verified' })}
                      </span>
                    ) : isNotApp ? (
                      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full shrink-0">
                        {t('status.notApplicable', { defaultValue: 'N/A' })}
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
                    {isVerified ? t('farmerVerification.statusActive', { defaultValue: 'Status: Active' }) : isNotApp ? t('farmerVerification.statusNotApplicable', { defaultValue: 'Status: Not Applicable' }) : isSkipped ? t('farmerVerification.statusSkipped', { defaultValue: 'Status: Skipped' }) : t('farmerVerification.statusNotStarted', { defaultValue: 'Status: Not Started' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(wizardPath)}
                    className="text-xs font-bold text-[#00C853] hover:underline flex items-center gap-1"
                  >
                    {isVerified ? t('farmerVerification.viewEdit', { defaultValue: 'View / Edit' }) : t('farmerVerification.completeInWizard', { defaultValue: 'Complete in Wizard' })} →
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
