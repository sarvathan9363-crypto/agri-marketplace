import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Building2,
  FileCheck2,
  Landmark,
  CreditCard,
  Award,
  Sparkles,
  ChevronRight,
  Loader2,
  UserCheck,
} from 'lucide-react';
import farmerService from '../../services/farmerService';

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

export default function FarmerVerification() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Backend verification object
  const [verification, setVerification] = useState({
    aadhaar: { status: 'pending' },
    farmerRegistry: { status: 'pending' },
    landRecord: { status: 'pending' },
    bankAccount: { status: 'pending' },
    pan: { status: 'pending' },
    pmKisan: { status: 'pending' },
    overallStatus: 'incomplete',
  });

  // Step 1: Aadhaar Form
  const [aadhaarForm, setAadhaarForm] = useState({ aadhaarNumber: '', otp: '', otpSent: false, referenceId: '' });

  // Step 2: Farmer Registry Form
  const [farmerRegForm, setFarmerRegForm] = useState({ farmerId: '', state: 'Maharashtra', district: '' });

  // Step 3: Land Record Form
  const [landForm, setLandForm] = useState({
    state: 'Maharashtra',
    district: '',
    taluk: '',
    village: '',
    pattaNumber: '',
    surveyNumber: '',
    subdivisionNumber: '',
    landType: 'Dry',
    extent: '',
    isTenant: false,
  });

  // Step 4: Bank Form
  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    bankName: 'State Bank of India (SBI)',
    branchName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
  });

  // Step 5: PAN Form
  const [panForm, setPanForm] = useState({ panNumber: '', nameAsPerPan: '' });

  // Step 6: PM-KISAN Form
  const [pmKisanForm, setPmKisanForm] = useState({ pmKisanRef: '' });

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const res = await farmerService.getVerification();
      if (res.verification) {
        setVerification(res.verification);

        // Auto determine initial step
        const v = res.verification;
        if (v.aadhaar?.status !== 'verified') setCurrentStep(1);
        else if (v.farmerRegistry?.status !== 'verified') setCurrentStep(2);
        else if (v.landRecord?.status !== 'verified') setCurrentStep(3);
        else if (v.bankAccount?.status !== 'verified') setCurrentStep(4);
        else if (v.pan?.status !== 'verified') setCurrentStep(5);
        else if (v.pmKisan?.status === 'pending') setCurrentStep(6);
        else setCurrentStep(7);
      }
    } catch {
      toast.error('Failed to load verification status.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  // Step 1: Aadhaar
  const handleSendAadhaarOtp = async (e) => {
    e.preventDefault();
    const clean = aadhaarForm.aadhaarNumber.replace(/\D/g, '');
    if (clean.length !== 12) {
      toast.error('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.sendAadhaarOtp(clean);
      setAadhaarForm((prev) => ({ ...prev, otpSent: true, referenceId: res.referenceId }));
      toast.success('OTP sent to your Aadhaar-registered mobile number!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyAadhaarOtp = async (e) => {
    e.preventDefault();
    if (!aadhaarForm.otp || aadhaarForm.otp.trim().length !== 6) {
      toast.error('Please enter the 6-digit OTP code.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyAadhaarOtp(aadhaarForm.referenceId, aadhaarForm.otp);
      setVerification(res.verification);
      toast.success('✓ Identity Verified successfully!');
      setCurrentStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Check OTP and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Farmer Registry
  const handleVerifyFarmerReg = async (e) => {
    e.preventDefault();
    if (!farmerRegForm.farmerId || !farmerRegForm.district) {
      toast.error('Please enter Farmer ID and District.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyFarmerRegistry(farmerRegForm);
      setVerification(res.verification);
      toast.success('✓ Farmer Registry verified!');
      setCurrentStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Farmer ID verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Land Record
  const handleVerifyLandRecord = async (e) => {
    e.preventDefault();
    if (!landForm.district || !landForm.taluk || !landForm.village || !landForm.pattaNumber || !landForm.surveyNumber || !landForm.extent) {
      toast.error('Please fill all required land record fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyLandRecord(landForm);
      setVerification(res.verification);
      toast.success('✓ Farm details verified!');
      setCurrentStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Land Record verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 4: Bank Account
  const handleVerifyBankAccount = async (e) => {
    e.preventDefault();
    if (!bankForm.accountHolderName || !bankForm.accountNumber || !bankForm.ifsc) {
      toast.error('Please enter Account Holder Name, Account Number and IFSC.');
      return;
    }
    if (bankForm.accountNumber !== bankForm.confirmAccountNumber) {
      toast.error('Account numbers do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyBankAccount(bankForm);
      setVerification(res.verification);
      toast.success('✓ Bank Account verified!');
      setCurrentStep(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bank Account verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 5: PAN
  const handleVerifyPan = async (e) => {
    e.preventDefault();
    if (!panForm.panNumber) {
      toast.error('Please enter your 10-character PAN number.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await farmerService.verifyPan(panForm);
      setVerification(res.verification);
      toast.success('✓ PAN verified!');
      setCurrentStep(6);
    } catch (err) {
      toast.error(err.response?.data?.message || 'PAN verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 6: PM-KISAN (Optional)
  const handleVerifyPmKisan = async (action) => {
    setSubmitting(true);
    try {
      const res = await farmerService.verifyPmKisan({ action, pmKisanRef: pmKisanForm.pmKisanRef });
      setVerification(res.verification);
      if (action === 'skip') {
        toast('PM-KISAN verification skipped.', { icon: 'ℹ️' });
      } else {
        toast.success('✓ PM-KISAN record verified!');
      }
      setCurrentStep(7);
    } catch (err) {
      toast.error(err.response?.data?.message || 'PM-KISAN verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Fully verified rule calculation
  const isRequiredFullyVerified =
    verification?.aadhaar?.status === 'verified' &&
    verification?.farmerRegistry?.status === 'verified' &&
    verification?.landRecord?.status === 'verified' &&
    verification?.bankAccount?.status === 'verified' &&
    verification?.pan?.status === 'verified';

  // -------------------------------------------------------------
  // STEPS DEFINITION FOR PROGRESS UI
  // -------------------------------------------------------------
  const wizardSteps = [
    { id: 1, key: 'aadhaar', label: 'Identity', req: true },
    { id: 2, key: 'farmerRegistry', label: 'Farmer ID', req: true },
    { id: 3, key: 'landRecord', label: 'Farm', req: true },
    { id: 4, key: 'bankAccount', label: 'Bank', req: true },
    { id: 5, key: 'pan', label: 'PAN', req: true },
    { id: 6, key: 'pmKisan', label: 'PM-KISAN', req: false },
    { id: 7, key: 'summary', label: 'Complete', req: false },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-[#00C853] animate-spin" />
        <p className="text-sm font-bold text-[#082B36] font-display">Loading verification workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E5] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#00E676]/15 text-[#00C853] border border-[#00E676]/30">
            <UserCheck className="w-4 h-4" /> AUTHORIZED PRODUCER VERIFICATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B36] font-display mt-2 tracking-tight">
            Farmer Identity & Credential Verification
          </h1>
          <p className="text-sm text-[#52636A] mt-1 font-sans max-w-xl">
            Complete the 5 required verification steps to earn your official <strong className="text-[#082B36]">✓ VERIFIED FARMER</strong> badge on AgriBazaar.
          </p>
        </div>

        {isRequiredFullyVerified && (
          <div className="flex items-center gap-2 bg-[#E8F5E9] border border-[#00E676] px-4 py-2.5 rounded-2xl shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#00C853]" />
            <div>
              <p className="text-xs font-black text-[#002B36] tracking-wide">✓ VERIFIED FARMER</p>
              <p className="text-[11px] text-emerald-700 font-medium">All required checks active</p>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          PROGRESS STEPPER UI (01..07)
      ========================================================= */}
      <div className="bg-white rounded-3xl border border-[#E2E8E5] p-4 sm:p-6 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] gap-2">
          {wizardSteps.map((s, idx) => {
            const isCurrent = currentStep === s.id;
            let status = 'pending';
            if (s.key === 'summary') {
              status = isRequiredFullyVerified ? 'verified' : 'pending';
            } else {
              status = verification?.[s.key]?.status || 'pending';
            }

            const isVerified = status === 'verified';
            const isSkipped = status === 'skipped';

            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep(s.id)}
                  className={`flex flex-col items-center text-center transition-all p-2 rounded-2xl w-full ${
                    isCurrent
                      ? 'bg-[#F7F9F3] border-2 border-[#00C853] shadow-sm scale-105'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-black uppercase ${isCurrent ? 'text-[#00C853]' : 'text-gray-400'}`}>
                      0{s.id}
                    </span>
                    {isVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
                    ) : isSkipped ? (
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-[9px] flex items-center justify-center font-bold text-gray-500">○</span>
                    ) : (
                      <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold ${isCurrent ? 'bg-[#00C853] text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {s.req ? 'R' : 'O'}
                      </span>
                    )}
                  </div>

                  <span className={`text-xs font-bold font-display mt-1 truncate ${isCurrent ? 'text-[#082B36]' : 'text-gray-500'}`}>
                    {s.label}
                  </span>

                  <span className="text-[10px] font-bold mt-0.5">
                    {isVerified ? (
                      <span className="text-[#00C853]">✓ Verified</span>
                    ) : isSkipped ? (
                      <span className="text-gray-400">○ Skipped</span>
                    ) : s.req ? (
                      <span className="text-amber-600">○ Required</span>
                    ) : (
                      <span className="text-blue-600">○ Optional</span>
                    )}
                  </span>
                </button>

                {idx < wizardSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          STEP WIZARD CARDS
      ========================================================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {/* STEP 1: AADHAAR VERIFICATION */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#082B36] font-display">Step 1: Verify Your Identity</h2>
                  <p className="text-sm text-[#52636A] mt-1 font-sans">
                    Verify your identity using an authorized Aadhaar verification process.
                  </p>
                </div>
              </div>

              {verification?.aadhaar?.status === 'verified' ? (
                <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#00C853] font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6" /> ✓ Aadhaar Verified
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Verified Name</p>
                      <p className="font-extrabold text-[#082B36]">{verification.aadhaar.verifiedName || 'Verified Producer'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Verification Status</p>
                      <p className="font-bold text-[#00C853]">Authorized & Active</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Verification Date</p>
                      <p className="font-bold text-[#082B36]">
                        {verification.aadhaar.verifiedAt ? new Date(verification.aadhaar.verifiedAt).toLocaleDateString() : 'Today'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    🔒 Aadhaar number and OTP are masked and secured according to UIDAI privacy regulations.
                  </p>
                </div>
              ) : (
                <form onSubmit={aadhaarForm.otpSent ? handleVerifyAadhaarOtp : handleSendAadhaarOtp} className="space-y-5 max-w-lg">
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
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] font-mono text-base tracking-widest disabled:bg-gray-100"
                    />
                  </div>

                  {!aadhaarForm.otpSent ? (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-agri-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                    </button>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                        ✓ OTP sent to mobile linked with Aadhaar reference <span className="font-mono font-bold">{aadhaarForm.referenceId}</span>
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1.5">
                          Enter 6-Digit OTP *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="──────"
                          value={aadhaarForm.otp}
                          onChange={(e) => setAadhaarForm({ ...aadhaarForm, otp: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] font-mono text-center text-xl tracking-[0.5em]"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setAadhaarForm((p) => ({ ...p, otpSent: false }))}
                          className="px-4 py-3 border border-gray-300 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"
                        >
                          Change Number
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-agri-primary flex-1 py-3 text-base flex items-center justify-center gap-2"
                        >
                          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

          {/* STEP 2: FARMER REGISTRY */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#082B36] font-display">Step 2: Verify Farmer Registration</h2>
                  <p className="text-sm text-[#52636A] mt-1 font-sans">
                    Confirm that you are registered in the applicable Farmer Registry.
                  </p>
                </div>
              </div>

              {verification?.farmerRegistry?.status === 'verified' ? (
                <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#00C853] font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6" /> ✓ Farmer Registry Verified
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 text-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Farmer ID</p>
                      <p className="font-extrabold text-[#082B36] font-mono">{verification.farmerRegistry.farmerIdMasked}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">State</p>
                      <p className="font-bold text-[#082B36]">{verification.farmerRegistry.state}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">District</p>
                      <p className="font-bold text-[#082B36]">{verification.farmerRegistry.district}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Registry Status</p>
                      <p className="font-bold text-[#00C853]">Active Record ✓</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerifyFarmerReg} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">
                      Farmer ID / Agristack ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MH-FARM-2024-8849"
                      value={farmerRegForm.farmerId}
                      onChange={(e) => setFarmerRegForm({ ...farmerRegForm, farmerId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">State *</label>
                      <select
                        value={farmerRegForm.state}
                        onChange={(e) => setFarmerRegForm({ ...farmerRegForm, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm bg-white"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">District *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nashik"
                        value={farmerRegForm.district}
                        onChange={(e) => setFarmerRegForm({ ...farmerRegForm, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-agri-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Farmer ID'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 3: LAND RECORD / PATTA */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#082B36] font-display">Step 3: Verify Your Farm</h2>
                  <p className="text-sm text-[#52636A] mt-1 font-sans">
                    Confirm your agricultural land or cultivation details.
                  </p>
                </div>
              </div>

              {verification?.landRecord?.status === 'verified' ? (
                <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#00C853] font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6" /> ✓ Farm Details Verified
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Patta / 7/12 No.</p>
                      <p className="font-extrabold text-[#082B36] font-mono">{verification.landRecord.pattaNumberMasked}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Survey No.</p>
                      <p className="font-bold text-[#082B36]">{verification.landRecord.surveyNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Land Extent</p>
                      <p className="font-bold text-[#082B36]">{verification.landRecord.extent}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Record Match</p>
                      <p className="font-bold text-[#00C853]">Verified Match ✓</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerifyLandRecord} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">State *</label>
                      <select
                        value={landForm.state}
                        onChange={(e) => setLandForm({ ...landForm, state: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm bg-white"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">District *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nashik"
                        value={landForm.district}
                        onChange={(e) => setLandForm({ ...landForm, district: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Taluk *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Niphad"
                        value={landForm.taluk}
                        onChange={(e) => setLandForm({ ...landForm, taluk: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Village *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lasalgaon"
                        value={landForm.village}
                        onChange={(e) => setLandForm({ ...landForm, village: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Patta / Khata No. *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 4829"
                        value={landForm.pattaNumber}
                        onChange={(e) => setLandForm({ ...landForm, pattaNumber: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Survey No. *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 142/B"
                        value={landForm.surveyNumber}
                        onChange={(e) => setLandForm({ ...landForm, surveyNumber: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Subdivision No.</label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={landForm.subdivisionNumber}
                        onChange={(e) => setLandForm({ ...landForm, subdivisionNumber: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Land Type *</label>
                      <select
                        value={landForm.landType}
                        onChange={(e) => setLandForm({ ...landForm, landType: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm bg-white"
                      >
                        <option value="Wet">Irrigated / Wet</option>
                        <option value="Dry">Dry / Rainfed</option>
                        <option value="Horticulture">Horticulture / Plantation</option>
                        <option value="Other">Other Cultivation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Land Extent (Acres) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 3.5 Acres"
                        value={landForm.extent}
                        onChange={(e) => setLandForm({ ...landForm, extent: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isTenant"
                      checked={landForm.isTenant}
                      onChange={(e) => setLandForm({ ...landForm, isTenant: e.target.checked })}
                      className="w-4 h-4 text-[#00C853] rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <label htmlFor="isTenant" className="text-xs font-bold text-gray-700 cursor-pointer">
                      I am a registered Cultivator / Tenant Farmer on this land
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-agri-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Land Record'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 4: BANK ACCOUNT */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#082B36] font-display">Step 4: Verify Your Bank Account</h2>
                  <p className="text-sm text-[#52636A] mt-1 font-sans">
                    Your bank account is required for marketplace settlements and direct payment payouts.
                  </p>
                </div>
              </div>

              {verification?.bankAccount?.status === 'verified' ? (
                <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#00C853] font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6" /> ✓ Bank Account Verified
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 text-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Account Holder</p>
                      <p className="font-extrabold text-[#082B36]">{verification.bankAccount.accountHolderName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Bank & Branch</p>
                      <p className="font-bold text-[#082B36]">{verification.bankAccount.bankName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Account Number</p>
                      <p className="font-bold text-[#082B36] font-mono">{verification.bankAccount.accountNumberMasked}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Name Match</p>
                      <p className="font-bold text-[#00C853]">✓ Match Confirmed</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerifyBankAccount} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="As per bank passbook"
                      value={bankForm.accountHolderName}
                      onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Bank Name *</label>
                      <select
                        value={bankForm.bankName}
                        onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm bg-white"
                      >
                        {MAJOR_BANKS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Branch Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Main Branch"
                        value={bankForm.branchName}
                        onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Account Number *</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter account number"
                        value={bankForm.accountNumber}
                        onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">Confirm Account Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="Re-enter account number"
                        value={bankForm.confirmAccountNumber}
                        onChange={(e) => setBankForm({ ...bankForm, confirmAccountNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">IFSC Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      placeholder="e.g. SBIN0001234"
                      value={bankForm.ifsc}
                      onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-agri-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Bank Account'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 5: PAN */}
          {currentStep === 5 && (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#082B36] font-display">Step 5: Verify PAN</h2>
                  <p className="text-sm text-[#52636A] mt-1 font-sans">
                    Verify your PAN for identity and applicable financial/compliance requirements.
                  </p>
                </div>
              </div>

              {verification?.pan?.status === 'verified' ? (
                <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#00C853] font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6" /> ✓ PAN Verified
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">PAN Number</p>
                      <p className="font-extrabold text-[#082B36] font-mono">{verification.pan.panMasked}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Name Match</p>
                      <p className="font-bold text-[#00C853]">✓ Match Confirmed</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Verification Status</p>
                      <p className="font-bold text-[#00C853]">Valid Tax ID ✓</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerifyPan} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">
                      PAN Number *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="e.g. ABCDE1234F"
                      value={panForm.panNumber}
                      onChange={(e) => setPanForm({ ...panForm, panNumber: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] font-mono uppercase text-base tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">
                      Name as per PAN (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Full name as printed on PAN card"
                      value={panForm.nameAsPerPan}
                      onChange={(e) => setPanForm({ ...panForm, nameAsPerPan: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-agri-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify PAN'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 6: PM-KISAN (OPTIONAL) */}
          {currentStep === 6 && (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-md">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#00C853] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-[#082B36] font-display">Step 6: Additional Farmer Verification</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Optional</span>
                  </div>
                  <p className="text-sm text-[#52636A] mt-1 font-sans">
                    Optionally verify your PM-KISAN record for an additional verification signal.
                  </p>
                </div>
              </div>

              {verification?.pmKisan?.status === 'verified' ? (
                <div className="bg-[#FBFCF9] border-2 border-[#00E676] rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#00C853] font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6" /> ✓ PM-KISAN Record Verified
                  </div>
                  <p className="text-xs text-gray-500">Beneficiary reference matched with PM-KISAN central database.</p>
                </div>
              ) : verification?.pmKisan?.status === 'skipped' ? (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 font-bold text-base">
                    <AlertCircle className="w-5 h-5 text-gray-400" /> ○ PM-KISAN Not Verified
                  </div>
                  <p className="text-xs text-gray-500">Optional verification skipped. You can still become a Verified Farmer.</p>
                  <button
                    type="button"
                    onClick={() => setVerification((p) => ({ ...p, pmKisan: { status: 'pending' } }))}
                    className="text-xs font-bold text-[#00C853] hover:underline pt-2 block"
                  >
                    Click here to verify PM-KISAN now
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#082B36] mb-1">
                      PM-KISAN Registration / Beneficiary Reference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PMK-987654321"
                      value={pmKisanForm.pmKisanRef}
                      onChange={(e) => setPmKisanForm({ ...pmKisanForm, pmKisanRef: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#00C853] text-sm font-mono"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleVerifyPmKisan('skip')}
                      className="px-6 py-3.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-600 hover:bg-gray-50"
                    >
                      Skip for now
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleVerifyPmKisan('verify')}
                      className="btn-agri-primary flex-1 py-3.5 text-base flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify PM-KISAN'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: VERIFICATION SUMMARY */}
          {currentStep === 7 && (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-lg space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#082B36] font-display">Verification Summary</h2>
                <p className="text-sm text-[#52636A] font-sans mt-1">
                  Review your completed agricultural identity checks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FBFCF9] border border-[#E2E8E5] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase text-gray-400">Identity</p>
                    <p className="text-sm font-bold text-[#082B36] mt-0.5">Aadhaar Identity</p>
                  </div>
                  {verification?.aadhaar?.status === 'verified' ? (
                    <span className="text-xs font-black text-[#00C853] bg-emerald-100 px-3 py-1 rounded-full">✓ Aadhaar Verified</span>
                  ) : (
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">○ Pending</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#FBFCF9] border border-[#E2E8E5] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase text-gray-400">Farmer Status</p>
                    <p className="text-sm font-bold text-[#082B36] mt-0.5">Farmer Registry</p>
                  </div>
                  {verification?.farmerRegistry?.status === 'verified' ? (
                    <span className="text-xs font-black text-[#00C853] bg-emerald-100 px-3 py-1 rounded-full">✓ Farmer Registry Verified</span>
                  ) : (
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">○ Pending</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#FBFCF9] border border-[#E2E8E5] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase text-gray-400">Farm</p>
                    <p className="text-sm font-bold text-[#082B36] mt-0.5">Land Record</p>
                  </div>
                  {verification?.landRecord?.status === 'verified' ? (
                    <span className="text-xs font-black text-[#00C853] bg-emerald-100 px-3 py-1 rounded-full">✓ Land Record Verified</span>
                  ) : (
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">○ Pending</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#FBFCF9] border border-[#E2E8E5] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase text-gray-400">Payments</p>
                    <p className="text-sm font-bold text-[#082B36] mt-0.5">Bank Account</p>
                  </div>
                  {verification?.bankAccount?.status === 'verified' ? (
                    <span className="text-xs font-black text-[#00C853] bg-emerald-100 px-3 py-1 rounded-full">✓ Bank Account Verified</span>
                  ) : (
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">○ Pending</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#FBFCF9] border border-[#E2E8E5] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase text-gray-400">Financial Identity</p>
                    <p className="text-sm font-bold text-[#082B36] mt-0.5">PAN Verification</p>
                  </div>
                  {verification?.pan?.status === 'verified' ? (
                    <span className="text-xs font-black text-[#00C853] bg-emerald-100 px-3 py-1 rounded-full">✓ PAN Verified</span>
                  ) : (
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">○ Pending</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#FBFCF9] border border-[#E2E8E5] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase text-gray-400">Additional Verification</p>
                    <p className="text-sm font-bold text-[#082B36] mt-0.5">PM-KISAN</p>
                  </div>
                  {verification?.pmKisan?.status === 'verified' ? (
                    <span className="text-xs font-black text-[#00C853] bg-emerald-100 px-3 py-1 rounded-full">✓ Verified</span>
                  ) : (
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">○ PM-KISAN Skipped</span>
                  )}
                </div>
              </div>

              {/* FINAL BADGE BOX */}
              {isRequiredFullyVerified ? (
                <div className="bg-gradient-to-r from-[#002B36] to-[#004D5A] text-white p-8 rounded-3xl text-center space-y-3 shadow-xl relative overflow-hidden">
                  <div className="w-16 h-16 bg-[#00E676] text-[#002B36] rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#00E676] font-display">
                    ✓ VERIFIED FARMER
                  </h3>
                  <p className="text-sm text-gray-200 max-w-md mx-auto font-sans">
                    Your required verification checks have been completed successfully. Your products can now be listed with full platform trust.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 p-6 rounded-3xl text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                  <h3 className="text-lg font-black font-display">Verification Incomplete</h3>
                  <p className="text-xs font-medium text-amber-800">
                    You must complete all 5 required verification sections to unlock your Verified Farmer badge.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate('/farmer/dashboard')}
                className="btn-agri-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2"
              >
                Continue to AgriBazaar <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* =========================================================
          NAVIGATION BUTTONS (Back / Continue)
      ========================================================= */}
      {currentStep < 7 && (
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-300 text-sm font-bold text-[#082B36] disabled:opacity-40 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep((p) => Math.min(7, p + 1))}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002B36] text-white text-sm font-bold hover:bg-[#003947]"
          >
            Continue <ArrowRight className="w-4 h-4 text-[#00E676]" />
          </button>
        </div>
      )}
    </div>
  );
}
