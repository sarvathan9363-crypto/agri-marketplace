import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Building2,
  Landmark,
  CreditCard,
  FileCheck2,
  Award,
  Sparkles,
  Loader2,
  UserCheck,
  Save,
  Building,
  FileText,
  FolderCheck,
  ShieldCheck,
} from 'lucide-react';
import farmerService from '../../services/farmerService';
import { useAuth } from '../../context/AuthContext';
import { verificationConfigs } from '../../config/verificationConfigs';
import SecureFileUpload from '../../components/common/SecureFileUpload';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const MAJOR_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank (PNB)',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'IDBI Bank',
  'NABARD / Regional Rural Bank',
];

export default function VerificationWizard({ accountType: propAccountType }) {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Determine active account type configuration ('farmer' vs 'fpo')
  const resolvedAccountType = (
    propAccountType ||
    (profile?.farmerType === 'FPO' ? 'fpo' : 'farmer')
  ).toLowerCase();

  const config = verificationConfigs[resolvedAccountType] || verificationConfigs.farmer;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Backend verification state
  const [verification, setVerification] = useState({
    // Farmer
    aadhaar: { status: 'pending' },
    farmerRegistry: { status: 'pending' },
    landRecord: { status: 'pending' },
    bankAccount: { status: 'pending' },
    pan: { status: 'pending' },
    pmKisan: { status: 'pending' },
    // FPO
    orgIdentity: { status: 'pending' },
    orgPan: { status: 'pending' },
    gstin: { status: 'pending' },
    representative: { status: 'pending' },
    orgBank: { status: 'pending' },
    orgDocuments: { status: 'pending' },
    overallStatus: 'incomplete',
  });

  // Farmer Forms
  const [aadhaarForm, setAadhaarForm] = useState({ aadhaarNumber: '', otp: '', otpSent: false, referenceId: '' });
  const [farmerRegForm, setFarmerRegForm] = useState({ farmerId: '', state: 'Maharashtra', district: '' });
  const [landForm, setLandForm] = useState({
    state: 'Maharashtra', district: '', taluk: '', village: '',
    pattaNumber: '', surveyNumber: '', subdivisionNumber: '', landType: 'Dry', extent: '', isTenant: false,
  });
  const [bankForm, setBankForm] = useState({
    accountHolderName: '', bankName: 'State Bank of India (SBI)', branchName: '',
    accountNumber: '', confirmAccountNumber: '', ifsc: '',
  });
  const [panForm, setPanForm] = useState({ panNumber: '', nameAsPerPan: '' });
  const [pmKisanForm, setPmKisanForm] = useState({ pmKisanRef: '' });

  // FPO Forms
  const [orgForm, setOrgForm] = useState({
    orgName: profile?.farmName || '', orgType: 'FPO / FPC', registrationNumber: '', cin: '',
    state: 'Maharashtra', district: '', address: '', pincode: '',
  });
  const [orgPanForm, setOrgPanForm] = useState({ panNumber: '', orgName: profile?.farmName || '' });
  const [gstinForm, setGstinForm] = useState({ gstinNumber: '', isNotApplicable: false });
  const [repForm, setRepForm] = useState({
    repName: profile?.fullName || '', designation: 'Director', mobileNumber: '', otp: '', otpSent: false, referenceId: '',
  });
  const [orgBankForm, setOrgBankForm] = useState({
    accountHolderName: profile?.farmName || '', bankName: 'State Bank of India (SBI)', branchName: '',
    accountNumber: '', confirmAccountNumber: '', ifsc: '',
  });
  const [docsForm, setDocsForm] = useState({
    regCert: false, panDoc: false, bankProof: false, authDoc: false, gstCert: false,
  });

  useEffect(() => {
    fetchVerificationStatus();
  }, [resolvedAccountType]);

  const getFirstIncompleteStep = (v, type) => {
    if (type === 'fpo') {
      if (v?.orgIdentity?.status !== 'verified') return 1;
      if (v?.orgPan?.status !== 'verified') return 2;
      if (v?.gstin?.status === 'pending') return 3;
      if (v?.representative?.status !== 'verified') return 4;
      if (v?.orgBank?.status !== 'verified') return 5;
      if (v?.orgDocuments?.status !== 'verified') return 6;
      return 7;
    } else {
      if (v?.aadhaar?.status !== 'verified') return 1;
      if (v?.farmerRegistry?.status !== 'verified') return 2;
      if (v?.landRecord?.status !== 'verified') return 3;
      if (v?.bankAccount?.status !== 'verified') return 4;
      if (v?.pan?.status !== 'verified') return 5;
      if (v?.pmKisan?.status === 'pending') return 6;
      return 7;
    }
  };

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const res = await farmerService.getVerification();
      if (res.verification) {
        setVerification(res.verification);
        const initialStep = getFirstIncompleteStep(res.verification, resolvedAccountType);
        setCurrentStep(initialStep);
      }
    } catch {
      toast.error(t('farmerVerificationWizard.failedToLoadVerificationStatus'));
    } finally {
      setLoading(false);
    }
  };

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

  const isFullyVerified = resolvedAccountType === 'fpo' ? isFpoVerified : isFarmerVerified;

  // -------------------------------------------------------------
  // FARMER STEP HANDLERS
  // -------------------------------------------------------------
  const handleSendAadhaarOtp = async (e) => {
    e.preventDefault();
    const clean = aadhaarForm.aadhaarNumber.replace(/\D/g, '');
    if (clean.length !== 12) {
      toast.error(t('farmerVerificationWizard.pleaseEnterAValid12digitAadhaar')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.sendAadhaarOtp(clean);
      setAadhaarForm((prev) => ({ ...prev, otpSent: true, referenceId: res.referenceId }));
      toast.success(t('farmerVerificationWizard.otpSentToYourAadhaarMobile'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyAadhaarOtp = async (e) => {
    e.preventDefault();
    if (!aadhaarForm.otp || aadhaarForm.otp.trim().length !== 6) {
      toast.error(t('farmerVerificationWizard.pleaseEnter6digitOtp')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyAadhaarOtp(aadhaarForm.aadhaarNumber, aadhaarForm.otp);
      setVerification(res.verification);
      toast.success(t('farmerVerificationWizard.verified_identityVerifiedViaUidaiSandbox'));
      setCurrentStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyFarmerReg = async (e) => {
    e.preventDefault();
    if (!farmerRegForm.farmerId || !farmerRegForm.district) {
      toast.error(t('farmerVerificationWizard.pleaseEnterFarmerIdAndDistrict')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyFarmerRegistry(farmerRegForm);
      setVerification(res.verification);
      toast.success(t('farmerVerificationWizard.verified_farmerRegistryVerified'));
      setCurrentStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Farmer registry verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyLandRecord = async (e) => {
    e.preventDefault();
    if (!landForm.district || !landForm.taluk || !landForm.village || !landForm.pattaNumber || !landForm.surveyNumber || !landForm.extent) {
      toast.error(t('farmerVerificationWizard.pleaseFillAllRequiredLandRecord')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyLandRecord(landForm);
      setVerification(res.verification);
      toast.success(t('farmerVerificationWizard.verified_landRecordVerified'));
      setCurrentStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Land record verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyBankAccount = async (e) => {
    e.preventDefault();
    if (!bankForm.accountHolderName || !bankForm.accountNumber || !bankForm.ifsc) {
      toast.error(t('farmerVerificationWizard.pleaseFillAccountHolderAccountNumber')); return;
    }
    if (bankForm.accountNumber !== bankForm.confirmAccountNumber) {
      toast.error(t('farmerVerificationWizard.accountNumbersDoNotMatch')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyBankAccount(bankForm);
      setVerification(res.verification);
      toast.success(t('farmerVerificationWizard.verified_bankAccountVerified'));
      setCurrentStep(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bank account verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyPan = async (e) => {
    e.preventDefault();
    const cleanPan = panForm.panNumber.toUpperCase().trim();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      toast.error(t('farmerVerificationWizard.pleaseEnterAValid10characterPan')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyPan({ panNumber: cleanPan, nameAsPerPan: panForm.nameAsPerPan });
      setVerification(res.verification);
      toast.success(t('farmerVerificationWizard.verified_panVerifiedSuccessfully'));
      setCurrentStep(6);
    } catch (err) {
      toast.error(err.response?.data?.message || 'PAN verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyPmKisan = async (action) => {
    setSubmitting(true);
    try {
      const isSkip = action === 'skip';
      const res = await farmerService.verifyPmKisan({
        isSkipped: isSkip,
        pmKisanRef: isSkip ? '' : pmKisanForm.pmKisanRef,
      });
      setVerification(res.verification);
      toast.success(isSkip ? t('farmerVerificationWizard.pmkisanSkipped') : t('farmerVerificationWizard.verified_pmkisanVerified'));
      setCurrentStep(7);
    } catch (err) {
      toast.error(err.response?.data?.message || 'PM-KISAN verification failed.');
    } finally { setSubmitting(false); }
  };

  // -------------------------------------------------------------
  // FPO STEP HANDLERS
  // -------------------------------------------------------------
  const handleVerifyOrgIdentity = async (e) => {
    e.preventDefault();
    if (!orgForm.orgName || !orgForm.registrationNumber || !orgForm.district || !orgForm.address || !orgForm.pincode) {
      toast.error(t('farmerVerificationWizard.pleaseFillRequiredOrganizationDetails')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyOrgIdentity(orgForm);
      setVerification(res.verification);
      toast.success(t('farmerVerificationWizard.verified_organizationIdentityVerified'));
      setCurrentStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Organization verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyOrgPan = async (e) => {
    e.preventDefault();
    const cleanPan = orgPanForm.panNumber.toUpperCase().trim();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      toast.error(t('farmerVerificationWizard.pleaseEnterAValid10characterOrganization')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyOrgPan(orgPanForm);
      setVerification(res.verification);
      toast.success(t('farmerVerificationWizard.verified_organizationPanVerified'));
      setCurrentStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'PAN verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyGstin = async (action) => {
    setSubmitting(true);
    try {
      const isNotApp = action === 'not_applicable';
      const res = await farmerService.verifyGstin({
        isNotApplicable: isNotApp,
        gstinNumber: gstinForm.gstinNumber,
      });
      setVerification(res.verification);
      toast.success(isNotApp ? t('farmerVerificationWizard.gstinMarkedAsNotApplicable') : t('farmerVerificationWizard.verified_gstinVerified'));
      setCurrentStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'GSTIN verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleSendRepOtp = async (e) => {
    e.preventDefault();
    const clean = repForm.mobileNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      toast.error(t('farmerVerificationWizard.pleaseEnterAValid10digitMobile')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.sendRepOtp(clean);
      setRepForm((prev) => ({ ...prev, otpSent: true, referenceId: res.referenceId }));
      toast.success(t('farmerVerificationWizard.otpSentToRepresentativeMobile'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyRepOtp = async (e) => {
    e.preventDefault();
    if (!repForm.repName || !repForm.designation) {
      toast.error(t('farmerVerificationWizard.pleaseEnterRepresentativeNameAndDesignation')); return;
    }
    if (!repForm.otp || repForm.otp.trim().length !== 6) {
      toast.error(t('farmerVerificationWizard.pleaseEnter6digitOtp')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyRepOtp(repForm);
      setVerification(res.verification);
      toast.success(t('farmerVerificationWizard.verified_authorizedRepresentativeVerified'));
      setCurrentStep(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyOrgBank = async (e) => {
    e.preventDefault();
    if (!orgBankForm.accountHolderName || !orgBankForm.accountNumber || !orgBankForm.ifsc) {
      toast.error(t('farmerVerificationWizard.pleaseFillAccountHolderAccountNumber')); return;
    }
    if (orgBankForm.accountNumber !== orgBankForm.confirmAccountNumber) {
      toast.error(t('farmerVerificationWizard.accountNumbersDoNotMatch')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyOrgBank(orgBankForm);
      setVerification(res.verification);
      toast.success(t('farmerVerificationWizard.verified_organizationBankAccountVerified'));
      setCurrentStep(6);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bank verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyOrgDocuments = async (e) => {
    e.preventDefault();
    if (!docsForm.regCert || !docsForm.panDoc || !docsForm.bankProof) {
      toast.error(t('farmerVerificationWizard.pleaseUploadAtLeastRegistrationCertificate')); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyOrgDocuments(docsForm);
      setVerification(res.verification);
      toast.success(t('farmerVerificationWizard.verified_organizationDocumentsVerified'));
      setCurrentStep(7);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Document verification failed.');
    } finally { setSubmitting(false); }
  };

  // Skip & Save handlers
  const handleSkipCurrentStep = async (stepKey, nextStepNumber) => {
    setSubmitting(true);
    try {
      const res = await farmerService.skipStep(stepKey);
      setVerification(res.verification);
      toast('Step skipped. Status saved as skipped.', { icon: '⏭️' });
      setCurrentStep(nextStepNumber);
    } catch {
      toast.error(t('farmerVerificationWizard.failedToSkipStep'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAndExit = () => {
    toast.success(t('farmerVerificationWizard.progressSavedReturningToDashboard'));
    navigate('/farmer/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-700 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">{t('farmerVerificationWizard.loadingConfigportaltitle')}</p>
        </div>
      </div>
    );
  }

  const stepsList = config.steps;
  const totalStepsCount = stepsList.length + 1; // 7

  const summaryStepObj = {
    id: 7,
    key: 'summary',
    shortLabel: 'Summary',
    name: 'Verification Summary',
    req: true,
    icon: CheckCircle2,
    description: 'Review your overall verification status and finalized badge audit.',
  };

  const allSteps = [...stepsList, summaryStepObj];
  const activeStepObj = allSteps.find((s) => s.id === currentStep) || summaryStepObj;

  const getStepStatus = (key) => {
    if (key === 'summary') {
      return isFullyVerified ? 'VERIFIED' : 'PENDING';
    }
    const status = verification?.[key]?.status;
    if (status === 'verified') return 'VERIFIED';
    if (status === 'not_applicable') return 'NOT_APPLICABLE';
    if (status === 'failed') return 'FAILED';
    if (status === 'skipped') return 'SKIPPED';
    return 'PENDING';
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-12">
      {/* Government-Style Official Header Bar */}
      <header className="bg-emerald-900 text-white border-b-4 border-emerald-600 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white text-emerald-900 flex items-center justify-center font-bold border border-emerald-400 shadow-inner">
              GOI
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold tracking-tight uppercase">
                {resolvedAccountType === 'fpo'
                  ? 'National FPO / FPC Verification Service'
                  : 'National Agricultural Farmer Verification Service'}
              </h1>
              <p className="text-xs text-emerald-200">
                Ministry of Agriculture & Farmers Welfare • AgriBazaar Portal
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs bg-emerald-950/60 px-3 py-1.5 rounded border border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('farmerVerificationWizard.officialIdentityComplianceGateway')}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Top Header Card */}
        <div className="bg-white border border-slate-300 rounded-md p-5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                {resolvedAccountType === 'fpo' ? 'FPO / FPC' : 'FARMER'}: {profile?.farmerType || resolvedAccountType.toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Ref: ABV-{resolvedAccountType.toUpperCase()}-{profile?._id?.slice(-6)?.toUpperCase() || 'SYS'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
              {config.portalTitle}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              {config.pageTitle} — Complete required verification steps to become a verified seller.
            </p>
          </div>

          <button
            onClick={handleSaveAndExit}
            className="self-start md:self-auto inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 rounded transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t('farmerVerificationWizard.saveExitToDashboard')}</span>
          </button>
        </div>

        {/* Wizard Layout: Sidebar Progress + Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar / Left Progress Bar */}
          <div className="lg:col-span-4 bg-white border border-slate-300 rounded-md p-5 shadow-sm h-fit">
            <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                Verification Steps
              </h3>
              <span className="text-xs font-semibold text-slate-600">
                Step {currentStep} of {totalStepsCount}
              </span>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalStepsCount) * 100}%` }}
              />
            </div>

            {/* List of Steps */}
            <div className="space-y-2">
              {allSteps.map((st) => {
                const isCurrent = st.id === currentStep;
                const status = getStepStatus(st.key);

                let badgeBg = 'bg-slate-100 text-slate-600 border-slate-300';
                let badgeLabel = '○ Pending';

                if (status === 'VERIFIED') {
                  badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                  badgeLabel = '✓ Verified';
                } else if (status === 'NOT_APPLICABLE') {
                  badgeBg = 'bg-blue-100 text-blue-800 border-blue-300';
                  badgeLabel = 'N/A';
                } else if (status === 'SKIPPED') {
                  badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
                  badgeLabel = 'Skipped';
                } else if (isCurrent) {
                  badgeBg = 'bg-emerald-600 text-white border-emerald-700';
                  badgeLabel = '● Active';
                }

                return (
                  <button
                    key={st.id}
                    onClick={() => setCurrentStep(st.id)}
                    className={`w-full text-left p-3 rounded-md border text-xs transition flex items-start justify-between gap-3 ${
                      isCurrent
                        ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isCurrent
                            ? 'bg-emerald-700 text-white'
                            : status === 'VERIFIED'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {st.id}
                      </div>
                      <div>
                        <p className={`font-semibold ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                          {st.name}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {st.shortLabel} {st.req ? '(Required)' : '(Optional)'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${badgeBg}`}>
                      {badgeLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Form Step Content */}
          <div className="lg:col-span-8 bg-white border border-slate-300 rounded-md p-6 shadow-sm">
            {/* Step Header */}
            <div className="border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wide text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                  STEP {currentStep} OF {totalStepsCount} • {activeStepObj?.req ? t('farmerVerificationWizard.mandatoryVerification') : t('farmerVerificationWizard.optionalVerification')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-2 flex items-center gap-2">
                {activeStepObj?.icon && <activeStepObj.icon className="w-5 h-5 text-emerald-700" />}
                {activeStepObj?.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {activeStepObj?.description}
              </p>
            </div>

            {/* =========================================================
                FARMER STEPS
            ========================================================= */}
            {resolvedAccountType === 'farmer' && (
              <>
                {/* FARMER STEP 1: AADHAAR */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.aadhaarAuthenticationProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.enterYour12digitAadhaarNumberTo')}</p>
                    </div>

                    {verification?.aadhaar?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Identity Verified
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            Status: Verified
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">
                          Name on Record: <strong>{verification.aadhaar.verifiedName || 'Verified Farmer'}</strong>
                        </p>
                        <p className="text-[11px] text-slate-500">🔒 Aadhaar details are encrypted and masked under UIDAI regulations.</p>
                      </div>
                    ) : (
                      <form onSubmit={aadhaarForm.otpSent ? handleVerifyAadhaarOtp : handleSendAadhaarOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">
                            Aadhaar Number *
                          </label>
                          <input
                            type="text"
                            maxLength={12}
                            disabled={aadhaarForm.otpSent}
                            placeholder={t('farmerVerificationWizard.enter12digitAadhaarNumber')}
                            value={aadhaarForm.aadhaarNumber}
                            onChange={(e) => setAadhaarForm({ ...aadhaarForm, aadhaarNumber: e.target.value })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2.5 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono tracking-widest disabled:bg-slate-100 outline-none"
                          />
                        </div>

                        {!aadhaarForm.otpSent ? (
                          <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                          >
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('farmerVerificationWizard.sendAadhaarOtp')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="space-y-3 pt-1">
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-semibold">
                              ✓ OTP sent to mobile linked with Aadhaar reference <span className="font-mono font-bold">{aadhaarForm.referenceId}</span>
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.enter6digitOtp_req')}</label>
                              <input
                                type="text"
                                maxLength={6}
                                placeholder={t('farmerVerificationWizard.text_mnk1z')}
                                value={aadhaarForm.otp}
                                onChange={(e) => setAadhaarForm({ ...aadhaarForm, otp: e.target.value })}
                                className="w-full border border-slate-300 rounded text-xs px-3 py-2.5 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono text-center text-lg tracking-[0.4em] outline-none"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => setAadhaarForm((p) => ({ ...p, otpSent: false }))}
                                className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                              >
                                Change Number
                              </button>
                              <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                              >
                                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                <span>{t('farmerVerificationWizard.verifyContinue')}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </form>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleSaveAndExit}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.saveExit')}</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleSkipCurrentStep('aadhaar', 2)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded border border-amber-300"
                        >
                          <span>{t('farmerVerificationWizard.skipStep')}</span>
                        </button>
                        {verification?.aadhaar?.status === 'verified' && (
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                          >
                            <span>{t('farmerVerificationWizard.nextStep')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* FARMER STEP 2: FARMER REGISTRY */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.farmerDatabaseProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.enterYourOfficialFarmerAgristackId')}</p>
                    </div>

                    {verification?.farmerRegistry?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Farmer Registry Verified
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            Status: Verified
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.farmerId')}</span><strong className="text-slate-900 font-mono">{verification.farmerRegistry.farmerIdMasked}</strong></div>
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.location')}</span><strong className="text-slate-900">{verification.farmerRegistry.district}, {verification.farmerRegistry.state}</strong></div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyFarmerReg} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.farmerIdAgristackId_req')}</label>
                          <input
                            type="text"
                            required
                            placeholder={t('farmerVerificationWizard.egMhfarm20248849')}
                            value={farmerRegForm.farmerId}
                            onChange={(e) => setFarmerRegForm({ ...farmerRegForm, farmerId: e.target.value })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.state_req')}</label>
                            <select
                              value={farmerRegForm.state}
                              onChange={(e) => setFarmerRegForm({ ...farmerRegForm, state: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                            >
                              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.district_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.egNashik')}
                              value={farmerRegForm.district}
                              onChange={(e) => setFarmerRegForm({ ...farmerRegForm, district: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                        >
                          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{t('farmerVerificationWizard.verifyContinue')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.back')}</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleSkipCurrentStep('farmerRegistry', 3)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded border border-amber-300"
                        >
                          <span>{t('farmerVerificationWizard.skipStep')}</span>
                        </button>
                        {verification?.farmerRegistry?.status === 'verified' && (
                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                          >
                            <span>{t('farmerVerificationWizard.nextStep')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* FARMER STEP 3: LAND RECORD */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.landHoldingProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.enterStateDistrictTalukVillagePatta')}</p>
                    </div>

                    {verification?.landRecord?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Land Record Verified
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            Status: Verified
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.patta712No')}</span><strong className="text-slate-900 font-mono">{verification.landRecord.pattaNumberMasked}</strong></div>
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.surveyNo')}</span><strong className="text-slate-900">{verification.landRecord.surveyNumber}</strong></div>
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.extent')}</span><strong className="text-slate-900">{verification.landRecord.extent}</strong></div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyLandRecord} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.state_req')}</label>
                            <select
                              value={landForm.state}
                              onChange={(e) => setLandForm({ ...landForm, state: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                            >
                              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.district_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.egNashik')}
                              value={landForm.district}
                              onChange={(e) => setLandForm({ ...landForm, district: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.taluk_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.egNiphad')}
                              value={landForm.taluk}
                              onChange={(e) => setLandForm({ ...landForm, taluk: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.village_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.egLasalgaon')}
                              value={landForm.village}
                              onChange={(e) => setLandForm({ ...landForm, village: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.pattaKhataNo_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.eg4829')}
                              value={landForm.pattaNumber}
                              onChange={(e) => setLandForm({ ...landForm, pattaNumber: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.surveyNo_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.eg142b')}
                              value={landForm.surveyNumber}
                              onChange={(e) => setLandForm({ ...landForm, surveyNumber: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.landExtentAcres_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.eg35Acres')}
                              value={landForm.extent}
                              onChange={(e) => setLandForm({ ...landForm, extent: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.landType')}</label>
                            <select
                              value={landForm.landType}
                              onChange={(e) => setLandForm({ ...landForm, landType: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                            >
                              <option value="Wet">{t('farmerVerificationWizard.irrigatedWet')}</option>
                              <option value="Dry">{t('farmerVerificationWizard.dryRainfed')}</option>
                              <option value="Horticulture">{t('farmerVerificationWizard.horticulture')}</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                          <input
                            type="checkbox"
                            id="isTenant"
                            checked={landForm.isTenant}
                            onChange={(e) => setLandForm({ ...landForm, isTenant: e.target.checked })}
                            className="w-4 h-4 text-emerald-700 rounded"
                          />
                          <label htmlFor="isTenant" className="text-xs font-medium text-slate-700 cursor-pointer">
                            I am a registered Cultivator / Tenant Farmer on this land
                          </label>
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <SecureFileUpload
                            documentType="PATTA"
                            category="VERIFICATION"
                            subCategory="LAND"
                            entityType="VERIFICATION"
                            label={t('farmerVerificationWizard.uploadPattaLandRecordDocument_req')}
                            description={t('farmerVerificationWizard.uploadPdfJpgOrPngCopy')}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                        >
                          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{t('farmerVerificationWizard.verifyContinue')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.back')}</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleSkipCurrentStep('landRecord', 4)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded border border-amber-300"
                        >
                          <span>{t('farmerVerificationWizard.skipStep')}</span>
                        </button>
                        {verification?.landRecord?.status === 'verified' && (
                          <button
                            type="button"
                            onClick={() => setCurrentStep(4)}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                          >
                            <span>{t('farmerVerificationWizard.nextStep')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* FARMER STEP 4: BANK ACCOUNT */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.bankSettlementProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.linkYourActiveBankAccountFor')}</p>
                    </div>

                    {verification?.bankAccount?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Bank Account Verified
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            Status: Verified
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.accountHolder')}</span><strong className="text-slate-900">{verification.bankAccount.accountHolderName}</strong></div>
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.bankName')}</span><strong className="text-slate-900">{verification.bankAccount.bankName}</strong></div>
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.accountNo')}</span><strong className="text-slate-900 font-mono">{verification.bankAccount.accountNumberMasked}</strong></div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyBankAccount} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.accountHolderName_req')}</label>
                          <input
                            type="text"
                            required
                            placeholder={t('farmerVerificationWizard.asPerBankPassbook')}
                            value={bankForm.accountHolderName}
                            onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.bankName_req')}</label>
                            <select
                              value={bankForm.bankName}
                              onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                            >
                              {MAJOR_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.branchName')}</label>
                            <input
                              type="text"
                              placeholder={t('farmerVerificationWizard.egMainBranch')}
                              value={bankForm.branchName}
                              onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.accountNumber_req')}</label>
                            <input
                              type="password"
                              required
                              placeholder={t('farmerVerificationWizard.enterAccountNumber')}
                              value={bankForm.accountNumber}
                              onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.confirmAccountNumber_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.reenterAccountNumber')}
                              value={bankForm.confirmAccountNumber}
                              onChange={(e) => setBankForm({ ...bankForm, confirmAccountNumber: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.ifscCode_req')}</label>
                          <input
                            type="text"
                            required
                            maxLength={11}
                            placeholder={t('farmerVerificationWizard.egSbin0001234')}
                            value={bankForm.ifsc}
                            onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono uppercase outline-none"
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <SecureFileUpload
                            documentType="BANK_PROOF"
                            category="VERIFICATION"
                            subCategory="BANK"
                            entityType="VERIFICATION"
                            label={t('farmerVerificationWizard.uploadBankPassbookCancelledCheque_req')}
                            description={t('farmerVerificationWizard.uploadFrontPageOfPassbookOr')}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                        >
                          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{t('farmerVerificationWizard.verifyContinue')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.back')}</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleSkipCurrentStep('bankAccount', 5)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded border border-amber-300"
                        >
                          <span>{t('farmerVerificationWizard.skipStep')}</span>
                        </button>
                        {verification?.bankAccount?.status === 'verified' && (
                          <button
                            type="button"
                            onClick={() => setCurrentStep(5)}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                          >
                            <span>{t('farmerVerificationWizard.nextStep')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* FARMER STEP 5: PAN */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.panVerificationProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.enterYour10characterPermanentAccountNumber')}</p>
                    </div>

                    {verification?.pan?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> PAN Verified
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            Status: Verified
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.panNumber')}</span><strong className="text-slate-900 font-mono">{verification.pan.panMasked}</strong></div>
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.matchStatus')}</span><strong className="text-emerald-700">Confirmed Match ✓</strong></div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyPan} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.panNumber_req')}</label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder={t('farmerVerificationWizard.egAbcde1234f')}
                            value={panForm.panNumber}
                            onChange={(e) => setPanForm({ ...panForm, panNumber: e.target.value.toUpperCase() })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono uppercase tracking-wider outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.nameAsPerPanOptional')}</label>
                          <input
                            type="text"
                            placeholder={t('farmerVerificationWizard.fullNameAsPrintedOnPan')}
                            value={panForm.nameAsPerPan}
                            onChange={(e) => setPanForm({ ...panForm, nameAsPerPan: e.target.value })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <SecureFileUpload
                            documentType="PAN_DOC"
                            category="VERIFICATION"
                            subCategory="PAN"
                            entityType="VERIFICATION"
                            label={t('farmerVerificationWizard.uploadPanCardCopy_req')}
                            description={t('farmerVerificationWizard.clearFrontScanOrPhotoOf')}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                        >
                          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{t('farmerVerificationWizard.verifyContinue')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.back')}</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleSkipCurrentStep('pan', 6)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded border border-amber-300"
                        >
                          <span>{t('farmerVerificationWizard.skipStep')}</span>
                        </button>
                        {verification?.pan?.status === 'verified' && (
                          <button
                            type="button"
                            onClick={() => setCurrentStep(6)}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                          >
                            <span>{t('farmerVerificationWizard.nextStep')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* FARMER STEP 6: PM-KISAN */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.pmkisanSchemeProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.optionallyLinkPmkisanBeneficiaryReferenceFor')}</p>
                    </div>

                    {verification?.pmKisan?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700" /> PM-KISAN Record Verified
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.pmkisanRegistrationBeneficiaryReference')}</label>
                          <input
                            type="text"
                            placeholder={t('farmerVerificationWizard.egPmk987654321')}
                            value={pmKisanForm.pmKisanRef}
                            onChange={(e) => setPmKisanForm({ ...pmKisanForm, pmKisanRef: e.target.value })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono outline-none"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={() => handleVerifyPmKisan('skip')}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                          >
                            Skip PM-KISAN
                          </button>
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={() => handleVerifyPmKisan('verify')}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                          >
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('farmerVerificationWizard.verifyPmkisanContinue')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.back')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(7)}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                      >
                        <span>{t('farmerVerificationWizard.viewSummary')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* =========================================================
                FPO STEPS
            ========================================================= */}
            {resolvedAccountType === 'fpo' && (
              <>
                {/* FPO STEP 1: ORGANIZATION IDENTITY */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.organizationRegistrationProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.verifyOfficialFpoFpcCooperativeEntity')}</p>
                    </div>

                    {verification?.orgIdentity?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Organization Verified
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            Status: Verified
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.legalName')}</span><strong className="text-slate-900">{verification.orgIdentity.orgName}</strong></div>
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.registrationNo')}</span><strong className="text-slate-900 font-mono">{verification.orgIdentity.registrationNumber}</strong></div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyOrgIdentity} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.organizationLegalName_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.egSahyadriFarmersProducerCoLtd')}
                              value={orgForm.orgName}
                              onChange={(e) => setOrgForm({ ...orgForm, orgName: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.organizationType_req')}</label>
                            <select
                              value={orgForm.orgType}
                              onChange={(e) => setOrgForm({ ...orgForm, orgType: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                            >
                              <option value="FPO / FPC">{t('farmerVerificationWizard.fpoFpcProducerCompany')}</option>
                              <option value="Cooperative Society">{t('farmerVerificationWizard.agriculturalCooperativeSociety')}</option>
                              <option value="Partnership / SHG">{t('farmerVerificationWizard.farmerShgPartnership')}</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.registrationCinNumber_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.egU01111mh2020ptc123456')}
                              value={orgForm.registrationNumber}
                              onChange={(e) => setOrgForm({ ...orgForm, registrationNumber: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.state_req')}</label>
                            <select
                              value={orgForm.state}
                              onChange={(e) => setOrgForm({ ...orgForm, state: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                            >
                              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.district_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.egNashik')}
                              value={orgForm.district}
                              onChange={(e) => setOrgForm({ ...orgForm, district: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.pincode_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.eg422001')}
                              value={orgForm.pincode}
                              onChange={(e) => setOrgForm({ ...orgForm, pincode: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.registeredOfficeAddress_req')}</label>
                          <textarea
                            rows={2}
                            required
                            placeholder={t('farmerVerificationWizard.fullAddressOfOrganizationOffice')}
                            value={orgForm.address}
                            onChange={(e) => setOrgForm({ ...orgForm, address: e.target.value })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                        >
                          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{t('farmerVerificationWizard.verifyContinue')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleSaveAndExit}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.saveExit')}</span>
                      </button>

                      {verification?.orgIdentity?.status === 'verified' && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                        >
                          <span>{t('farmerVerificationWizard.nextStep')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* FPO STEP 2: ORG PAN */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.organizationPanProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.enterPermanentAccountNumberIssuedIn')}</p>
                    </div>

                    {verification?.orgPan?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Organization PAN Verified
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            Status: Verified
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.orgPan')}</span><strong className="text-slate-900 font-mono">{verification.orgPan.panMasked}</strong></div>
                          <div><span className="text-slate-500 block font-semibold">{t('farmerVerificationWizard.legalName')}</span><strong className="text-slate-900">{verification.orgPan.orgName}</strong></div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyOrgPan} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.organizationPan_req')}</label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder={t('farmerVerificationWizard.egAaacf1234g')}
                            value={orgPanForm.panNumber}
                            onChange={(e) => setOrgPanForm({ ...orgPanForm, panNumber: e.target.value.toUpperCase() })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono uppercase tracking-wider outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                        >
                          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{t('farmerVerificationWizard.verifyContinue')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.back')}</span>
                      </button>

                      {verification?.orgPan?.status === 'verified' && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                        >
                          <span>{t('farmerVerificationWizard.nextStep')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* FPO STEP 3: GSTIN */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.gstinRegistrationProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.provide15characterGstinRegistrationIfRegistered')}</p>
                    </div>

                    {verification?.gstin?.status === 'verified' || verification?.gstin?.status === 'not_applicable' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> GSTIN Status Confirmed
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            {verification.gstin.status === 'not_applicable' ? t('farmerVerificationWizard.notApplicable') : 'Verified'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">15-Digit GSTIN Number</label>
                          <input
                            type="text"
                            maxLength={15}
                            placeholder={t('farmerVerificationWizard.eg27aaacf1234g1z5')}
                            value={gstinForm.gstinNumber}
                            onChange={(e) => setGstinForm({ ...gstinForm, gstinNumber: e.target.value.toUpperCase() })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono uppercase tracking-wider outline-none"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={() => handleVerifyGstin('not_applicable')}
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                          >
                            Mark Not Applicable
                          </button>
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={() => handleVerifyGstin('verify')}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                          >
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('farmerVerificationWizard.verifyGstin')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.back')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                      >
                        <span>{t('farmerVerificationWizard.nextStep')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* FPO STEP 4: REPRESENTATIVE */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.authorizedOfficialProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.verifyIdentityAndMobileAuthorizationOf')}</p>
                    </div>

                    {verification?.representative?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Representative Verified
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            Status: Verified
                          </span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={repForm.otpSent ? handleVerifyRepOtp : handleSendRepOtp} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.representativeName_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.egRameshKumar')}
                              value={repForm.repName}
                              onChange={(e) => setRepForm({ ...repForm, repName: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.designation_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.egCeoManagingDirector')}
                              value={repForm.designation}
                              onChange={(e) => setRepForm({ ...repForm, designation: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.representativeMobileNumber_req')}</label>
                          <input
                            type="text"
                            maxLength={10}
                            disabled={repForm.otpSent}
                            placeholder={t('farmerVerificationWizard.enter10digitMobileNumber')}
                            value={repForm.mobileNumber}
                            onChange={(e) => setRepForm({ ...repForm, mobileNumber: e.target.value })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono outline-none disabled:bg-slate-100"
                          />
                        </div>

                        {!repForm.otpSent ? (
                          <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                          >
                            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{t('farmerVerificationWizard.sendRepresentativeOtp')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="space-y-3 pt-1">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.enter6digitOtp_req')}</label>
                              <input
                                type="text"
                                maxLength={6}
                                placeholder={t('farmerVerificationWizard.text_mnk1z')}
                                value={repForm.otp}
                                onChange={(e) => setRepForm({ ...repForm, otp: e.target.value })}
                                className="w-full border border-slate-300 rounded text-xs px-3 py-2.5 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono text-center text-lg tracking-[0.4em] outline-none"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={submitting}
                              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                            >
                              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>{t('farmerVerificationWizard.verifyRepresentative')}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </form>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.back')}</span>
                      </button>

                      {verification?.representative?.status === 'verified' && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(5)}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                        >
                          <span>{t('farmerVerificationWizard.nextStep')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* FPO STEP 5: ORG BANK */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.organizationSettlementAccountProtocol')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.linkPrimarySettlementBankAccountOf')}</p>
                    </div>

                    {verification?.orgBank?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Organization Bank Account Verified
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            Status: Verified
                          </span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyOrgBank} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.accountHolderName_req')}</label>
                          <input
                            type="text"
                            required
                            placeholder={t('farmerVerificationWizard.exactLegalNameAsPerBank')}
                            value={orgBankForm.accountHolderName}
                            onChange={(e) => setOrgBankForm({ ...orgBankForm, accountHolderName: e.target.value })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.bankName_req')}</label>
                            <select
                              value={orgBankForm.bankName}
                              onChange={(e) => setOrgBankForm({ ...orgBankForm, bankName: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                            >
                              {MAJOR_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.branchName')}</label>
                            <input
                              type="text"
                              placeholder={t('farmerVerificationWizard.egCommercialBranch')}
                              value={orgBankForm.branchName}
                              onChange={(e) => setOrgBankForm({ ...orgBankForm, branchName: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.accountNumber_req')}</label>
                            <input
                              type="password"
                              required
                              placeholder={t('farmerVerificationWizard.enterBankAccountNumber')}
                              value={orgBankForm.accountNumber}
                              onChange={(e) => setOrgBankForm({ ...orgBankForm, accountNumber: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.confirmAccountNumber_req')}</label>
                            <input
                              type="text"
                              required
                              placeholder={t('farmerVerificationWizard.reenterAccountNumber')}
                              value={orgBankForm.confirmAccountNumber}
                              onChange={(e) => setOrgBankForm({ ...orgBankForm, confirmAccountNumber: e.target.value })}
                              className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">{t('farmerVerificationWizard.ifscCode_req')}</label>
                          <input
                            type="text"
                            required
                            maxLength={11}
                            placeholder={t('farmerVerificationWizard.egSbin0001234')}
                            value={orgBankForm.ifsc}
                            onChange={(e) => setOrgBankForm({ ...orgBankForm, ifsc: e.target.value.toUpperCase() })}
                            className="w-full border border-slate-300 rounded text-xs px-3 py-2 focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 font-mono uppercase outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                        >
                          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{t('farmerVerificationWizard.verifyContinue')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.back')}</span>
                      </button>

                      {verification?.orgBank?.status === 'verified' && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(6)}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                        >
                          <span>{t('farmerVerificationWizard.nextStep')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* FPO STEP 6: ORG DOCUMENTS */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">{t('farmerVerificationWizard.organizationDocumentDossier')}</p>
                      <p className="text-slate-600">{t('farmerVerificationWizard.uploadMandatoryRegistrationTaxBankProof')}</p>
                    </div>

                    {verification?.orgDocuments?.status === 'verified' ? (
                      <div className="bg-emerald-50/60 border border-emerald-300 rounded-md p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Documents Verified
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-300 uppercase">
                            Status: Verified
                          </span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyOrgDocuments} className="space-y-6">
                        <SecureFileUpload
                          documentType="REGISTRATION_CERT"
                          category="VERIFICATION"
                          subCategory="REGISTRATION"
                          entityType="VERIFICATION"
                          label={t('farmerVerificationWizard.1OrganizationRegistrationCertificate_req')}
                          onUploadSuccess={() => setDocsForm((prev) => ({ ...prev, regCert: true }))}
                        />

                        <SecureFileUpload
                          documentType="PAN_DOC"
                          category="VERIFICATION"
                          subCategory="PAN"
                          entityType="VERIFICATION"
                          label={t('farmerVerificationWizard.2OrganizationPanCardCopy_req')}
                          onUploadSuccess={() => setDocsForm((prev) => ({ ...prev, panDoc: true }))}
                        />

                        <SecureFileUpload
                          documentType="BANK_PROOF"
                          category="VERIFICATION"
                          subCategory="BANK"
                          entityType="VERIFICATION"
                          label={t('farmerVerificationWizard.3BankPassbookCancelledCheque_req')}
                          onUploadSuccess={() => setDocsForm((prev) => ({ ...prev, bankProof: true }))}
                        />

                        <SecureFileUpload
                          documentType="AUTHORIZATION_LETTER"
                          category="VERIFICATION"
                          subCategory="AUTHORIZATION"
                          entityType="VERIFICATION"
                          label={t('farmerVerificationWizard.4AuthorizationLetterBoardResolution')}
                          onUploadSuccess={() => setDocsForm((prev) => ({ ...prev, authDoc: true }))}
                        />

                        <SecureFileUpload
                          documentType="GST_CERT"
                          category="VERIFICATION"
                          subCategory="GST"
                          entityType="VERIFICATION"
                          label={t('farmerVerificationWizard.5GstCertificateIfApplicable')}
                          onUploadSuccess={() => setDocsForm((prev) => ({ ...prev, gstCert: true }))}
                        />

                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50 transition"
                        >
                          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{t('farmerVerificationWizard.submitDocumentsProceed')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('farmerVerificationWizard.back')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(7)}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                      >
                        <span>{t('farmerVerificationWizard.viewSummary')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* =========================================================
                STEP 7: COMMON FINAL SUMMARY & AUDIT DISPLAY
            ========================================================= */}
            {currentStep === 7 && (
              <div className="space-y-6">
                {isFullyVerified ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-md p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto mb-3 shadow">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-bold text-emerald-900">
                      {config.badgeText}
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                      All required verification checks have been audited and updated in the official seller registry.
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-300 rounded-md p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto mb-3 shadow">
                      <AlertCircle className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-bold text-amber-900">
                      {config.incompleteBadgeText}
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 max-w-md mx-auto">
                      You can return anytime to complete pending checks and unlock your verified seller badge.
                    </p>
                  </div>
                )}

                {/* Checklist Summary Table */}
                <div className="bg-slate-50 border border-slate-300 rounded p-4">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                    Verification Checklist Audit Status
                  </h5>
                  <div className="space-y-2">
                    {stepsList.map((st) => {
                      const stStatus = getStepStatus(st.key);
                      const isOk = stStatus === 'VERIFIED' || stStatus === 'NOT_APPLICABLE';
                      return (
                        <div key={st.key} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200 last:border-0">
                          <span className="font-semibold text-slate-800 flex items-center gap-2">
                            {isOk ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                            )}
                            {st.name}
                          </span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[10px] border ${
                              stStatus === 'VERIFIED'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : stStatus === 'NOT_APPLICABLE'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : stStatus === 'SKIPPED'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                          >
                            {stStatus}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('farmerVerificationWizard.backToReview')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/farmer/dashboard')}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-6 py-3 rounded shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>{t('farmerVerificationWizard.returnToDashboard')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Official Security Disclaimer Notice */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center">
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('farmerVerificationWizard.yourInformationIsSecurelyProcessedSensitive')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
