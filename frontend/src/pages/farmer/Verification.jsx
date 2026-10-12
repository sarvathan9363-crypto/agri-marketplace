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
    <div className="min-h-screen bg-[#021b29] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-center text-3xl font-black text-white sm:text-4xl">
          {t('farmerVerification.verificationChecksBreakdown', { defaultValue: 'Verification Checks Breakdown' })}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {checkCards.map((item) => {
            const IconComponent = item.icon;
            const status = verification?.[item.key]?.status || 'pending';
            const isVerified = status === 'verified';
            const isSkipped = status === 'skipped';
            const isNotApp = status === 'not_applicable';

            return (
              <div
                key={item.key}
                className={`flex min-h-[230px] flex-col justify-between rounded-[24px] border p-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] ${isVerified
                    ? 'border-[#7ee6b4] bg-[#e9f8ef]'
                    : isNotApp
                      ? 'border-blue-200 bg-blue-50/60'
                      : isSkipped
                        ? 'border-amber-200 bg-amber-50/60'
                        : 'border-[#dbe7e3] bg-[#f3f5f4]'
                  }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${isVerified
                            ? 'bg-[#dff6e9] text-[#00C853]'
                            : isNotApp
                              ? 'bg-blue-100 text-blue-700'
                              : isSkipped
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-[#edf1ef] text-[#52636A]'
                          }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                          {item.req ? t('farmerVerification.requiredCheck', { defaultValue: 'Required Check' }) : t('farmerVerification.optionalCheck', { defaultValue: 'Optional Check' })}
                        </div>
                        <h3 className="text-[15px] font-bold text-[#082B36]">{item.title}</h3>
                      </div>
                    </div>

                    {isVerified ? (
                      <span className="rounded-full bg-[#dff6e9] px-3 py-1 text-[11px] font-black text-[#00C853]">
                        {t('status.verifiedBadge', { defaultValue: '✓ Verified' })}
                      </span>
                    ) : isNotApp ? (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700">
                        {t('status.notApplicable', { defaultValue: 'N/A' })}
                      </span>
                    ) : isSkipped ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700">
                        {t('status.skippedBadge', { defaultValue: '○ Skipped' })}
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#edf1ef] px-3 py-1 text-[11px] font-bold text-slate-500">
                        {t('status.pendingBadge', { defaultValue: '○ Pending' })}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>

                  {item.details && (
                    <div className="rounded-xl bg-[#0d2f38] px-3 py-2 text-sm font-mono text-white">
                      {item.details}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#dfe7e6] pt-3">
                  <span className="text-[11px] font-medium text-slate-500">
                    {isVerified ? t('farmerVerification.statusActive', { defaultValue: 'Status: Active' }) : isNotApp ? t('farmerVerification.statusNotApplicable', { defaultValue: 'Status: Not Applicable' }) : isSkipped ? t('farmerVerification.statusSkipped', { defaultValue: 'Status: Skipped' }) : t('farmerVerification.statusNotStarted', { defaultValue: 'Status: Not Started' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(wizardPath)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#00C853] hover:underline"
                  >
                    {isVerified ? t('farmerVerification.viewEdit', { defaultValue: 'View / Edit' }) : t('farmerVerification.completeInWizard', { defaultValue: 'Complete in Wizard' })}
                    <ArrowRight className="h-3.5 w-3.5" />
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
