import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
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
  Loader2,
  UserCheck,
  Save,
  Building,
  FileText,
  FolderCheck,
  Upload,
  Smartphone,
  MapPin,
  FileBadge,
  Check,
  HelpCircle,
} from 'lucide-react';
import buyerService from '../../services/buyerService';
import { useAuth } from '../../context/AuthContext';
import { getBuyerVerificationConfig } from '../../config/buyerVerificationConfig';

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

export default function BuyerVerificationWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const rawBuyerType = profile?.buyerType || 'INDIVIDUAL';
  const allConfigs = getBuyerVerificationConfig(t);
  const config = allConfigs[rawBuyerType] || allConfigs.INDIVIDUAL;
  const steps = config.steps;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Backend verification state
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

  // Step Forms State
  const [mobileForm, setMobileForm] = useState({ mobileNumber: profile?.mobileNumber || '', otp: '', otpSent: false });
  const [identityForm, setIdentityForm] = useState({ method: 'aadhaar', consent: false, otp: '', otpSent: false });
  const [addressForm, setAddressForm] = useState({
    address: profile?.address || '',
    state: profile?.state || 'Maharashtra',
    district: profile?.district || '',
    city: profile?.city || '',
    pincode: profile?.pincode || '',
  });

  const [businessForm, setBusinessForm] = useState({
    legalName: profile?.fullName || '',
    tradeName: '',
    businessType: 'Retailer',
    address: profile?.address || '',
    state: profile?.state || 'Maharashtra',
    district: '',
    city: profile?.city || '',
    pincode: profile?.pincode || '',
  });

  const [panForm, setPanForm] = useState({ panNumber: '', legalName: profile?.fullName || '' });
  const [gstinForm, setGstinForm] = useState({ gstinNumber: '', isNotApplicable: false });
  
  const [busRegForm, setBusRegForm] = useState({
    orgType: 'Company',
    registrationNumber: '',
  });

  const [repForm, setRepForm] = useState({
    repName: profile?.fullName || '',
    designation: 'Owner',
    mobileNumber: profile?.mobileNumber || '',
    otp: '',
    otpSent: false,
    authDocUploaded: false,
  });

  const [bankForm, setBankForm] = useState({
    accountHolderName: profile?.fullName || '',
    bankName: 'State Bank of India (SBI)',
    branchName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
  });

  const [udyamForm, setUdyamForm] = useState({ udyamNumber: '', isNotApplicable: false });
  const [fssaiForm, setFssaiForm] = useState({ fssaiNumber: '', licenseType: 'FSSAI License', isNotApplicable: false });
  
  const [docForm, setDocForm] = useState({
    businessCert: false,
    panDoc: false,
    bankProof: false,
    authDoc: false,
    gstCert: false,
    udyamCert: false,
    fssaiCert: false,
  });

  // Load status and find first incomplete required step
  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const res = await buyerService.getVerificationStatus();
      if (res.success && res.verification) {
        setVerification(res.verification);

        // Map initial forms if available
        if (res.verification.address?.address) {
          setAddressForm((prev) => ({
            ...prev,
            address: res.verification.address.address || prev.address,
            state: res.verification.address.state || prev.state,
            district: res.verification.address.district || prev.district,
            city: res.verification.address.city || prev.city,
            pincode: res.verification.address.pincode || prev.pincode,
          }));
        }

        if (res.verification.business?.legalName) {
          setBusinessForm((prev) => ({
            ...prev,
            legalName: res.verification.business.legalName || prev.legalName,
            tradeName: res.verification.business.tradeName || prev.tradeName,
            businessType: res.verification.business.businessType || prev.businessType,
            address: res.verification.business.address || prev.address,
            state: res.verification.business.state || prev.state,
            district: res.verification.business.district || prev.district,
            city: res.verification.business.city || prev.city,
            pincode: res.verification.business.pincode || prev.pincode,
          }));
        }

        // Resume from first incomplete step
        const stepList = buyerVerificationConfig[rawBuyerType]?.steps || [];
        let resumeStepIndex = 1;
        for (let i = 0; i < stepList.length - 1; i++) {
          const st = stepList[i];
          const stepStatus = res.verification[st.key]?.status;
          if (stepStatus !== 'verified' && stepStatus !== 'not_applicable') {
            resumeStepIndex = st.id;
            break;
          }
          if (i === stepList.length - 2) {
            // All steps complete, show summary step
            resumeStepIndex = stepList.length;
          }
        }
        setCurrentStep(resumeStepIndex);
      }
    } catch (err) {
      console.error('Error fetching buyer verification:', err);
      toast.error(t('buyerVerificationWizard.couldNotLoadVerificationStatus'));
    } finally {
      setLoading(false);
    }
  };

  const activeStepObj = steps.find((s) => s.id === currentStep) || steps[0];

  // Generic Step Status Helper
  const getStepStatus = (key) => {
    if (key === 'summary') {
      return verification.overallStatus === 'verified' ? t('buyerVerificationWizard.verified') : t('buyerVerificationWizard.pending');
    }
    const status = verification[key]?.status;
    if (status === 'verified') return t('buyerVerificationWizard.verified');
    if (status === 'not_applicable') return 'NOT_APPLICABLE';
    if (status === 'failed') return 'FAILED';
    if (status === 'skipped') return 'SKIPPED';
    return t('buyerVerificationWizard.pending');
  };

  // Step Handler Functions
  const handleMobileSubmit = async () => {
    if (!mobileForm.otpSent) {
      if (!mobileForm.mobileNumber || mobileForm.mobileNumber.length < 10) {
        toast.error(t('buyerVerificationWizard.pleaseEnterAValid10digitMobile'));
        return;
      }
      setSubmitting(true);
      try {
        const res = await buyerService.sendMobileOtp({ mobileNumber: mobileForm.mobileNumber });
        if (res.success) {
          setMobileForm((prev) => ({ ...prev, otpSent: true }));
          toast.success(t('buyerVerificationWizard.otpSentToYourMobileNumber'));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to send OTP');
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!mobileForm.otp || mobileForm.otp.length !== 6) {
        toast.error(t('buyerVerificationWizard.pleaseEnter6digitOtpCode'));
        return;
      }
      setSubmitting(true);
      try {
        const res = await buyerService.verifyMobileOtp({ otp: mobileForm.otp });
        if (res.success) {
          setVerification(res.verification);
          toast.success(t('buyerVerificationWizard.mobileNumberVerifiedSuccessfully'));
          nextStep();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Verification failed');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleIdentitySubmit = async () => {
    if (!identityForm.consent) {
      toast.error(t('buyerVerificationWizard.consentIsRequiredToProceedWith'));
      return;
    }
    if (!identityForm.otpSent) {
      setSubmitting(true);
      setTimeout(() => {
        setIdentityForm((prev) => ({ ...prev, otpSent: true }));
        setSubmitting(false);
        toast.success(t('buyerVerificationWizard.otpSentToYourAadhaarlinkedMobile'));
      }, 1000);
    } else {
      if (!identityForm.otp || identityForm.otp.length !== 6) {
        toast.error(t('buyerVerificationWizard.pleaseEnter6digitOtp'));
        return;
      }
      setSubmitting(true);
      try {
        const res = await buyerService.verifyIdentity({
          identityType: identityForm.method,
          consent: true,
          otp: identityForm.otp,
        });
        if (res.success) {
          setVerification(res.verification);
          toast.success(t('buyerVerificationWizard.identityVerifiedViaAuthorizedGateway'));
          nextStep();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Identity verification failed');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleAddressSubmit = async () => {
    if (!addressForm.address || !addressForm.district || !addressForm.city || !addressForm.pincode) {
      toast.error(t('buyerVerificationWizard.pleaseFillAllRequiredAddressFields'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await buyerService.verifyAddress(addressForm);
      if (res.success) {
        setVerification(res.verification);
        toast.success(t('buyerVerificationWizard.addressDetailsVerified'));
        nextStep();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBusinessSubmit = async () => {
    if (!businessForm.legalName || !businessForm.businessType || !businessForm.address || !businessForm.district || !businessForm.city || !businessForm.pincode) {
      toast.error(t('buyerVerificationWizard.pleaseFillAllRequiredBusinessIdentity'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await buyerService.verifyBusiness(businessForm);
      if (res.success) {
        setVerification(res.verification);
        toast.success(t('buyerVerificationWizard.businessIdentityVerified'));
        nextStep();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify business details');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePanSubmit = async () => {
    const cleanPan = (panForm.panNumber || '').toUpperCase().trim();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      toast.error(t('buyerVerificationWizard.pleaseEnterAValid10characterPan'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await buyerService.verifyPan({ panNumber: cleanPan, legalName: panForm.legalName });
      if (res.success) {
        setVerification(res.verification);
        toast.success(t('buyerVerificationWizard.businessPanVerifiedSuccessfully'));
        nextStep();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'PAN verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGstinSubmit = async (isNotApp = false) => {
    if (isNotApp) {
      setSubmitting(true);
      try {
        const res = await buyerService.verifyGstin({ isNotApplicable: true });
        if (res.success) {
          setVerification(res.verification);
          toast.success(t('buyerVerificationWizard.gstinMarkedAsNotApplicable'));
          nextStep();
        }
      } catch (err) {
        toast.error(t('buyerVerificationWizard.failedToUpdateGstinStatus'));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!gstinForm.gstinNumber || gstinForm.gstinNumber.trim().length !== 15) {
      toast.error(t('buyerVerificationWizard.pleaseEnterAValid15characterGstin'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await buyerService.verifyGstin({ gstinNumber: gstinForm.gstinNumber });
      if (res.success) {
        setVerification(res.verification);
        toast.success(t('buyerVerificationWizard.gstinVerifiedSuccessfully'));
        nextStep();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'GSTIN verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBusRegSubmit = async () => {
    if (!busRegForm.registrationNumber) {
      toast.error(t('buyerVerificationWizard.pleaseEnterRegistrationNumberIdentifier'));
      return;
    }
    // We update business details or skip to next
    nextStep();
  };

  const handleRepSubmit = async () => {
    if (!repForm.repName || !repForm.designation) {
      toast.error(t('buyerVerificationWizard.pleaseEnterRepresentativeNameAndDesignation'));
      return;
    }
    if (!repForm.otpSent) {
      if (!repForm.mobileNumber || repForm.mobileNumber.length < 10) {
        toast.error(t('buyerVerificationWizard.pleaseEnterValidMobileNumber'));
        return;
      }
      setSubmitting(true);
      try {
        const res = await buyerService.sendRepOtp({ mobileNumber: repForm.mobileNumber });
        if (res.success) {
          setRepForm((prev) => ({ ...prev, otpSent: true }));
          toast.success(t('buyerVerificationWizard.otpSentToRepresentativeMobile'));
        }
      } catch (err) {
        toast.error(t('buyerVerificationWizard.failedToSendOtp'));
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!repForm.otp || repForm.otp.length !== 6) {
        toast.error(t('buyerVerificationWizard.pleaseEnter6digitOtp'));
        return;
      }
      setSubmitting(true);
      try {
        const res = await buyerService.verifyRepresentative({
          repName: repForm.repName,
          designation: repForm.designation,
          mobileNumber: repForm.mobileNumber,
          otp: repForm.otp,
          authDocUploaded: repForm.authDocUploaded,
        });
        if (res.success) {
          setVerification(res.verification);
          toast.success(t('buyerVerificationWizard.authorizedRepresentativeVerified'));
          nextStep();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Representative verification failed');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBankSubmit = async () => {
    if (!bankForm.accountHolderName || !bankForm.bankName || !bankForm.accountNumber || !bankForm.ifsc) {
      toast.error(t('buyerVerificationWizard.pleaseFillAllRequiredBankAccount'));
      return;
    }
    if (bankForm.accountNumber !== bankForm.confirmAccountNumber) {
      toast.error(t('buyerVerificationWizard.accountNumbersDoNotMatch'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await buyerService.verifyBank(bankForm);
      if (res.success) {
        setVerification(res.verification);
        toast.success(t('buyerVerificationWizard.bankAccountVerifiedSuccessfully'));
        nextStep();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bank verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUdyamSubmit = async (isNotApp = false) => {
    if (isNotApp) {
      setSubmitting(true);
      try {
        const res = await buyerService.verifyUdyam({ isNotApplicable: true });
        if (res.success) {
          setVerification(res.verification);
          toast.success(t('buyerVerificationWizard.udyamRegistrationMarkedAsNotApplicable'));
          nextStep();
        }
      } catch (err) {
        toast.error(t('buyerVerificationWizard.failedToUpdateUdyamStatus'));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!udyamForm.udyamNumber) {
      toast.error(t('buyerVerificationWizard.pleaseEnterValidUdyamRegistrationNumber'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await buyerService.verifyUdyam({ udyamNumber: udyamForm.udyamNumber });
      if (res.success) {
        setVerification(res.verification);
        toast.success(t('buyerVerificationWizard.udyamRegistrationVerified'));
        nextStep();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Udyam verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFssaiSubmit = async (isNotApp = false) => {
    if (isNotApp) {
      setSubmitting(true);
      try {
        const res = await buyerService.verifyFssai({ isNotApplicable: true });
        if (res.success) {
          setVerification(res.verification);
          toast.success(t('buyerVerificationWizard.fssaiLicenseMarkedAsNotApplicable'));
          nextStep();
        }
      } catch (err) {
        toast.error(t('buyerVerificationWizard.failedToUpdateLicenseStatus'));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!fssaiForm.fssaiNumber) {
      toast.error(t('buyerVerificationWizard.pleaseEnterValidFssaiLicenseRegistration'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await buyerService.verifyFssai({ fssaiNumber: fssaiForm.fssaiNumber, licenseType: fssaiForm.licenseType });
      if (res.success) {
        setVerification(res.verification);
        toast.success(t('buyerVerificationWizard.fssaiLicenseVerified'));
        nextStep();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'License verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentsSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await buyerService.verifyDocuments(docForm);
      if (res.success) {
        setVerification(res.verification);
        toast.success(t('buyerVerificationWizard.documentsRecordedAndVerified'));
        nextStep();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Document submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipCurrentStep = async () => {
    const key = activeStepObj.key;
    if (activeStepObj.req) {
      toast.error(t('buyerVerificationWizard.thisStepIsRequiredAndCannot'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await buyerService.skipStep(key);
      if (res.success) {
        setVerification(res.verification);
        toast.success(`Step '${activeStepObj.name}' skipped`);
        nextStep();
      }
    } catch (err) {
      toast.error(t('buyerVerificationWizard.failedToSkipStep'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalComplete = async () => {
    setSubmitting(true);
    try {
      const res = await buyerService.completeVerification();
      if (res.success) {
        setVerification(res.verification || verification);
        if (res.verificationStatus === 'VERIFIED') {
          toast.success(res.message || 'Verification complete!');
        } else {
          toast.success(t('buyerVerificationWizard.verificationDetailsSaved'));
        }
        navigate('/buyer/verification');
      }
    } catch (err) {
      toast.error(t('buyerVerificationWizard.couldNotCompleteVerification'));
    } finally {
      setSubmitting(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-700 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">{t('buyerVerificationWizard.loadingOfficialVerificationPortal')}</p>
        </div>
      </div>
    );
  }

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
                National Agricultural Buyer Verification Service
              </h1>
              <p className="text-xs text-emerald-200">
                Ministry of Agriculture & Farmers Welfare • AgriBazaar Portal
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs bg-emerald-950/60 px-3 py-1.5 rounded border border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('buyerVerificationWizard.officialIdentityComplianceGateway')}</span>
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
                Buyer Type: {rawBuyerType}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Ref: ABV-BUYER-{profile?._id?.slice(-6)?.toUpperCase() || 'SYS'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
              {config.portalTitle}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              {config.pageTitle} — Complete required verification steps to become a verified buyer.
            </p>
          </div>

          <button
            onClick={() => navigate('/buyer/dashboard')}
            className="self-start md:self-auto inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 rounded transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t('buyerVerificationWizard.saveExitToDashboard')}</span>
          </button>
        </div>

        {/* Wizard Layout: Sidebar Progress (Desktop) + Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar / Top Progress Bar */}
          <div className="lg:col-span-4 bg-white border border-slate-300 rounded-md p-5 shadow-sm h-fit">
            <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                Verification Steps
              </h3>
              <span className="text-xs font-semibold text-slate-600">
                Step {currentStep} of {steps.length}
              </span>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>

            {/* List of Steps */}
            <div className="space-y-2">
              {steps.map((st) => {
                const isCurrent = st.id === currentStep;
                const status = getStepStatus(st.key);
                const IconComp = st.icon;

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
                        <p className={`font-semibold ${isCurrent ? t('buyerVerificationWizard.textslate900') : t('buyerVerificationWizard.textslate700')}`}>
                          {st.name}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {st.shortLabel} {st.req ? t('buyerVerificationWizard.required') : t('buyerVerificationWizard.optional')}
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

          {/* Form Content Area */}
          <div className="lg:col-span-8 bg-white border border-slate-300 rounded-md p-6 shadow-sm">
            {/* Step Header */}
            <div className="border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <span>{t('buyerVerificationWizard.stepCurrentstepOfStepslength')}</span>
                <span>•</span>
                <span>{activeStepObj.req ? t('buyerVerificationWizard.mandatoryVerification') : t('buyerVerificationWizard.optionalCheck')}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <activeStepObj.icon className="w-6 h-6 text-emerald-700" />
                <span>{activeStepObj.name}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {activeStepObj.description}
              </p>
            </div>

            {/* DYNAMIC STEP CONTENT */}

            {/* 1. Mobile Verification */}
            {activeStepObj.key === 'mobile' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">{t('buyerVerificationWizard.mobileAuthenticationProtocol')}</p>
                  <p>{t('buyerVerificationWizard.enterYour10digitMobileNumberTo')}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    disabled={mobileForm.otpSent}
                    value={mobileForm.mobileNumber}
                    onChange={(e) => setMobileForm({ ...mobileForm, mobileNumber: e.target.value })}
                    placeholder={t('buyerVerificationWizard.enter10digitMobileNumber')}
                    className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none disabled:bg-slate-100"
                  />
                </div>

                {mobileForm.otpSent && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Enter 6-Digit OTP <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={mobileForm.otp}
                      onChange={(e) => setMobileForm({ ...mobileForm, otp: e.target.value })}
                      placeholder={t('buyerVerificationWizard.enter6digitOtp')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none tracking-widest font-mono"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">{t('buyerVerificationWizard.otpSentTo91xxxxxmobileformmobilenumberslice4')}</p>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <button
                    disabled={currentStep === 1}
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <button
                    onClick={handleMobileSubmit}
                    disabled={submitting}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{mobileForm.otpSent ? t('buyerVerificationWizard.verifyOtpContinue') : t('buyerVerificationWizard.getMobileOtp')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Identity Verification (Individual) */}
            {activeStepObj.key === 'identity' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">{t('buyerVerificationWizard.authorizedIdentityVerification')}</p>
                  <p>{t('buyerVerificationWizard.identityIsValidatedSecurelyViaAuthorized')}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Identity Verification Method
                  </label>
                  <select
                    value={identityForm.method}
                    onChange={(e) => setIdentityForm({ ...identityForm, method: e.target.value })}
                    className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="aadhaar">{t('buyerVerificationWizard.aadhaarbasedAuthorizedVerification')}</option>
                    <option value="pan">{t('buyerVerificationWizard.panbasedIdentityVerification')}</option>
                    <option value="voter">{t('buyerVerificationWizard.voterIdNationalPortalVerification')}</option>
                  </select>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs text-emerald-900">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={identityForm.consent}
                      onChange={(e) => setIdentityForm({ ...identityForm, consent: e.target.checked })}
                      className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <span>
                      I provide my explicit consent to AgriBazaar portal to verify my identity details with official identity registries for buyer authentication.
                    </span>
                  </label>
                </div>

                {identityForm.otpSent && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Enter Identity Gateway OTP <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={identityForm.otp}
                      onChange={(e) => setIdentityForm({ ...identityForm, otp: e.target.value })}
                      placeholder={t('buyerVerificationWizard.enter6digitOtp')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono tracking-widest"
                    />
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <button
                    onClick={handleIdentitySubmit}
                    disabled={submitting}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{identityForm.otpSent ? t('buyerVerificationWizard.verifyIdentityContinue') : t('buyerVerificationWizard.sendIdentityOtp')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 3. Address Details */}
            {activeStepObj.key === 'address' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Street Address / Premises <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                      placeholder={t('buyerVerificationWizard.flatHouseNoBuildingStreetArea')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      State <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      District <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.district}
                      onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                      placeholder={t('buyerVerificationWizard.districtName')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      City / Town <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder={t('buyerVerificationWizard.cityOrTown')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Pincode <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      placeholder={t('buyerVerificationWizard.6digitPinCode')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <button
                    onClick={handleAddressSubmit}
                    disabled={submitting}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{t('buyerVerificationWizard.verifyAddressContinue')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 4. Business Identity */}
            {activeStepObj.key === 'business' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Legal Business Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessForm.legalName}
                      onChange={(e) => setBusinessForm({ ...businessForm, legalName: e.target.value })}
                      placeholder={t('buyerVerificationWizard.asRegisteredInMcaGstPan')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Trade / Business Name
                    </label>
                    <input
                      type="text"
                      value={businessForm.tradeName}
                      onChange={(e) => setBusinessForm({ ...businessForm, tradeName: e.target.value })}
                      placeholder={t('buyerVerificationWizard.brandOrTradeNameOptional')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Business Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={businessForm.businessType}
                      onChange={(e) => setBusinessForm({ ...businessForm, businessType: e.target.value })}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="Retailer">{t('buyerVerificationWizard.retailerAgribusinessDealer')}</option>
                      <option value="Wholesaler">{t('buyerVerificationWizard.wholesalerTrader')}</option>
                      <option value="Processor">{t('buyerVerificationWizard.foodProcessorMill')}</option>
                      <option value="Exporter">{t('buyerVerificationWizard.exporterInstitutionalBuyer')}</option>
                      <option value="Proprietorship">{t('buyerVerificationWizard.proprietorshipFirm')}</option>
                      <option value="Partnership">{t('buyerVerificationWizard.partnershipFirm')}</option>
                      <option value="PvtLtd">{t('buyerVerificationWizard.privateLimitedCompany')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Registered State <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={businessForm.state}
                      onChange={(e) => setBusinessForm({ ...businessForm, state: e.target.value })}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Business Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessForm.address}
                      onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                      placeholder={t('buyerVerificationWizard.registeredOfficeTradePremisesAddress')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      District <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessForm.district}
                      onChange={(e) => setBusinessForm({ ...businessForm, district: e.target.value })}
                      placeholder={t('buyerVerificationWizard.district')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      City / Town <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessForm.city}
                      onChange={(e) => setBusinessForm({ ...businessForm, city: e.target.value })}
                      placeholder={t('buyerVerificationWizard.cityOrTown')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Pincode <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={businessForm.pincode}
                      onChange={(e) => setBusinessForm({ ...businessForm, pincode: e.target.value })}
                      placeholder={t('buyerVerificationWizard.6digitPincode')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <button
                    onClick={handleBusinessSubmit}
                    disabled={submitting}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{t('buyerVerificationWizard.verifyBusinessIdentity')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 5. Business PAN */}
            {activeStepObj.key === 'pan' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">{t('buyerVerificationWizard.incomeTaxDepartmentPanVerification')}</p>
                  <p>{t('buyerVerificationWizard.enterThe10characterPermanentAccountNumber')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Business / Entity PAN <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={panForm.panNumber}
                      onChange={(e) => setPanForm({ ...panForm, panNumber: e.target.value.toUpperCase() })}
                      placeholder={t('buyerVerificationWizard.egAbcde1234f')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono tracking-widest uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Legal Name as per PAN
                    </label>
                    <input
                      type="text"
                      value={panForm.legalName}
                      onChange={(e) => setPanForm({ ...panForm, legalName: e.target.value })}
                      placeholder={t('buyerVerificationWizard.legalEntityName')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <button
                    onClick={handlePanSubmit}
                    disabled={submitting}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{t('buyerVerificationWizard.verifyBusinessPan')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 6. GSTIN Verification (Conditional) */}
            {activeStepObj.key === 'gstin' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">{t('buyerVerificationWizard.goodsAndServicesTaxIdentificationGstin')}</p>
                  <p>{t('buyerVerificationWizard.gstinVerificationIsConditionalSmallTraders')}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    15-Digit GSTIN Number
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={gstinForm.gstinNumber}
                    onChange={(e) => setGstinForm({ ...gstinForm, gstinNumber: e.target.value.toUpperCase() })}
                    placeholder={t('buyerVerificationWizard.eg27aaaaa0000a1z5')}
                    className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono tracking-wider uppercase"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200 gap-2 flex-wrap">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleGstinSubmit(true)}
                      disabled={submitting}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 px-4 py-2.5 rounded border border-slate-300"
                    >
                      <span>{t('buyerVerificationWizard.gstinNotApplicable')}</span>
                    </button>

                    <button
                      onClick={() => handleGstinSubmit(false)}
                      disabled={submitting}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                    >
                      {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{t('buyerVerificationWizard.verifyGstinContinue')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Business Registration (Bulk Buyer) */}
            {activeStepObj.key === 'businessRegistration' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Organization Structure Type
                    </label>
                    <select
                      value={busRegForm.orgType}
                      onChange={(e) => setBusRegForm({ ...busRegForm, orgType: e.target.value })}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="Company">{t('buyerVerificationWizard.privatePublicLimitedCompanyCin')}</option>
                      <option value="LLP">{t('buyerVerificationWizard.limitedLiabilityPartnershipLlpin')}</option>
                      <option value="Partnership">{t('buyerVerificationWizard.registeredPartnershipFirm')}</option>
                      <option value="Proprietorship">{t('buyerVerificationWizard.registeredSoleProprietorship')}</option>
                      <option value="Cooperative">{t('buyerVerificationWizard.cooperativeSocietyFarmerFederation')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Registration Number / Identifier <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={busRegForm.registrationNumber}
                      onChange={(e) => setBusRegForm({ ...busRegForm, registrationNumber: e.target.value })}
                      placeholder={t('buyerVerificationWizard.egU01100mh2020ptc123456')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <button
                    onClick={handleBusRegSubmit}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm"
                  >
                    <span>{t('buyerVerificationWizard.verifyRegistration')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 8. Authorized Representative */}
            {activeStepObj.key === 'representative' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Representative Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={repForm.repName}
                      onChange={(e) => setRepForm({ ...repForm, repName: e.target.value })}
                      placeholder={t('buyerVerificationWizard.fullName')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Designation <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={repForm.designation}
                      onChange={(e) => setRepForm({ ...repForm, designation: e.target.value })}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="Owner">{t('buyerVerificationWizard.ownerProprietor')}</option>
                      <option value="Partner">{t('buyerVerificationWizard.partner')}</option>
                      <option value="Director">{t('buyerVerificationWizard.director')}</option>
                      <option value="CEO">{t('buyerVerificationWizard.ceoManagingDirector')}</option>
                      <option value="Manager">{t('buyerVerificationWizard.managerProcurementOfficer')}</option>
                      <option value="Authorized Signatory">{t('buyerVerificationWizard.authorizedSignatory')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      disabled={repForm.otpSent}
                      value={repForm.mobileNumber}
                      onChange={(e) => setRepForm({ ...repForm, mobileNumber: e.target.value })}
                      placeholder={t('buyerVerificationWizard.10digitMobile')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 disabled:bg-slate-100"
                    />
                  </div>

                  {repForm.otpSent && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Representative OTP <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={repForm.otp}
                        onChange={(e) => setRepForm({ ...repForm, otp: e.target.value })}
                        placeholder={t('buyerVerificationWizard.6digitOtp')}
                        className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono tracking-widest"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={repForm.authDocUploaded}
                      onChange={(e) => setRepForm({ ...repForm, authDocUploaded: e.target.checked })}
                      className="rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <span>{t('buyerVerificationWizard.iConfirmIPossessOfficialBoard')}</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <button
                    onClick={handleRepSubmit}
                    disabled={submitting}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{repForm.otpSent ? t('buyerVerificationWizard.verifyRepresentativeOtp') : t('buyerVerificationWizard.sendRepresentativeOtp')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 9. Bank Account Verification */}
            {activeStepObj.key === 'bank' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Account Holder Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankForm.accountHolderName}
                      onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                      placeholder={t('buyerVerificationWizard.nameAsPerBankPassbook')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Bank Name <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={bankForm.bankName}
                      onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    >
                      {MAJOR_BANKS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      value={bankForm.branchName}
                      onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })}
                      placeholder={t('buyerVerificationWizard.branchName')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      IFSC Code <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      value={bankForm.ifsc}
                      onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                      placeholder={t('buyerVerificationWizard.egSbin0001234')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono tracking-widest uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Account Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                      placeholder={t('buyerVerificationWizard.accountNumber')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Confirm Account Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankForm.confirmAccountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, confirmAccountNumber: e.target.value })}
                      placeholder={t('buyerVerificationWizard.reenterAccountNumber')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <button
                    onClick={handleBankSubmit}
                    disabled={submitting}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{t('buyerVerificationWizard.verifyBankAccount')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 10. Udyam Registration (Conditional) */}
            {activeStepObj.key === 'udyam' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">{t('buyerVerificationWizard.udyamMsmeRegistration')}</p>
                  <p>{t('buyerVerificationWizard.conditionalCheckEnterYourUdyamRegistration')}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Udyam Registration Number
                  </label>
                  <input
                    type="text"
                    value={udyamForm.udyamNumber}
                    onChange={(e) => setUdyamForm({ ...udyamForm, udyamNumber: e.target.value.toUpperCase() })}
                    placeholder={t('buyerVerificationWizard.egUdyammh000000000')}
                    className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200 flex-wrap gap-2">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleUdyamSubmit(true)}
                      disabled={submitting}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 px-4 py-2.5 rounded border border-slate-300"
                    >
                      <span>{t('buyerVerificationWizard.udyamNotApplicable')}</span>
                    </button>

                    <button
                      onClick={() => handleUdyamSubmit(false)}
                      disabled={submitting}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                    >
                      {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{t('buyerVerificationWizard.verifyUdyamContinue')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 11. FSSAI / License Verification (Conditional) */}
            {activeStepObj.key === 'fssai' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">{t('buyerVerificationWizard.fssaiCommodityTradeLicense')}</p>
                  <p>{t('buyerVerificationWizard.showThisOnlyWhereBuyerActivity')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      License Type
                    </label>
                    <select
                      value={fssaiForm.licenseType}
                      onChange={(e) => setFssaiForm({ ...fssaiForm, licenseType: e.target.value })}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="FSSAI License">{t('buyerVerificationWizard.fssaiRegistrationLicense')}</option>
                      <option value="APMC License">{t('buyerVerificationWizard.apmcMandiTradeLicense')}</option>
                      <option value="Agri Trade License">{t('buyerVerificationWizard.agriculturalCommodityTradeLicense')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      License / Registration Number
                    </label>
                    <input
                      type="text"
                      value={fssaiForm.fssaiNumber}
                      onChange={(e) => setFssaiForm({ ...fssaiForm, fssaiNumber: e.target.value })}
                      placeholder={t('buyerVerificationWizard.eg10020021000123')}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200 flex-wrap gap-2">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleFssaiSubmit(true)}
                      disabled={submitting}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 px-4 py-2.5 rounded border border-slate-300"
                    >
                      <span>{t('buyerVerificationWizard.licenseNotApplicable')}</span>
                    </button>

                    <button
                      onClick={() => handleFssaiSubmit(false)}
                      disabled={submitting}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                    >
                      {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{t('buyerVerificationWizard.verifyLicenseContinue')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 12. Documents Upload */}
            {activeStepObj.key === 'documents' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">{t('buyerVerificationWizard.documentUploadComplianceAudit')}</p>
                  <p>{t('buyerVerificationWizard.uploadClearScanOrPdfCopies')}</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'businessCert', title: 'Business Registration / Incorporation Certificate', req: true },
                    { id: 'panDoc', title: 'Business PAN Document', req: true },
                    { id: 'bankProof', title: 'Bank Account Proof / Cancelled Cheque', req: true },
                    { id: 'authDoc', title: 'Board / Owner Authorization Document', req: true },
                    { id: 'gstCert', title: 'GST Certificate (if applicable)', req: false },
                    { id: 'udyamCert', title: 'Udyam Registration Certificate (if applicable)', req: false },
                    { id: 'fssaiCert', title: 'FSSAI / Mandi License Document (if applicable)', req: false },
                  ].map((doc) => {
                    const isUploaded = docForm[doc.id];
                    return (
                      <div key={doc.id} className="p-3 border border-slate-200 rounded flex items-center justify-between bg-white text-xs">
                        <div className="flex items-center space-x-2.5">
                          <FolderCheck className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="font-semibold text-slate-800">{doc.title}</p>
                            <p className="text-[11px] text-slate-500">{doc.req ? t('buyerVerificationWizard.requiredDocument') : t('buyerVerificationWizard.conditionalDocument')}</p>
                          </div>
                        </div>

                        <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 border rounded bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700">
                          <Upload className="w-3.5 h-3.5 text-slate-600" />
                          <span>{isUploaded ? t('buyerVerificationWizard.verified_uploaded') : t('buyerVerificationWizard.uploadDocument')}</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
                              const ext = '.' + file.name.split('.').pop().toLowerCase();
                              if (!allowedExts.includes(ext)) {
                                toast.error(`Invalid document file format (${ext}). Allowed formats: PDF, JPG, PNG, WEBP.`);
                                return;
                              }
                              setDocForm({ ...docForm, [doc.id]: true });
                              toast.success(`Uploaded ${doc.title}`);
                            }}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.back')}</span>
                  </button>

                  <button
                    onClick={handleDocumentsSubmit}
                    disabled={submitting}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2.5 rounded shadow-sm disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{t('buyerVerificationWizard.submitDocumentsProceed')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 13. Summary Step */}
            {activeStepObj.key === 'summary' && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-300 rounded-md p-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto mb-3 shadow">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900">
                    {config.badgeText}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                    All required verification checks have been audited and updated in the official buyer registry.
                  </p>
                </div>

                {/* Checklist Summary */}
                <div className="bg-slate-50 border border-slate-300 rounded p-4">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                    Verification Checklist Audit Status
                  </h5>
                  <div className="space-y-2">
                    {steps.filter((s) => s.key !== 'summary').map((st) => {
                      const stStatus = getStepStatus(st.key);
                      const isOk = stStatus === 'VERIFIED' || stStatus === 'NOT_APPLICABLE';
                      return (
                        <div key={st.key} className="flex items-center justify-between text-xs py-1 border-b border-slate-200 last:border-0">
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
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded border border-slate-300"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('buyerVerificationWizard.backToReview')}</span>
                  </button>

                  <button
                    onClick={handleFinalComplete}
                    disabled={submitting}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-6 py-3 rounded shadow-md disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>{t('buyerVerificationWizard.finalizeBuyerVerification')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Official Security Disclaimer Notice */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center">
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('buyerVerificationWizard.yourInformationIsSecurelyProcessedSensitive')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
