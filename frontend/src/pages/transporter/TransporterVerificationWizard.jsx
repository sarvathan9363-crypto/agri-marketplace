import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  CreditCard,
  FileCheck2,
  UserCheck,
  Building,
  Truck,
  Users,
  Save,
  Plus,
  Trash2,
  ShieldCheck,
  Loader2,
  X,
} from 'lucide-react';
import transportService from '../../services/transportService';
import { useAuth } from '../../context/AuthContext';
import { getVerificationConfigs } from '../../config/verificationConfigs';
import SecureFileUpload from '../../components/common/SecureFileUpload';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const VEHICLE_TYPES = [
  'Mini Truck / LCV (1-3 Ton)',
  'Refrigerated LCV / Cold Truck',
  'Medium Commercial Vehicle (3-10 Ton)',
  'Heavy Duty Multi-Axle Truck (10+ Ton)',
  'Open Body Cargo Truck',
  'Container / Covered Freight Truck',
  'Tractor Trailer',
];

export default function TransporterVerificationWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const config = getVerificationConfigs(t).transporter;

  const defaultName = user?.fullName || profile?.contactPerson || profile?.fullName || '';
  const defaultMobile = user?.mobileNumber || profile?.contactMobile || profile?.mobileNumber || '';
  const defaultEmail = user?.email || profile?.contactEmail || profile?.email || '';
  const defaultCompany = (profile?.companyName && !profile.companyName.includes('undefined'))
    ? profile.companyName
    : (defaultName ? `${defaultName} Logistics` : 'GreenRoute Transport & Logistics');

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Backend verification state
  const [verification, setVerification] = useState({
    basicDetails: { status: 'pending' },
    identity: { status: 'pending' },
    businessRegistration: { status: 'pending' },
    bankAccount: { status: 'pending' },
    vehiclesStep: { status: 'pending' },
    driversStep: { status: 'pending' },
    overallStatus: 'NOT_STARTED',
  });

  // Step 1 Form
  const [basicForm, setBasicForm] = useState({
    transporterType: 'INDIVIDUAL',
    companyName: defaultCompany,
    contactPerson: defaultName,
    mobileNumber: defaultMobile,
    email: defaultEmail,
    address: '',
    state: 'Maharashtra',
    district: '',
    pincode: '',
    serviceAreas: 'Maharashtra, Gujarat, Karnataka',
  });

  // Step 2 Form
  const [identityForm, setIdentityForm] = useState({
    aadhaarNumber: '',
    otp: '',
    otpSent: false,
    panNumber: '',
    panDocUrl: '',
  });

  // Step 3 Form
  const [businessForm, setBusinessForm] = useState({
    businessType: 'Proprietorship',
    gstin: '',
    gstDocUrl: '',
    udyamNumber: '',
    udyamDocUrl: '',
    regCertDocUrl: '',
  });

  // Step 4 Form
  const [bankForm, setBankForm] = useState({
    accountHolderName: defaultName,
    bankName: 'State Bank of India (SBI)',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    cancelledChequeDocUrl: '',
  });

  // Step 5: Vehicles list & modal
  const [vehicles, setVehicles] = useState([]);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    registrationNumber: '',
    vehicleType: 'Mini Truck / LCV (1-3 Ton)',
    makeModel: '',
    capacityKg: 2000,
    rcDocUrl: '',
    insuranceDocUrl: '',
    fitnessDocUrl: '',
    pucDocUrl: '',
    permitDocUrl: '',
  });

  // Step 6: Drivers list & modal
  const [drivers, setDrivers] = useState([]);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [driverForm, setDriverForm] = useState({
    driverName: '',
    mobileNumber: '',
    licenseNumber: '',
    licenseExpiry: '',
    licenseDocUrl: '',
    assignedVehicleNumber: '',
  });

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const getFirstIncompleteStep = (v) => {
    const isDone = (status) => {
      const s = String(status || '').toLowerCase();
      return s === 'submitted' || s === 'verified' || s === 'under_review' || s === 'skipped';
    };

    if (!isDone(v?.basicDetails?.status)) return 1;
    if (!isDone(v?.identity?.status)) return 2;
    if (!isDone(v?.businessRegistration?.status)) return 3;
    if (!isDone(v?.bankAccount?.status)) return 4;
    if (!isDone(v?.vehiclesStep?.status)) return 5;
    if (!isDone(v?.driversStep?.status)) return 6;
    return 6;
  };

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const res = await transportService.getVerification();
      if (res.verification) {
        setVerification(res.verification);
        const nextStep = getFirstIncompleteStep(res.verification);
        setCurrentStep(nextStep);

        const bd = res.verification.basicDetails || {};
        const pi = res.profileInfo || {};
        setBasicForm({
          transporterType: bd.transporterType || 'INDIVIDUAL',
          companyName: (bd.companyName && !bd.companyName.includes('undefined')) ? bd.companyName : (pi.companyName || defaultCompany),
          contactPerson: bd.contactPerson || pi.contactPerson || defaultName,
          mobileNumber: bd.mobileNumber || pi.mobileNumber || defaultMobile,
          email: bd.email || pi.email || defaultEmail,
          address: bd.address || pi.address || '',
          state: bd.state || pi.state || 'Maharashtra',
          district: bd.district || pi.district || '',
          pincode: bd.pincode || pi.pincode || '',
          serviceAreas: (bd.serviceAreas && bd.serviceAreas.length > 0)
            ? bd.serviceAreas.join(', ')
            : (pi.serviceAreas?.length > 0 ? pi.serviceAreas.join(', ') : 'Maharashtra, Gujarat, Karnataka'),
        });

        if (res.verification.identity) {
          const id = res.verification.identity;
          setIdentityForm((prev) => ({
            ...prev,
            aadhaarNumber: id.aadhaarNumberMasked || prev.aadhaarNumber || '',
            panNumber: id.panNumber || prev.panNumber || '',
            panDocUrl: id.panDocUrl || prev.panDocUrl || '',
          }));
        }

        if (res.verification.businessRegistration) {
          const br = res.verification.businessRegistration;
          setBusinessForm({
            businessType: br.businessType || 'Proprietorship',
            gstin: br.gstin || '',
            gstDocUrl: br.gstDocUrl || '',
            udyamNumber: br.udyamNumber || '',
            udyamDocUrl: br.udyamDocUrl || '',
            regCertDocUrl: br.regCertDocUrl || '',
          });
        }

        if (res.verification.bankAccount) {
          const ba = res.verification.bankAccount;
          setBankForm((prev) => ({
            ...prev,
            accountHolderName: ba.accountHolderName || defaultName,
            bankName: ba.bankName || 'State Bank of India (SBI)',
            accountNumber: ba.accountNumberMasked || prev.accountNumber || '',
            confirmAccountNumber: ba.accountNumberMasked || prev.confirmAccountNumber || '',
            ifsc: ba.ifsc || prev.ifsc || '',
            cancelledChequeDocUrl: ba.cancelledChequeDocUrl || prev.cancelledChequeDocUrl || '',
          }));
        }
      }

      if (res.vehicles) setVehicles(res.vehicles);
      if (res.drivers) setDrivers(res.drivers);
    } catch {
      toast.error(t('transporterVerification.failedToLoadStatus', { defaultValue: 'Failed to load verification status.' }));
    } finally {
      setLoading(false);
    }
  };

  // Step 1 Save Handler
  const handleSaveBasicDetails = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const areasArr = basicForm.serviceAreas.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await transportService.saveBasicDetails({
        ...basicForm,
        serviceAreas: areasArr,
      });
      toast.success(t('transporterVerification.basicSaved', { defaultValue: 'Basic details saved.' }));
      setVerification(res.verification);
      setCurrentStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || t('transporterVerification.saveFailed', { defaultValue: 'Failed to save details.' }));
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2 Save Handler
  const handleSaveIdentity = async (e) => {
    e.preventDefault();
    if (!identityForm.panNumber) {
      toast.error(t('transporterVerification.panRequired', { defaultValue: 'Please enter a valid PAN number.' }));
      return;
    }
    try {
      setSubmitting(true);
      const res = await transportService.saveIdentity({
        aadhaarNumber: identityForm.aadhaarNumber,
        panNumber: identityForm.panNumber,
        panDocUrl: identityForm.panDocUrl,
      });
      toast.success(t('transporterVerification.identitySaved', { defaultValue: 'Identity details saved.' }));
      setVerification(res.verification);
      setCurrentStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || t('transporterVerification.saveFailed', { defaultValue: 'Failed to save identity.' }));
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3 Save Handler
  const handleSaveBusiness = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await transportService.saveBusinessRegistration(businessForm);
      toast.success(t('transporterVerification.businessSaved', { defaultValue: 'Business registration details saved.' }));
      setVerification(res.verification);
      setCurrentStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || t('transporterVerification.saveFailed', { defaultValue: 'Failed to save business info.' }));
    } finally {
      setSubmitting(false);
    }
  };

  // Step 4 Save Handler
  const handleSaveBank = async (e) => {
    e.preventDefault();
    if (bankForm.accountNumber && bankForm.accountNumber !== bankForm.confirmAccountNumber) {
      toast.error(t('transporterVerification.bankMismatch', { defaultValue: 'Bank account numbers do not match.' }));
      return;
    }
    try {
      setSubmitting(true);
      const res = await transportService.saveBankAccount({
        accountHolderName: bankForm.accountHolderName,
        accountNumber: bankForm.accountNumber,
        ifsc: bankForm.ifsc,
        bankName: bankForm.bankName,
        cancelledChequeDocUrl: bankForm.cancelledChequeDocUrl,
      });
      toast.success(t('transporterVerification.bankSaved', { defaultValue: 'Bank details saved.' }));
      setVerification(res.verification);
      setCurrentStep(5);
    } catch (err) {
      toast.error(err.response?.data?.message || t('transporterVerification.saveFailed', { defaultValue: 'Failed to save bank details.' }));
    } finally {
      setSubmitting(false);
    }
  };

  // Step 5 Vehicle Add/Save Handler
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!vehicleForm.registrationNumber || !vehicleForm.vehicleType) {
      toast.error(t('transporterVerification.vehicleRegRequired', { defaultValue: 'Vehicle registration number and type are required.' }));
      return;
    }
    try {
      setSubmitting(true);
      const res = await transportService.saveVehicle(vehicleForm);
      toast.success(t('transporterVerification.vehicleSaved', { defaultValue: 'Vehicle added to fleet successfully.' }));
      setVehicles(res.vehicles || []);
      setVerification(res.verification);
      setShowVehicleModal(false);
      setVehicleForm({
        registrationNumber: '',
        vehicleType: 'Mini Truck / LCV (1-3 Ton)',
        makeModel: '',
        capacityKg: 2000,
        rcDocUrl: '',
        insuranceDocUrl: '',
        fitnessDocUrl: '',
        pucDocUrl: '',
        permitDocUrl: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || t('transporterVerification.vehicleAddFailed', { defaultValue: 'Failed to save vehicle.' }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (vehId) => {
    try {
      const res = await transportService.deleteVehicle(vehId);
      toast.success(t('transporterVerification.vehicleDeleted', { defaultValue: 'Vehicle removed.' }));
      setVehicles(res.vehicles || []);
    } catch {
      toast.error(t('transporterVerification.vehicleDeleteFailed', { defaultValue: 'Failed to delete vehicle.' }));
    }
  };

  // Step 6 Driver Add/Save Handler
  const handleAddDriver = async (e) => {
    e.preventDefault();
    if (!driverForm.driverName || !driverForm.licenseNumber) {
      toast.error(t('transporterVerification.driverNameRequired', { defaultValue: 'Driver name and license number are required.' }));
      return;
    }
    try {
      setSubmitting(true);
      const res = await transportService.saveDriver(driverForm);
      toast.success(t('transporterVerification.driverSaved', { defaultValue: 'Driver added to roster successfully.' }));
      setDrivers(res.drivers || []);
      setVerification(res.verification);
      setShowDriverModal(false);
      setDriverForm({
        driverName: '',
        mobileNumber: '',
        licenseNumber: '',
        licenseExpiry: '',
        licenseDocUrl: '',
        assignedVehicleNumber: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || t('transporterVerification.driverAddFailed', { defaultValue: 'Failed to save driver.' }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDriver = async (drvId) => {
    try {
      const res = await transportService.deleteDriver(drvId);
      toast.success(t('transporterVerification.driverDeleted', { defaultValue: 'Driver removed.' }));
      setDrivers(res.drivers || []);
    } catch {
      toast.error(t('transporterVerification.driverDeleteFailed', { defaultValue: 'Failed to delete driver.' }));
    }
  };

  // Skip step handler
  const handleSkipStep = async (stepKey, targetStep) => {
    try {
      await transportService.skipStep(stepKey);
      toast.success(t('transporterVerification.stepSkipped', { defaultValue: 'Step skipped.' }));
      setCurrentStep(targetStep);
    } catch {
      toast.error(t('transporterVerification.skipFailed', { defaultValue: 'Failed to skip step.' }));
    }
  };

  // Submit complete verification
  const handleSubmitFinal = async () => {
    if (vehicles.length === 0) {
      toast.error(t('transporterVerification.atLeastOneVehicleReq', { defaultValue: 'Please add at least one vehicle before submitting verification.' }));
      setCurrentStep(5);
      return;
    }
    try {
      setSubmitting(true);
      await transportService.submitVerification();
      toast.success(t('transporterVerification.submittedForReview', { defaultValue: 'Transporter verification application submitted for admin review!' }));
      navigate('/transporter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || t('transporterVerification.submitFailed', { defaultValue: 'Failed to submit application.' }));
    } finally {
      setSubmitting(false);
    }
  };

  // Save and Exit handler
  const handleSaveAndExit = () => {
    toast.success(t('transporterVerification.progressSavedExit', { defaultValue: 'Verification progress saved. Returning to dashboard.' }));
    navigate('/transporter/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-[#00684a] animate-spin" />
        <p className="text-sm font-bold text-[#001e2b] font-display">
          {t('transporterVerification.loadingWizard', { defaultValue: 'Loading transporter verification wizard...' })}
        </p>
      </div>
    );
  }

  const stepsList = config.steps || [];
  const activeStepObj = stepsList.find((s) => s.id === currentStep) || stepsList[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 px-2 sm:px-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8eddb] pb-4">
        <div>
          <span className="text-[10px] font-black text-[#00684a] uppercase tracking-widest bg-[#00ed64]/20 px-3 py-1 rounded-full font-display">
            {config.portalTitle || t('transporterVerification.portalTitle', { defaultValue: 'Transporter Verification Wizard' })}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#001e2b] font-display mt-1">
            {config.pageTitle || t('transporterVerification.pageTitle', { defaultValue: 'Transporter Onboarding & Verification' })}
          </h1>
        </div>

        <button
          onClick={handleSaveAndExit}
          className="px-4 py-2.5 bg-white border border-[#e8eddb] hover:border-[#00684a] text-[#001e2b] text-xs font-extrabold rounded-2xl flex items-center gap-2 shadow-sm font-display transition shrink-0"
        >
          <Save className="w-4 h-4 text-[#00684a]" />
          <span>{t('transporterVerification.saveAndExit', { defaultValue: 'Save & Exit' })}</span>
        </button>
      </div>

      {/* STEPPER BAR */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#e8eddb] shadow-sm space-y-4">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2">
          {stepsList.map((st) => {
            const Icon = st.icon;
            const isCurrent = currentStep === st.id;
            const isCompleted = currentStep > st.id;

            return (
              <button
                key={st.id}
                onClick={() => setCurrentStep(st.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition shrink-0 ${
                  isCurrent
                    ? 'bg-[#001e2b] text-[#00ed64]'
                    : isCompleted
                    ? 'bg-emerald-50 text-[#00684a] border border-emerald-200'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                  isCurrent ? 'bg-[#00ed64] text-[#001e2b]' : isCompleted ? 'bg-[#00684a] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : st.id}
                </div>
                <span className="font-display hidden sm:inline">{st.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-[#00684a] uppercase tracking-wider font-display">
            STEP {currentStep} OF {stepsList.length} • {activeStepObj.req ? t('transporterVerification.mandatory', { defaultValue: 'Mandatory' }) : t('transporterVerification.optional', { defaultValue: 'Optional' })}
          </span>
          <h2 className="text-xl font-black text-[#001e2b] font-display mt-1">{activeStepObj.name}</h2>
          <p className="text-xs text-gray-600 font-sans mt-0.5">{activeStepObj.description}</p>
        </div>

        {/* STEP 1: Basic Transporter Details */}
        {currentStep === 1 && (
          <form onSubmit={handleSaveBasicDetails} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.transporterType', { defaultValue: 'Transporter Entity Type *' })}</label>
                <select
                  value={basicForm.transporterType}
                  onChange={(e) => setBasicForm({ ...basicForm, transporterType: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                >
                  <option value="INDIVIDUAL">{t('transporterVerification.individualOwnerOperator', { defaultValue: 'Individual Owner-Operator' })}</option>
                  <option value="BUSINESS">{t('transporterVerification.businessLogisticsCompany', { defaultValue: 'Business Freight & Logistics Company' })}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.companyName', { defaultValue: 'Transporter / Company Name *' })}</label>
                <input
                  type="text"
                  required
                  value={basicForm.companyName}
                  onChange={(e) => setBasicForm({ ...basicForm, companyName: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.contactPerson', { defaultValue: 'Contact Person *' })}</label>
                <input
                  type="text"
                  required
                  value={basicForm.contactPerson}
                  onChange={(e) => setBasicForm({ ...basicForm, contactPerson: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.mobileNumber', { defaultValue: 'Mobile Number *' })}</label>
                <input
                  type="text"
                  required
                  value={basicForm.mobileNumber}
                  onChange={(e) => setBasicForm({ ...basicForm, mobileNumber: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.email', { defaultValue: 'Email Address *' })}</label>
                <input
                  type="email"
                  required
                  value={basicForm.email}
                  onChange={(e) => setBasicForm({ ...basicForm, email: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.address', { defaultValue: 'Registered Business Address *' })}</label>
              <input
                type="text"
                required
                value={basicForm.address}
                onChange={(e) => setBasicForm({ ...basicForm, address: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                placeholder="Door No, Street Name, Transport Nagar"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.state', { defaultValue: 'State *' })}</label>
                <select
                  value={basicForm.state}
                  onChange={(e) => setBasicForm({ ...basicForm, state: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.district', { defaultValue: 'District *' })}</label>
                <input
                  type="text"
                  required
                  value={basicForm.district}
                  onChange={(e) => setBasicForm({ ...basicForm, district: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.pincode', { defaultValue: 'PIN Code *' })}</label>
                <input
                  type="text"
                  required
                  value={basicForm.pincode}
                  onChange={(e) => setBasicForm({ ...basicForm, pincode: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.serviceAreas', { defaultValue: 'Primary Service Areas / States (comma separated)' })}</label>
              <input
                type="text"
                value={basicForm.serviceAreas}
                onChange={(e) => setBasicForm({ ...basicForm, serviceAreas: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                placeholder="Maharashtra, Gujarat, Karnataka, Tamil Nadu"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSaveAndExit}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                {t('transporterVerification.saveExit', { defaultValue: 'Save & Exit' })}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl transition font-display flex items-center gap-2"
              >
                <span>{submitting ? t('common.saving', { defaultValue: 'Saving...' }) : t('transporterVerification.saveContinue', { defaultValue: 'Save & Continue' })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Identity Verification */}
        {currentStep === 2 && (
          <form onSubmit={handleSaveIdentity} className="space-y-6 text-xs font-sans">
            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.panNumber', { defaultValue: 'PAN Number (Individual / Business PAN) *' })}</label>
              <input
                type="text"
                required
                maxLength={10}
                value={identityForm.panNumber}
                onChange={(e) => setIdentityForm({ ...identityForm, panNumber: e.target.value.toUpperCase() })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-base tracking-widest text-[#001e2b]"
                placeholder="ABCDE1234F"
              />
            </div>

            {/* PAN Document Upload */}
            <div className="p-4 bg-[#fafcf8] rounded-2xl border border-[#e8eddb] space-y-2">
              <label className="block font-bold text-gray-800">{t('transporterVerification.panDocUpload', { defaultValue: 'Upload PAN Card Document (JPG, PNG, PDF)' })}</label>
              <SecureFileUpload
                category="VERIFICATION"
                subCategory="PAN"
                documentType="PAN_DOC"
                existingFile={identityForm.panDocUrl}
                onSuccess={(fileData) => {
                  setIdentityForm((prev) => ({ ...prev, panDocUrl: fileData.secureUrl }));
                  toast.success(t('transporterVerification.panUploaded', { defaultValue: 'PAN Document uploaded to Cloudinary.' }));
                }}
                onFileRemove={() => {
                  setIdentityForm((prev) => ({ ...prev, panDocUrl: '' }));
                }}
              />
              {identityForm.panDocUrl && (
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-4 h-4" /> Document Uploaded
                </p>
              )}
            </div>

            {/* Aadhaar Number */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.aadhaarNumber', { defaultValue: 'Aadhaar Number (12 Digits - Optional for Business)' })}</label>
              <input
                type="text"
                maxLength={12}
                value={identityForm.aadhaarNumber}
                onChange={(e) => setIdentityForm({ ...identityForm, aadhaarNumber: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold"
                placeholder="123456789012"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> {t('common.back', { defaultValue: 'Back' })}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl transition font-display flex items-center gap-2"
              >
                <span>{submitting ? t('common.saving', { defaultValue: 'Saving...' }) : t('transporterVerification.saveContinue', { defaultValue: 'Save & Continue' })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Business Registration (Conditional) */}
        {currentStep === 3 && (
          <form onSubmit={handleSaveBusiness} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.businessType', { defaultValue: 'Business Registration Type' })}</label>
              <select
                value={businessForm.businessType}
                onChange={(e) => setBusinessForm({ ...businessForm, businessType: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
              >
                <option value="Proprietorship">{t('transporterVerification.individualProprietorship', { defaultValue: 'Individual Proprietorship' })}</option>
                <option value="Partnership">{t('transporterVerification.partnershipFirm', { defaultValue: 'Partnership Firm' })}</option>
                <option value="LLP">{t('transporterVerification.llpCompany', { defaultValue: 'Limited Liability Partnership (LLP)' })}</option>
                <option value="PrivateLimited">{t('transporterVerification.pvtLtdCompany', { defaultValue: 'Private Limited Company (Pvt Ltd)' })}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.gstin', { defaultValue: 'GSTIN Registration (Optional)' })}</label>
              <input
                type="text"
                maxLength={15}
                value={businessForm.gstin}
                onChange={(e) => setBusinessForm({ ...businessForm, gstin: e.target.value.toUpperCase() })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase"
                placeholder="27AAAAA0000A1Z5"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#fafcf8] rounded-2xl border border-[#e8eddb] space-y-2">
                <label className="block font-bold text-gray-800">{t('transporterVerification.gstCert', { defaultValue: 'GST Certificate (Optional)' })}</label>
                <SecureFileUpload
                  category="VERIFICATION"
                  subCategory="GST"
                  documentType="GST_CERT"
                  existingFile={businessForm.gstDocUrl}
                  onSuccess={(fileData) => {
                    setBusinessForm((prev) => ({ ...prev, gstDocUrl: fileData.secureUrl }));
                    toast.success('GST Certificate uploaded.');
                  }}
                  onFileRemove={() => {
                    setBusinessForm((prev) => ({ ...prev, gstDocUrl: '' }));
                  }}
                />
              </div>

              <div className="p-4 bg-[#fafcf8] rounded-2xl border border-[#e8eddb] space-y-2">
                <label className="block font-bold text-gray-800">{t('transporterVerification.regCert', { defaultValue: 'Business Registration / Incorporation Certificate' })}</label>
                <SecureFileUpload
                  category="VERIFICATION"
                  subCategory="REGISTRATION"
                  documentType="REGISTRATION_CERT"
                  existingFile={businessForm.regCertDocUrl}
                  onSuccess={(fileData) => {
                    setBusinessForm((prev) => ({ ...prev, regCertDocUrl: fileData.secureUrl }));
                    toast.success('Registration Certificate uploaded.');
                  }}
                  onFileRemove={() => {
                    setBusinessForm((prev) => ({ ...prev, regCertDocUrl: '' }));
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> {t('common.back', { defaultValue: 'Back' })}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSkipStep('businessRegistration', 4)}
                  className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs"
                >
                  {t('transporterVerification.skipStep', { defaultValue: 'Skip Step' })}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl transition font-display flex items-center gap-2"
                >
                  <span>{submitting ? t('common.saving', { defaultValue: 'Saving...' }) : t('transporterVerification.saveContinue', { defaultValue: 'Save & Continue' })}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 4: Bank Account Verification */}
        {currentStep === 4 && (
          <form onSubmit={handleSaveBank} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.accountHolderName', { defaultValue: 'Account Holder Name *' })}</label>
              <input
                type="text"
                required
                value={bankForm.accountHolderName}
                onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.accountNumber', { defaultValue: 'Bank Account Number *' })}</label>
                <input
                  type="password"
                  required
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.confirmAccountNumber', { defaultValue: 'Confirm Bank Account Number *' })}</label>
                <input
                  type="text"
                  required
                  value={bankForm.confirmAccountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, confirmAccountNumber: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.ifsc', { defaultValue: 'IFSC Code *' })}</label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  value={bankForm.ifsc}
                  onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold uppercase"
                  placeholder="SBIN0001234"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.bankName', { defaultValue: 'Bank Name *' })}</label>
                <input
                  type="text"
                  required
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div className="p-4 bg-[#fafcf8] rounded-2xl border border-[#e8eddb] space-y-2">
              <label className="block font-bold text-gray-800">{t('transporterVerification.cancelledCheque', { defaultValue: 'Upload Cancelled Cheque / Bank Passbook Proof' })}</label>
              <SecureFileUpload
                category="VERIFICATION"
                subCategory="BANK"
                documentType="CANCELLED_CHEQUE"
                existingFile={bankForm.cancelledChequeDocUrl}
                onSuccess={(fileData) => {
                  setBankForm((prev) => ({ ...prev, cancelledChequeDocUrl: fileData.secureUrl }));
                  toast.success('Bank proof document uploaded.');
                }}
                onFileRemove={() => {
                  setBankForm((prev) => ({ ...prev, cancelledChequeDocUrl: '' }));
                }}
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> {t('common.back', { defaultValue: 'Back' })}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl transition font-display flex items-center gap-2"
              >
                <span>{submitting ? t('common.saving', { defaultValue: 'Saving...' }) : t('transporterVerification.saveContinue', { defaultValue: 'Save & Continue' })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Vehicle Verification (Multi-Vehicle Manager) */}
        {currentStep === 5 && (
          <div className="space-y-6 text-xs font-sans">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-[#001e2b] font-display">
                  {t('transporterVerification.fleetList', { defaultValue: 'Registered Vehicle Fleet' })}
                </h3>
                <p className="text-gray-500 font-sans">{t('transporterVerification.fleetSub', { defaultValue: 'Add one or more commercial vehicles to your transporter fleet.' })}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowVehicleModal(true)}
                className="px-4 py-2 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl flex items-center gap-1.5 transition font-display"
              >
                <Plus className="w-4 h-4" />
                <span>{t('transporterVerification.addVehicleBtn', { defaultValue: 'Add Vehicle' })}</span>
              </button>
            </div>

            {vehicles.length === 0 ? (
              <div className="text-center py-10 bg-[#fafcf8] rounded-2xl border border-dashed border-[#e8eddb] space-y-2">
                <Truck className="w-10 h-10 text-gray-400 mx-auto" />
                <p className="font-bold text-gray-600">{t('transporterVerification.noVehiclesAdded', { defaultValue: 'No vehicles added yet.' })}</p>
                <p className="text-gray-400 text-xs">{t('transporterVerification.clickAddVehicle', { defaultValue: 'Click "Add Vehicle" to add RC, Insurance, and permit docs.' })}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((v) => (
                  <div key={v._id || v.registrationNumber} className="p-4 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl space-y-2 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-black text-sm text-[#001e2b] bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                          {v.registrationNumber}
                        </span>
                        <p className="font-bold text-[#00684a] mt-1.5 font-display">{v.vehicleType}</p>
                        <p className="text-gray-500 text-xs font-sans">{v.makeModel} · Capacity: {v.capacityKg} KG</p>
                      </div>

                      <button
                        onClick={() => handleDeleteVehicle(v._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> {t('common.back', { defaultValue: 'Back' })}
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="px-6 py-3 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl transition font-display flex items-center gap-2"
              >
                <span>{t('transporterVerification.continueToDrivers', { defaultValue: 'Continue to Driver Verification' })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Driver Verification (Multi-Driver Manager) */}
        {currentStep === 6 && (
          <div className="space-y-6 text-xs font-sans">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-[#001e2b] font-display">
                  {t('transporterVerification.driverRoster', { defaultValue: 'Registered Drivers Roster' })}
                </h3>
                <p className="text-gray-500 font-sans">{t('transporterVerification.driverSub', { defaultValue: 'Add drivers and assign them to your fleet vehicles (Optional).' })}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowDriverModal(true)}
                className="px-4 py-2 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl flex items-center gap-1.5 transition font-display"
              >
                <Plus className="w-4 h-4" />
                <span>{t('transporterVerification.addDriverBtn', { defaultValue: 'Add Driver' })}</span>
              </button>
            </div>

            {drivers.length === 0 ? (
              <div className="text-center py-10 bg-[#fafcf8] rounded-2xl border border-dashed border-[#e8eddb] space-y-2">
                <Users className="w-10 h-10 text-gray-400 mx-auto" />
                <p className="font-bold text-gray-600">{t('transporterVerification.noDriversAdded', { defaultValue: 'No drivers added yet.' })}</p>
                <p className="text-gray-400 text-xs">{t('transporterVerification.clickAddDriver', { defaultValue: 'Click "Add Driver" to enter driving license details.' })}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drivers.map((d) => (
                  <div key={d._id || d.licenseNumber} className="p-4 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl space-y-2 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#001e2b] font-display">{d.driverName}</h4>
                        <p className="font-mono text-xs text-gray-600">Lic: {d.licenseNumber} (Exp: {d.licenseExpiry || 'N/A'})</p>
                        <p className="text-xs text-[#00684a] font-bold mt-1">Vehicle: {d.assignedVehicleNumber || 'Unassigned'}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteDriver(d._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> {t('common.back', { defaultValue: 'Back' })}
              </button>

              <button
                type="button"
                onClick={handleSubmitFinal}
                disabled={submitting}
                className="px-8 py-3.5 bg-[#00ed64] hover:bg-[#00c853] text-[#001e2b] font-black text-sm rounded-2xl transition shadow-lg font-display flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{submitting ? t('common.submitting', { defaultValue: 'Submitting...' }) : t('transporterVerification.submitForReview', { defaultValue: 'Submit Verification for Admin Review' })}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD VEHICLE */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-[#e8eddb] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#001e2b] font-display">
                {t('transporterVerification.addVehicleModalTitle', { defaultValue: 'Add Vehicle to Fleet' })}
              </h3>
              <button onClick={() => setShowVehicleModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.vehicleRegNumber', { defaultValue: 'Registration Number (RC Number) *' })}</label>
                <input
                  type="text"
                  required
                  value={vehicleForm.registrationNumber}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase font-bold text-base"
                  placeholder="MH-12-AB-1234"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.vehicleType', { defaultValue: 'Vehicle Type *' })}</label>
                <select
                  value={vehicleForm.vehicleType}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                >
                  {VEHICLE_TYPES.map((vt) => (
                    <option key={vt} value={vt}>{vt}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.makeModel', { defaultValue: 'Make / Model' })}</label>
                  <input
                    type="text"
                    value={vehicleForm.makeModel}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, makeModel: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                    placeholder="Tata Ace / Eicher 2049"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.capacityKg', { defaultValue: 'Payload Capacity (KG)' })}</label>
                  <input
                    type="number"
                    value={vehicleForm.capacityKg}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, capacityKg: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block font-bold text-gray-800">{t('transporterVerification.rcUpload', { defaultValue: 'Upload Vehicle RC Certificate' })}</label>
                <SecureFileUpload
                  category="VERIFICATION"
                  subCategory="VEHICLE_RC"
                  documentType="VEHICLE_RC"
                  existingFile={vehicleForm.rcDocUrl}
                  onSuccess={(fileData) => {
                    setVehicleForm((prev) => ({ ...prev, rcDocUrl: fileData.secureUrl }));
                    toast.success('RC Document uploaded.');
                  }}
                  onFileRemove={() => {
                    setVehicleForm((prev) => ({ ...prev, rcDocUrl: '' }));
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="w-full py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl"
                >
                  {t('common.cancel', { defaultValue: 'Cancel' })}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl transition font-display"
                >
                  {submitting ? t('common.saving', { defaultValue: 'Saving...' }) : t('transporterVerification.addVehicleBtn', { defaultValue: 'Add Vehicle' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DRIVER */}
      {showDriverModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-[#e8eddb] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#001e2b] font-display">
                {t('transporterVerification.addDriverModalTitle', { defaultValue: 'Add Driver to Roster' })}
              </h3>
              <button onClick={() => setShowDriverModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.driverName', { defaultValue: 'Driver Full Name *' })}</label>
                <input
                  type="text"
                  required
                  value={driverForm.driverName}
                  onChange={(e) => setDriverForm({ ...driverForm, driverName: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.driverMobile', { defaultValue: 'Mobile Number' })}</label>
                  <input
                    type="text"
                    value={driverForm.mobileNumber}
                    onChange={(e) => setDriverForm({ ...driverForm, mobileNumber: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.licenseNumber', { defaultValue: 'Driving License No *' })}</label>
                  <input
                    type="text"
                    required
                    value={driverForm.licenseNumber}
                    onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono uppercase font-bold"
                    placeholder="MH1220190012345"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.licenseExpiry', { defaultValue: 'License Expiry Date' })}</label>
                  <input
                    type="date"
                    value={driverForm.licenseExpiry}
                    onChange={(e) => setDriverForm({ ...driverForm, licenseExpiry: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('transporterVerification.assignedVehicle', { defaultValue: 'Assigned Vehicle' })}</label>
                  <select
                    value={driverForm.assignedVehicleNumber}
                    onChange={(e) => setDriverForm({ ...driverForm, assignedVehicleNumber: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="">-- Select Vehicle --</option>
                    {vehicles.map((v) => (
                      <option key={v.registrationNumber} value={v.registrationNumber}>
                        {v.registrationNumber} ({v.vehicleType})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block font-bold text-gray-800">{t('transporterVerification.licenseUpload', { defaultValue: 'Upload Driving License Document' })}</label>
                <SecureFileUpload
                  category="VERIFICATION"
                  subCategory="DRIVER_LICENSE"
                  documentType="DRIVER_LICENSE"
                  existingFile={driverForm.licenseDocUrl}
                  onSuccess={(fileData) => {
                    setDriverForm((prev) => ({ ...prev, licenseDocUrl: fileData.secureUrl }));
                    toast.success('Driver License uploaded.');
                  }}
                  onFileRemove={() => {
                    setDriverForm((prev) => ({ ...prev, licenseDocUrl: '' }));
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowDriverModal(false)}
                  className="w-full py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl"
                >
                  {t('common.cancel', { defaultValue: 'Cancel' })}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl transition font-display"
                >
                  {submitting ? t('common.saving', { defaultValue: 'Saving...' }) : t('transporterVerification.addDriverBtn', { defaultValue: 'Add Driver' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
