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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [farmerType, setFarmerType] = useState('FARMER');

  // Backend verification object
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
      toast.error('Failed to load verification status.');
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

  // Calculate progress counts
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
        <p className="text-sm font-bold text-[#082B36] font-display">Loading verification dashboard...</p>
      </div>
    );
  }

  const farmerCheckCards = [
    { key: 'aadhaar', title: 'Identity Verification (Aadhaar)', req: true, icon: Lock, description: 'Authorized UIDAI identity verification', details: verification?.aadhaar?.verifiedName ? `Verified Name: ${verification.aadhaar.verifiedName}` : null },
    { key: 'farmerRegistry', title: 'Farmer ID / Registry', req: true, icon: Building2, description: 'State / National Farmer Agristack database record', details: verification?.farmerRegistry?.farmerIdMasked ? `Farmer ID: ${verification.farmerRegistry.farmerIdMasked}` : null },
    { key: 'landRecord', title: 'Land Record / Patta', req: true, icon: Landmark, description: 'Agricultural land holding or cultivation record', details: verification?.landRecord?.pattaNumberMasked ? `Patta: ${verification.landRecord.pattaNumberMasked}` : null },
    { key: 'bankAccount', title: 'Bank Account Verification', req: true, icon: CreditCard, description: 'Settlement bank account for direct payments', details: verification?.bankAccount?.accountNumberMasked ? `Bank: ${verification.bankAccount.bankName} (${verification.bankAccount.accountNumberMasked})` : null },
    { key: 'pan', title: 'PAN Card Verification', req: true, icon: FileCheck2, description: 'Permanent Account Number for identity & payouts', details: verification?.pan?.panMasked ? `PAN: ${verification.pan.panMasked}` : null },
    { key: 'pmKisan', title: 'PM-KISAN Verification (Optional)', req: false, icon: Award, description: 'PM-KISAN beneficiary registration reference', details: verification?.pmKisan?.referenceId ? `Ref: ${verification.pmKisan.referenceId}` : null },
  ];

  const fpoCheckCards = [
    { key: 'orgIdentity', title: 'Verify Your Organization', req: true, icon: Building, description: 'Legal organization registration, CIN, and state address', details: verification?.orgIdentity?.orgName ? `Org: ${verification.orgIdentity.orgName} (${verification.orgIdentity.registrationNumber})` : null },
    { key: 'orgPan', title: 'Verify Organization PAN', req: true, icon: FileCheck2, description: 'Permanent Account Number issued in legal org name', details: verification?.orgPan?.panMasked ? `PAN: ${verification.orgPan.panMasked}` : null },
    { key: 'gstin', title: 'Verify Business Details (GSTIN)', req: false, icon: FileText, description: 'GSTIN registration (optional / conditional)', details: verification?.gstin?.status === 'not_applicable' ? 'GSTIN Not Applicable' : verification?.gstin?.gstinNumber ? `GSTIN: ${verification.gstin.gstinNumber}` : null },
    { key: 'representative', title: 'Verify Authorized Representative', req: true, icon: UserCheck, description: 'Identity & designation of managing official', details: verification?.representative?.repName ? `Rep: ${verification.representative.repName} (${verification.representative.designation})` : null },
    { key: 'orgBank', title: 'Verify Organization Bank Account', req: true, icon: CreditCard, description: 'Bank account belonging to organization for settlements', details: verification?.orgBank?.accountNumberMasked ? `Bank: ${verification.orgBank.bankName} (${verification.orgBank.accountNumberMasked})` : null },
    { key: 'orgDocuments', title: 'Organization Documents', req: true, icon: FolderCheck, description: 'Upload registration cert, PAN doc, bank proof, and auth letter', details: verification?.orgDocuments?.status === 'verified' ? 'All Required Documents Verified' : null },
  ];

  const checkCards = isFpo ? fpoCheckCards : farmerCheckCards;
  const wizardPath = isFpo ? '/fpo/verification/onboarding' : '/farmer/verification/wizard';
  const badgeTitle = isFpo ? '✓ VERIFIED FPO' : '✓ VERIFIED FARMER';

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      {/* Dashboard Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E5] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#00E676]/15 text-[#00C853] border border-[#00E676]/30">
            <UserCheck className="w-4 h-4" /> {isFpo ? 'FPO / FPC VERIFICATION DASHBOARD' : 'FARMER VERIFICATION DASHBOARD'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B36] font-display mt-2 tracking-tight">
            Verification Status & Credentials
          </h1>
          <p className="text-xs sm:text-sm text-[#52636A] mt-1 font-sans max-w-xl">
            Central dashboard to view your {isFpo ? 'organization' : 'agricultural'} credentials, progress, and official status.
          </p>
        </div>

        {isFullyVerified ? (
          <div className="flex items-center gap-2 bg-[#E8F5E9] border border-[#00E676] px-4 py-2.5 rounded-2xl shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#00C853]" />
            <div>
              <p className="text-xs font-black text-[#002B36] tracking-wide">{badgeTitle}</p>
              <p className="text-[11px] text-emerald-700 font-medium">All 5 required checks active</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate(wizardPath)}
            className="btn-agri-primary text-sm px-6 py-3.5 flex items-center gap-2 font-bold shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            {completedRequiredCount === 0 ? 'Start Verification' : 'Continue Verification'}
          </button>
        )}
      </div>

      {/* OVERALL PROGRESS SUMMARY CARD */}
      <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#082B36] font-display">Overall Progress</h2>
            <p className="text-xs text-[#52636A] font-sans mt-0.5">
              {completedRequiredCount} of 5 required checks completed
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
          <span>{completedRequiredCount} Verified</span>
          <span>{skippedCount} Skipped</span>
          <span>{5 - completedRequiredCount} Pending Required</span>
        </div>

        {!isFullyVerified && (
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Verification Incomplete — Complete remaining steps to earn your {badgeTitle} badge.
            </p>
            <button
              type="button"
              onClick={() => navigate(wizardPath)}
              className="btn-agri-primary text-xs px-5 py-2.5 font-bold flex items-center justify-center gap-1.5 shrink-0"
            >
              Continue Verification <ArrowRight className="w-3.5 h-3.5" />
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
            Congratulations! All required identity and organization credentials are fully verified. Your produce listings now show the official verified badge.
          </p>
          <button
            type="button"
            onClick={() => navigate(wizardPath)}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Review / Update Credentials
          </button>
        </div>
      )}

      {/* STATUS CARDS GRID FOR CHECKS */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[#082B36] font-display">Verification Checks Breakdown</h2>

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
                          {item.req ? 'Required Check' : 'Optional Check'}
                        </span>
                      </div>
                    </div>

                    {isVerified ? (
                      <span className="text-xs font-black text-[#00C853] bg-emerald-100 px-3 py-1 rounded-full shrink-0">
                        ✓ Verified
                      </span>
                    ) : isNotApp ? (
                      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full shrink-0">
                        N/A
                      </span>
                    ) : isSkipped ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full shrink-0">
                        ○ Skipped
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full shrink-0">
                        ○ Pending
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
                    {isVerified ? 'Status: Active' : isNotApp ? 'Status: Not Applicable' : isSkipped ? 'Status: Skipped' : 'Status: Not Started'}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(wizardPath)}
                    className="text-xs font-bold text-[#00C853] hover:underline flex items-center gap-1"
                  >
                    {isVerified ? 'View / Edit' : 'Complete in Wizard'} →
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
