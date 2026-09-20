import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  Upload,
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
      toast.error('Failed to load verification status.');
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
      toast.error('Please enter a valid 12-digit Aadhaar number.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.sendAadhaarOtp(clean);
      setAadhaarForm((prev) => ({ ...prev, otpSent: true, referenceId: res.referenceId }));
      toast.success('OTP sent to your Aadhaar mobile number!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyAadhaarOtp = async (e) => {
    e.preventDefault();
    if (!aadhaarForm.otp || aadhaarForm.otp.trim().length !== 6) {
      toast.error('Please enter 6-digit OTP.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyAadhaarOtp(aadhaarForm.referenceId, aadhaarForm.otp);
      setVerification(res.verification);
      toast.success('✓ Aadhaar Identity Verified!');
      setCurrentStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyFarmerReg = async (e) => {
    e.preventDefault();
    if (!farmerRegForm.farmerId || !farmerRegForm.district) {
      toast.error('Please enter Farmer ID and District.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyFarmerRegistry(farmerRegForm);
      setVerification(res.verification);
      toast.success('✓ Farmer Registry Verified!');
      setCurrentStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyLandRecord = async (e) => {
    e.preventDefault();
    if (!landForm.district || !landForm.pattaNumber || !landForm.surveyNumber || !landForm.extent) {
      toast.error('Please fill required land fields.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyLandRecord(landForm);
      setVerification(res.verification);
      toast.success('✓ Land Record Verified!');
      setCurrentStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyBankAccount = async (e) => {
    e.preventDefault();
    if (!bankForm.accountHolderName || !bankForm.accountNumber || !bankForm.ifsc) {
      toast.error('Please enter Account Holder, Account Number, and IFSC.'); return;
    }
    if (bankForm.accountNumber !== bankForm.confirmAccountNumber) {
      toast.error('Account numbers do not match.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyBankAccount(bankForm);
      setVerification(res.verification);
      toast.success('✓ Bank Account Verified!');
      setCurrentStep(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyPan = async (e) => {
    e.preventDefault();
    if (!panForm.panNumber) {
      toast.error('Please enter 10-character PAN number.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyPan(panForm);
      setVerification(res.verification);
      toast.success('✓ PAN Verified!');
      setCurrentStep(6);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyPmKisan = async (action) => {
    setSubmitting(true);
    try {
      const res = await farmerService.verifyPmKisan({ action, pmKisanRef: pmKisanForm.pmKisanRef });
      setVerification(res.verification);
      if (action === 'skip') toast('PM-KISAN skipped.', { icon: 'ℹ️' });
      else toast.success('✓ PM-KISAN Record Verified!');
      setCurrentStep(7);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally { setSubmitting(false); }
  };

  // -------------------------------------------------------------
  // FPO STEP HANDLERS
  // -------------------------------------------------------------
  const handleVerifyOrgIdentity = async (e) => {
    e.preventDefault();
    if (!orgForm.orgName || !orgForm.registrationNumber || !orgForm.state || !orgForm.district) {
      toast.error('Please enter Organization Name, Registration Number, State, and District.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyOrgIdentity(orgForm);
      setVerification(res.verification);
      toast.success('✓ Organization Identity Verified!');
      setCurrentStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Organization verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyOrgPan = async (e) => {
    e.preventDefault();
    if (!orgPanForm.panNumber) {
      toast.error('Please enter 10-character Organization PAN number.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyOrgPan(orgPanForm);
      setVerification(res.verification);
      toast.success('✓ Organization PAN Verified!');
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
      toast.success(isNotApp ? 'GSTIN marked as Not Applicable.' : '✓ GSTIN Verified!');
      setCurrentStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'GSTIN verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleSendRepOtp = async (e) => {
    e.preventDefault();
    const clean = repForm.mobileNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.sendRepOtp(clean);
      setRepForm((prev) => ({ ...prev, otpSent: true, referenceId: res.referenceId }));
      toast.success('OTP sent to Representative mobile!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyRepOtp = async (e) => {
    e.preventDefault();
    if (!repForm.repName || !repForm.designation) {
      toast.error('Please enter Representative Name and Designation.'); return;
    }
    if (!repForm.otp || repForm.otp.trim().length !== 6) {
      toast.error('Please enter 6-digit OTP.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyRepOtp(repForm);
      setVerification(res.verification);
      toast.success('✓ Authorized Representative Verified!');
      setCurrentStep(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyOrgBank = async (e) => {
    e.preventDefault();
    if (!orgBankForm.accountHolderName || !orgBankForm.accountNumber || !orgBankForm.ifsc) {
      toast.error('Please fill Account Holder, Account Number, and IFSC.'); return;
    }
    if (orgBankForm.accountNumber !== orgBankForm.confirmAccountNumber) {
      toast.error('Account numbers do not match.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyOrgBank(orgBankForm);
      setVerification(res.verification);
      toast.success('✓ Organization Bank Account Verified!');
      setCurrentStep(6);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bank verification failed.');
    } finally { setSubmitting(false); }
  };

  const handleVerifyOrgDocuments = async (e) => {
    e.preventDefault();
    if (!docsForm.regCert || !docsForm.panDoc || !docsForm.bankProof) {
      toast.error('Please upload at least Registration Certificate, PAN document, and Bank proof.'); return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyOrgDocuments(docsForm);
      setVerification(res.verification);
      toast.success('✓ Organization Documents Verified!');
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
      toast.error('Failed to skip step.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAndExit = () => {
    toast.success('Progress saved. Returning to dashboard.');
    navigate('/farmer/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-[#00C853] animate-spin" />
        <p className="text-sm font-bold text-[#082B36] font-display">Opening {config.portalTitle}...</p>
      </div>
    );
  }

  const stepsList = config.steps;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 px-2 sm:px-4">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#00E676]/15 text-[#00C853] border border-[#00E676]/30 inline-flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> {config.portalTitle}
            </span>
            {currentStep <= 6 && (
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                Step {currentStep} of 6
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-[#082B36] font-display mt-2">
            {currentStep <= 6 ? stepsList[currentStep - 1].name : 'Verification Completed'}
          </h1>
          <p className="text-xs text-[#52636A] mt-1 font-sans">
            Complete each step below. You can skip optional/non-immediate steps and resume anytime.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAndExit}
          className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-extrabold text-[#082B36] hover:bg-gray-50 flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <Save className="w-4 h-4 text-emerald-600" /> Save & Exit
        </button>
      </div>

      {/* Step Stepper Progress Indicator */}
      <div className="bg-white rounded-2xl border border-[#E2E8E5] p-4 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[550px] gap-2">
          {stepsList.map((st) => {
            const isCurrent = currentStep === st.id;
            const status = verification?.[st.key]?.status || 'pending';
            const isVerified = status === 'verified';
            const isSkipped = status === 'skipped';
            const isNotApp = status === 'not_applicable';

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setCurrentStep(st.id)}
                className={`flex-1 flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                  isCurrent ? 'bg-[#F7F9F3] border-2 border-[#00C853] shadow-sm' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-black ${isCurrent ? 'text-[#00C853]' : 'text-gray-400'}`}>
                    0{st.id}
                  </span>
                  {isVerified ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00C853]" />
                  ) : isNotApp ? (
                    <span className="text-[10px] font-bold text-blue-600">N/A</span>
                  ) : isSkipped ? (
                    <span className="text-[10px] font-bold text-amber-600">○</span>
                  ) : (
                    <span className={`w-3 h-3 rounded-full text-[8px] flex items-center justify-center font-bold ${isCurrent ? 'bg-[#00C853] text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {st.req ? 'R' : 'O'}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] font-bold font-display mt-1 truncate max-w-[80px] ${isCurrent ? 'text-[#082B36]' : 'text-gray-500'}`}>
                  {st.shortLabel}
                </span>
                <span className="text-[9px] font-extrabold mt-0.5">
                  {isVerified ? (
                    <span className="text-[#00C853]">✓ Verified</span>
                  ) : isNotApp ? (
                    <span className="text-blue-600">N/A</span>
                  ) : isSkipped ? (
                    <span className="text-amber-600">○ Skipped</span>
                  ) : (
                    <span className="text-gray-400">○ Pending</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ONE STEP AT A TIME CONTAINER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${resolvedAccountType}-${currentStep}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {/* =========================================================
              FARMER STEPS
          ========================================================= */}
          {resolvedAccountType === 'farmer' && (
            <>
              {/* FARMER STEP 1: AADHAAR */}
              {currentStep === 1 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">Step 1 of 6 · Required</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">Identity Verification</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">
                        Verify your identity securely using your 12-digit Aadhaar number.
                      </p>
                    </div>
                  </div>

                  {verification?.aadhaar?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[#00C853] font-bold text-base">
                          <CheckCircle2 className="w-5 h-5" /> ✓ Identity Verified
                        </span>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">STATUS: VERIFIED</span>
                      </div>
                      <p className="text-xs text-gray-600 font-sans">
                        Name on Record: <strong>{verification.aadhaar.verifiedName || 'Verified Farmer'}</strong>
                      </p>
                      <p className="text-[11px] text-gray-400">🔒 Aadhaar details are encrypted and masked under UIDAI regulations.</p>
                    </div>
                  ) : (
                    <form onSubmit={aadhaarForm.otpSent ? handleVerifyAadhaarOtp : handleSendAadhaarOtp} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1.5">
                          Aadhaar Number *
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          disabled={aadhaarForm.otpSent}
                          placeholder="Enter 12-digit Aadhaar number"
                          value={aadhaarForm.aadhaarNumber}
                          onChange={(e) => setAadhaarForm({ ...aadhaarForm, aadhaarNumber: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] font-mono text-base tracking-widest disabled:bg-gray-100"
                        />
                      </div>

                      {!aadhaarForm.otpSent ? (
                        <button type="submit" disabled={submitting} className="btn-agri-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2">
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                        </button>
                      ) : (
                        <div className="space-y-3 pt-1">
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                            ✓ OTP sent to mobile linked with Aadhaar reference <span className="font-mono font-bold">{aadhaarForm.referenceId}</span>
                          </div>
                          <div>
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Enter 6-Digit OTP *</label>
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="──────"
                              value={aadhaarForm.otp}
                              onChange={(e) => setAadhaarForm({ ...aadhaarForm, otp: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] font-mono text-center text-lg tracking-[0.4em]"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => setAadhaarForm((p) => ({ ...p, otpSent: false }))} className="px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50">Change Number</button>
                            <button type="submit" disabled={submitting} className="btn-agri-primary flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2">
                              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={handleSaveAndExit} className="text-xs font-extrabold text-gray-500 hover:text-gray-800 flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save & Exit</button>
                    <div className="flex items-center gap-2">
                      <button type="button" disabled={submitting} onClick={() => handleSkipCurrentStep('aadhaar', 2)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">Skip for Now</button>
                      {verification?.aadhaar?.status === 'verified' && (
                        <button type="button" onClick={() => setCurrentStep(2)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">Next Step <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FARMER STEP 2: FARMER REGISTRY */}
              {currentStep === 2 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><Building2 className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">Step 2 of 6 · Required</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">Farmer Registry / Agristack ID</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">Confirm your registration status in the state/national farmer database.</p>
                    </div>
                  </div>

                  {verification?.farmerRegistry?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ Farmer Registry Verified</span>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">STATUS: VERIFIED</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans pt-1">
                        <div><span className="text-gray-400 block font-bold">FARMER ID</span><strong className="text-[#082B36] font-mono">{verification.farmerRegistry.farmerIdMasked}</strong></div>
                        <div><span className="text-gray-400 block font-bold">LOCATION</span><strong className="text-[#082B36]">{verification.farmerRegistry.district}, {verification.farmerRegistry.state}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyFarmerReg} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Farmer ID / Agristack ID *</label>
                        <input type="text" required placeholder="e.g. MH-FARM-2024-8849" value={farmerRegForm.farmerId} onChange={(e) => setFarmerRegForm({ ...farmerRegForm, farmerId: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">State *</label>
                          <select value={farmerRegForm.state} onChange={(e) => setFarmerRegForm({ ...farmerRegForm, state: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm bg-white">{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">District *</label>
                          <input type="text" required placeholder="e.g. Nashik" value={farmerRegForm.district} onChange={(e) => setFarmerRegForm({ ...farmerRegForm, district: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm" />
                        </div>
                      </div>
                      <button type="submit" disabled={submitting} className="btn-agri-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}</button>
                    </form>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setCurrentStep(1)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <div className="flex items-center gap-2">
                      <button type="button" disabled={submitting} onClick={() => handleSkipCurrentStep('farmerRegistry', 3)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">Skip for Now</button>
                      {verification?.farmerRegistry?.status === 'verified' && (
                        <button type="button" onClick={() => setCurrentStep(3)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">Next Step <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FARMER STEP 3: LAND RECORD */}
              {currentStep === 3 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><Landmark className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">Step 3 of 6 · Required</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">Land Record / Patta Details</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">Verify land holding or cultivation details of your agricultural farm.</p>
                    </div>
                  </div>

                  {verification?.landRecord?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ Land Record Verified</span>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">STATUS: VERIFIED</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs font-sans pt-1">
                        <div><span className="text-gray-400 block font-bold">PATTA / 7-12 NO.</span><strong className="text-[#082B36] font-mono">{verification.landRecord.pattaNumberMasked}</strong></div>
                        <div><span className="text-gray-400 block font-bold">SURVEY NO.</span><strong className="text-[#082B36]">{verification.landRecord.surveyNumber}</strong></div>
                        <div><span className="text-gray-400 block font-bold">EXTENT</span><strong className="text-[#082B36]">{verification.landRecord.extent}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyLandRecord} className="space-y-4 max-w-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">State *</label>
                          <select value={landForm.state} onChange={(e) => setLandForm({ ...landForm, state: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-xs bg-white">{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">District *</label>
                          <input type="text" required placeholder="e.g. Nashik" value={landForm.district} onChange={(e) => setLandForm({ ...landForm, district: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-xs" />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Taluk *</label>
                          <input type="text" required placeholder="e.g. Niphad" value={landForm.taluk} onChange={(e) => setLandForm({ ...landForm, taluk: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-xs" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Village *</label>
                          <input type="text" required placeholder="e.g. Lasalgaon" value={landForm.village} onChange={(e) => setLandForm({ ...landForm, village: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-xs" />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Patta / Khata No. *</label>
                          <input type="text" required placeholder="e.g. 4829" value={landForm.pattaNumber} onChange={(e) => setLandForm({ ...landForm, pattaNumber: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-xs" />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Survey No. *</label>
                          <input type="text" required placeholder="e.g. 142/B" value={landForm.surveyNumber} onChange={(e) => setLandForm({ ...landForm, surveyNumber: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-xs" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Land Extent (Acres) *</label>
                          <input type="text" required placeholder="e.g. 3.5 Acres" value={landForm.extent} onChange={(e) => setLandForm({ ...landForm, extent: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-xs" />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Land Type</label>
                          <select value={landForm.landType} onChange={(e) => setLandForm({ ...landForm, landType: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-xs bg-white">
                            <option value="Wet">Irrigated / Wet</option>
                            <option value="Dry">Dry / Rainfed</option>
                            <option value="Horticulture">Horticulture</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input type="checkbox" id="isTenant" checked={landForm.isTenant} onChange={(e) => setLandForm({ ...landForm, isTenant: e.target.checked })} className="w-4 h-4 text-[#00C853] rounded" />
                        <label htmlFor="isTenant" className="text-xs font-bold text-gray-700 cursor-pointer">I am a registered Cultivator / Tenant Farmer on this land</label>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <SecureFileUpload
                          documentType="PATTA"
                          category="VERIFICATION"
                          subCategory="LAND"
                          entityType="VERIFICATION"
                          label="Upload Patta / Land Record Document *"
                          description="Upload PDF, JPG, or PNG copy of 7/12, Patta, or Chitta (Max 5MB)"
                        />
                      </div>

                      <button type="submit" disabled={submitting} className="btn-agri-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}</button>
                    </form>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setCurrentStep(2)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <div className="flex items-center gap-2">
                      <button type="button" disabled={submitting} onClick={() => handleSkipCurrentStep('landRecord', 4)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">Skip for Now</button>
                      {verification?.landRecord?.status === 'verified' && (
                        <button type="button" onClick={() => setCurrentStep(4)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">Next Step <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FARMER STEP 4: BANK ACCOUNT */}
              {currentStep === 4 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><CreditCard className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">Step 4 of 6 · Required</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">Bank Account Verification</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">Link your active bank account for direct payments and sales settlements.</p>
                    </div>
                  </div>

                  {verification?.bankAccount?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ Bank Account Verified</span>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">STATUS: VERIFIED</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs font-sans pt-1">
                        <div><span className="text-gray-400 block font-bold">ACCOUNT HOLDER</span><strong className="text-[#082B36]">{verification.bankAccount.accountHolderName}</strong></div>
                        <div><span className="text-gray-400 block font-bold">BANK NAME</span><strong className="text-[#082B36]">{verification.bankAccount.bankName}</strong></div>
                        <div><span className="text-gray-400 block font-bold">ACCOUNT NO.</span><strong className="text-[#082B36] font-mono">{verification.bankAccount.accountNumberMasked}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyBankAccount} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Account Holder Name *</label>
                        <input type="text" required placeholder="As per bank passbook" value={bankForm.accountHolderName} onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Bank Name *</label>
                          <select value={bankForm.bankName} onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm bg-white">{MAJOR_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}</select>
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Branch Name</label>
                          <input type="text" placeholder="e.g. Main Branch" value={bankForm.branchName} onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Account Number *</label>
                          <input type="password" required placeholder="Enter account number" value={bankForm.accountNumber} onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Confirm Account Number *</label>
                          <input type="text" required placeholder="Re-enter account number" value={bankForm.confirmAccountNumber} onChange={(e) => setBankForm({ ...bankForm, confirmAccountNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">IFSC Code *</label>
                        <input type="text" required maxLength={11} placeholder="e.g. SBIN0001234" value={bankForm.ifsc} onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono uppercase" />
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <SecureFileUpload
                          documentType="BANK_PROOF"
                          category="VERIFICATION"
                          subCategory="BANK"
                          entityType="VERIFICATION"
                          label="Upload Bank Passbook / Cancelled Cheque *"
                          description="Upload front page of passbook or cancelled cheque (Max 5MB)"
                        />
                      </div>

                      <button type="submit" disabled={submitting} className="btn-agri-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}</button>
                    </form>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setCurrentStep(3)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <div className="flex items-center gap-2">
                      <button type="button" disabled={submitting} onClick={() => handleSkipCurrentStep('bankAccount', 5)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">Skip for Now</button>
                      {verification?.bankAccount?.status === 'verified' && (
                        <button type="button" onClick={() => setCurrentStep(5)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">Next Step <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FARMER STEP 5: PAN */}
              {currentStep === 5 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><FileCheck2 className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">Step 5 of 6 · Required</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">PAN Verification</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">Verify your Permanent Account Number for compliance and payouts.</p>
                    </div>
                  </div>

                  {verification?.pan?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ PAN Verified</span>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">STATUS: VERIFIED</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans pt-1">
                        <div><span className="text-gray-400 block font-bold">PAN NUMBER</span><strong className="text-[#082B36] font-mono">{verification.pan.panMasked}</strong></div>
                        <div><span className="text-gray-400 block font-bold">MATCH STATUS</span><strong className="text-[#00C853]">Confirmed Match ✓</strong></div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyPan} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">PAN Number *</label>
                        <input type="text" required maxLength={10} placeholder="e.g. ABCDE1234F" value={panForm.panNumber} onChange={(e) => setPanForm({ ...panForm, panNumber: e.target.value.toUpperCase() })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] font-mono uppercase text-base tracking-wider" />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Name as per PAN (Optional)</label>
                        <input type="text" placeholder="Full name as printed on PAN card" value={panForm.nameAsPerPan} onChange={(e) => setPanForm({ ...panForm, nameAsPerPan: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm" />
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <SecureFileUpload
                          documentType="PAN_DOC"
                          category="VERIFICATION"
                          subCategory="PAN"
                          entityType="VERIFICATION"
                          label="Upload PAN Card Copy *"
                          description="Clear front scan or photo of your PAN card (Max 5MB)"
                        />
                      </div>

                      <button type="submit" disabled={submitting} className="btn-agri-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}</button>
                    </form>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setCurrentStep(4)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <div className="flex items-center gap-2">
                      <button type="button" disabled={submitting} onClick={() => handleSkipCurrentStep('pan', 6)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">Skip for Now</button>
                      {verification?.pan?.status === 'verified' && (
                        <button type="button" onClick={() => setCurrentStep(6)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">Next Step <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FARMER STEP 6: PM-KISAN (OPTIONAL) */}
              {currentStep === 6 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><Award className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100 px-2.5 py-0.5 rounded-md">Step 6 of 6 · Optional</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">PM-KISAN Verification</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">Optionally link PM-KISAN Beneficiary Reference. PM-KISAN can be verified OR skipped.</p>
                    </div>
                  </div>

                  {verification?.pmKisan?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-2">
                      <div className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ PM-KISAN Record Verified</div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">PM-KISAN Registration / Beneficiary Reference</label>
                        <input type="text" placeholder="e.g. PMK-987654321" value={pmKisanForm.pmKisanRef} onChange={(e) => setPmKisanForm({ ...pmKisanForm, pmKisanRef: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="button" disabled={submitting} onClick={() => handleVerifyPmKisan('skip')} className="px-5 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">Skip PM-KISAN</button>
                        <button type="button" disabled={submitting} onClick={() => handleVerifyPmKisan('verify')} className="btn-agri-primary flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify PM-KISAN & Complete'}</button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setCurrentStep(5)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <button type="button" onClick={() => setCurrentStep(7)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">View Summary <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
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
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><Building className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">Step 1 of 6 · Required</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">Verify Your Organization</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">Verify official FPO / FPC / Cooperative registration details.</p>
                    </div>
                  </div>

                  {verification?.orgIdentity?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ Organization Verified</span>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">STATUS: VERIFIED</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans pt-1">
                        <div><span className="text-gray-400 block font-bold">LEGAL NAME</span><strong className="text-[#082B36]">{verification.orgIdentity.orgName}</strong></div>
                        <div><span className="text-gray-400 block font-bold">REGISTRATION NO.</span><strong className="text-[#082B36] font-mono">{verification.orgIdentity.registrationNumber}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyOrgIdentity} className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Legal Organization Name *</label>
                        <input type="text" required placeholder="e.g. Krishna Farmers Producer Co. Ltd." value={orgForm.orgName} onChange={(e) => setOrgForm({ ...orgForm, orgName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Organization Type</label>
                          <select value={orgForm.orgType} onChange={(e) => setOrgForm({ ...orgForm, orgType: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm bg-white">
                            <option value="FPO / FPC">Farmer Producer Company (FPC)</option>
                            <option value="Cooperative">Farmer Cooperative Society</option>
                            <option value="FPG">Farmer Producer Group (FPG)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Registration / CIN Number *</label>
                          <input type="text" required placeholder="e.g. U01409MH2021PTC123456" value={orgForm.registrationNumber} onChange={(e) => setOrgForm({ ...orgForm, registrationNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">State *</label>
                          <select value={orgForm.state} onChange={(e) => setOrgForm({ ...orgForm, state: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm bg-white">{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">District *</label>
                          <input type="text" required placeholder="e.g. Nashik" value={orgForm.district} onChange={(e) => setOrgForm({ ...orgForm, district: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm" />
                        </div>
                      </div>

                      <button type="submit" disabled={submitting} className="btn-agri-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 mt-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Organization'}</button>
                    </form>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={handleSaveAndExit} className="text-xs font-extrabold text-gray-500 hover:text-gray-800 flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save & Exit</button>
                    <div className="flex items-center gap-2">
                      <button type="button" disabled={submitting} onClick={() => handleSkipCurrentStep('orgIdentity', 2)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">Skip for Now</button>
                      {verification?.orgIdentity?.status === 'verified' && (
                        <button type="button" onClick={() => setCurrentStep(2)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">Next Step <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FPO STEP 2: ORGANIZATION PAN */}
              {currentStep === 2 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><FileCheck2 className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">Step 2 of 6 · Required</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">Verify Organization PAN</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">Verify Permanent Account Number issued in the legal name of the organization.</p>
                    </div>
                  </div>

                  {verification?.orgPan?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ Organization PAN Verified</span>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">STATUS: VERIFIED</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans pt-1">
                        <div><span className="text-gray-400 block font-bold">PAN NUMBER</span><strong className="text-[#082B36] font-mono">{verification.orgPan.panMasked}</strong></div>
                        <div><span className="text-gray-400 block font-bold">NAME MATCH</span><strong className="text-[#00C853]">✓ Confirmed Match</strong></div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyOrgPan} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Organization PAN Number *</label>
                        <input type="text" required maxLength={10} placeholder="e.g. ABCDE1234F" value={orgPanForm.panNumber} onChange={(e) => setOrgPanForm({ ...orgPanForm, panNumber: e.target.value.toUpperCase() })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] font-mono uppercase text-base tracking-wider" />
                      </div>
                      <button type="submit" disabled={submitting} className="btn-agri-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify PAN & Continue'}</button>
                    </form>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setCurrentStep(1)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <div className="flex items-center gap-2">
                      <button type="button" disabled={submitting} onClick={() => handleSkipCurrentStep('orgPan', 3)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">Skip for Now</button>
                      {verification?.orgPan?.status === 'verified' && (
                        <button type="button" onClick={() => setCurrentStep(3)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">Next Step <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FPO STEP 3: GSTIN (OPTIONAL / CONDITIONAL) */}
              {currentStep === 3 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><FileText className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100 px-2.5 py-0.5 rounded-md">Step 3 of 6 · Optional / Conditional</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">Verify Business Details (GSTIN)</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">GSTIN registration if applicable to your FPO entity.</p>
                    </div>
                  </div>

                  {verification?.gstin?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-2">
                      <div className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ GSTIN Verified ({verification.gstin.gstinNumber})</div>
                    </div>
                  ) : verification?.gstin?.status === 'not_applicable' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> GSTIN Not Applicable</p>
                      <p className="text-blue-800">GSTIN requirement marked as not applicable for this organization.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">GSTIN Number (15 Characters)</label>
                        <input type="text" maxLength={15} placeholder="e.g. 27ABCDE1234F1Z5" value={gstinForm.gstinNumber} onChange={(e) => setGstinForm({ ...gstinForm, gstinNumber: e.target.value.toUpperCase() })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] font-mono text-sm uppercase" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="button" disabled={submitting} onClick={() => handleVerifyGstin('not_applicable')} className="px-5 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">GSTIN Not Applicable</button>
                        <button type="button" disabled={submitting} onClick={() => handleVerifyGstin('verify')} className="btn-agri-primary flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify GSTIN'}</button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setCurrentStep(2)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <button type="button" onClick={() => setCurrentStep(4)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">Next Step <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                  </div>
                </div>
              )}

              {/* FPO STEP 4: AUTHORIZED REPRESENTATIVE */}
              {currentStep === 4 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><UserCheck className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">Step 4 of 6 · Required</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">Verify Authorized Representative</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">Verify identity & designation of the official managing the account.</p>
                    </div>
                  </div>

                  {verification?.representative?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ Representative Verified</span>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">STATUS: VERIFIED</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-sans pt-1">
                        <div><span className="text-gray-400 block font-bold">REPRESENTATIVE NAME</span><strong className="text-[#082B36]">{verification.representative.repName}</strong></div>
                        <div><span className="text-gray-400 block font-bold">DESIGNATION</span><strong className="text-[#082B36]">{verification.representative.designation}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={repForm.otpSent ? handleVerifyRepOtp : handleSendRepOtp} className="space-y-4 max-w-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Representative Name *</label>
                          <input type="text" required placeholder="Full name" value={repForm.repName} onChange={(e) => setRepForm({ ...repForm, repName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Designation *</label>
                          <select value={repForm.designation} onChange={(e) => setRepForm({ ...repForm, designation: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm bg-white">
                            <option value="Director">Director</option>
                            <option value="CEO">CEO</option>
                            <option value="Secretary">Secretary</option>
                            <option value="Authorized Representative">Authorized Representative</option>
                            <option value="Manager">Manager</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Mobile Number *</label>
                        <input type="tel" maxLength={10} disabled={repForm.otpSent} placeholder="10-digit mobile number" value={repForm.mobileNumber} onChange={(e) => setRepForm({ ...repForm, mobileNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono disabled:bg-gray-100" />
                      </div>

                      {!repForm.otpSent ? (
                        <button type="submit" disabled={submitting} className="btn-agri-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Representative OTP'}</button>
                      ) : (
                        <div className="space-y-3 pt-1">
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">✓ OTP sent to mobile <span className="font-mono font-bold">{repForm.mobileNumber}</span></div>
                          <div>
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Enter 6-Digit OTP *</label>
                            <input type="text" maxLength={6} placeholder="──────" value={repForm.otp} onChange={(e) => setRepForm({ ...repForm, otp: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] font-mono text-center text-lg tracking-[0.4em]" />
                          </div>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => setRepForm((p) => ({ ...p, otpSent: false }))} className="px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50">Change Mobile</button>
                            <button type="submit" disabled={submitting} className="btn-agri-primary flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Representative & Continue'}</button>
                          </div>
                        </div>
                      )}
                    </form>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setCurrentStep(3)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <div className="flex items-center gap-2">
                      <button type="button" disabled={submitting} onClick={() => handleSkipCurrentStep('representative', 5)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">Skip for Now</button>
                      {verification?.representative?.status === 'verified' && (
                        <button type="button" onClick={() => setCurrentStep(5)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">Next Step <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FPO STEP 5: ORGANIZATION BANK */}
              {currentStep === 5 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><CreditCard className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">Step 5 of 6 · Required</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">Verify Organization Bank Account</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">Bank account belonging to the organization for settlement payouts.</p>
                    </div>
                  </div>

                  {verification?.orgBank?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ Organization Bank Verified</span>
                        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">STATUS: VERIFIED</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs font-sans pt-1">
                        <div><span className="text-gray-400 block font-bold">ACCOUNT HOLDER</span><strong className="text-[#082B36]">{verification.orgBank.accountHolderName}</strong></div>
                        <div><span className="text-gray-400 block font-bold">BANK NAME</span><strong className="text-[#082B36]">{verification.orgBank.bankName}</strong></div>
                        <div><span className="text-gray-400 block font-bold">ACCOUNT NO.</span><strong className="text-[#082B36] font-mono">{verification.orgBank.accountNumberMasked}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyOrgBank} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Organization Account Holder Name *</label>
                        <input type="text" required placeholder="Legal org name as per passbook" value={orgBankForm.accountHolderName} onChange={(e) => setOrgBankForm({ ...orgBankForm, accountHolderName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Bank Name *</label>
                          <select value={orgBankForm.bankName} onChange={(e) => setOrgBankForm({ ...orgBankForm, bankName: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm bg-white">{MAJOR_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}</select>
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Branch Name</label>
                          <input type="text" placeholder="Branch name" value={orgBankForm.branchName} onChange={(e) => setOrgBankForm({ ...orgBankForm, branchName: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Account Number *</label>
                          <input type="password" required placeholder="Account number" value={orgBankForm.accountNumber} onChange={(e) => setOrgBankForm({ ...orgBankForm, accountNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Confirm Account Number *</label>
                          <input type="text" required placeholder="Re-enter account number" value={orgBankForm.confirmAccountNumber} onChange={(e) => setOrgBankForm({ ...orgBankForm, confirmAccountNumber: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">IFSC Code *</label>
                        <input type="text" required maxLength={11} placeholder="e.g. SBIN0001234" value={orgBankForm.ifsc} onChange={(e) => setOrgBankForm({ ...orgBankForm, ifsc: e.target.value.toUpperCase() })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono uppercase" />
                      </div>
                      <button type="submit" disabled={submitting} className="btn-agri-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}</button>
                    </form>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setCurrentStep(4)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <div className="flex items-center gap-2">
                      <button type="button" disabled={submitting} onClick={() => handleSkipCurrentStep('orgBank', 6)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">Skip for Now</button>
                      {verification?.orgBank?.status === 'verified' && (
                        <button type="button" onClick={() => setCurrentStep(6)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">Next Step <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FPO STEP 6: SUPPORTING DOCUMENTS */}
              {currentStep === 6 && (
                <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0"><FolderCheck className="w-6 h-6" /></div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">Step 6 of 6 · Required</span>
                      <h2 className="text-xl font-black text-[#082B36] font-display mt-1">Organization Documents</h2>
                      <p className="text-xs text-[#52636A] mt-1 font-sans">Upload applicable organization certificates for verification.</p>
                    </div>
                  </div>

                  {verification?.orgDocuments?.status === 'verified' ? (
                    <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-2">
                      <div className="flex items-center gap-2 text-[#00C853] font-bold text-base"><CheckCircle2 className="w-5 h-5" /> ✓ Organization Documents Verified</div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyOrgDocuments} className="space-y-6 max-w-[#600px]">
                      <SecureFileUpload
                        documentType="REGISTRATION_CERT"
                        category="VERIFICATION"
                        subCategory="REGISTRATION"
                        entityType="VERIFICATION"
                        label="1. Organization Registration Certificate *"
                        onUploadSuccess={() => setDocsForm((prev) => ({ ...prev, regCert: true }))}
                      />

                      <SecureFileUpload
                        documentType="PAN_DOC"
                        category="VERIFICATION"
                        subCategory="PAN"
                        entityType="VERIFICATION"
                        label="2. Organization PAN Card Copy *"
                        onUploadSuccess={() => setDocsForm((prev) => ({ ...prev, panDoc: true }))}
                      />

                      <SecureFileUpload
                        documentType="BANK_PROOF"
                        category="VERIFICATION"
                        subCategory="BANK"
                        entityType="VERIFICATION"
                        label="3. Bank Passbook / Cancelled Cheque *"
                        onUploadSuccess={() => setDocsForm((prev) => ({ ...prev, bankProof: true }))}
                      />

                      <SecureFileUpload
                        documentType="AUTHORIZATION_LETTER"
                        category="VERIFICATION"
                        subCategory="AUTHORIZATION"
                        entityType="VERIFICATION"
                        label="4. Authorization Letter / Board Resolution"
                        onUploadSuccess={() => setDocsForm((prev) => ({ ...prev, authDoc: true }))}
                      />

                      <SecureFileUpload
                        documentType="GST_CERT"
                        category="VERIFICATION"
                        subCategory="GST"
                        entityType="VERIFICATION"
                        label="5. GST Certificate (If Applicable)"
                        onUploadSuccess={() => setDocsForm((prev) => ({ ...prev, gstCert: true }))}
                      />

                      <button type="submit" disabled={submitting} className="btn-agri-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 mt-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Documents for Verification'}</button>
                    </form>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setCurrentStep(5)} className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <button type="button" onClick={() => setCurrentStep(7)} className="px-5 py-2.5 rounded-xl bg-[#082B36] text-white text-xs font-bold hover:bg-[#003947] flex items-center gap-1.5">View Summary <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" /></button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* =========================================================
              STEP 7: COMMON FINAL SUMMARY & BADGE DISPLAY
          ========================================================= */}
          {currentStep === 7 && (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-lg space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#082B36] font-display">
                  {config.portalTitle} Summary
                </h2>
                <p className="text-xs text-[#52636A] font-sans mt-1">
                  Review the current verification status for your {config.pageTitle}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {stepsList.map((st) => {
                  const status = verification?.[st.key]?.status || 'pending';
                  const isVerified = status === 'verified';
                  const isSkipped = status === 'skipped';
                  const isNotApp = status === 'not_applicable';

                  return (
                    <div key={st.key} className="p-4 rounded-2xl bg-[#FBFCF9] border border-[#E2E8E5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-gray-400">
                          {st.req ? 'Required Check' : 'Optional Check'}
                        </span>
                        <p className="text-xs font-bold text-[#082B36] mt-0.5">{st.name}</p>
                      </div>
                      {isVerified ? (
                        <span className="text-xs font-black text-[#00C853] bg-emerald-100 px-3 py-1 rounded-full">✓ Verified</span>
                      ) : isNotApp ? (
                        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">N/A</span>
                      ) : isSkipped ? (
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">○ Skipped</span>
                      ) : (
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">○ Pending</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* FINAL BADGE DISPLAY */}
              {isFullyVerified ? (
                <div className="bg-gradient-to-r from-[#002B36] to-[#004D5A] text-white p-6 sm:p-8 rounded-3xl text-center space-y-2 shadow-xl">
                  <div className="w-14 h-14 bg-[#00E676] text-[#002B36] rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#00E676] font-display">
                    {config.badgeText}
                  </h3>
                  <p className="text-xs text-gray-200 max-w-md mx-auto font-sans">
                    All required verification checks have been completed successfully! Your account now displays the official badge.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 p-5 rounded-3xl text-center space-y-2">
                  <AlertCircle className="w-7 h-7 text-amber-600 mx-auto" />
                  <h3 className="text-base font-black font-display">{config.incompleteBadgeText}</h3>
                  <p className="text-xs font-medium text-amber-800">
                    You can return anytime from the Farmer Dashboard to complete skipped or pending checks and unlock your badge.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate('/farmer/dashboard')}
                className="btn-agri-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
