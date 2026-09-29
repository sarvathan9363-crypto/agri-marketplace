import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Leaf,
  Tractor,
  ShoppingBag,
  Truck,
  Mail,
  Lock,
  Phone,
  User,
  MapPin,
  Eye,
  EyeOff,
  Building,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import heroBg from '../assets/ChatGPT Image Sep 29, 2026, 11_51_33 AM.png';

export default function Register() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [step, setStep] = useState('select'); // select, farmer, buyer, transporter, farmer_verification_prompt, buyer_verification_prompt
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerFarmer, registerBuyer, registerTransporter } = useAuth();
  const navigate = useNavigate();

  const [farmerForm, setFarmerForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmerType: 'FARMER',
    location: '',
    address: '',
  });

  const [buyerForm, setBuyerForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    buyerType: 'INDIVIDUAL',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [transporterForm, setTransporterForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    vehicleType: 'Refrigerated LCV (3.5T)',
    vehicleNumber: '',
    operatingStates: '',
  });

  const handleTransporterSubmit = async (e) => {
    e.preventDefault();
    const tr = transporterForm;
    if (!tr.fullName || !tr.email || !tr.mobileNumber || !tr.password) {
      toast.error(t('auth.fillAllRequired', { defaultValue: 'Please fill all required fields.' }));
      return;
    }
    if (tr.password !== tr.confirmPassword) {
      toast.error(t('auth.passwordsDoNotMatch', { defaultValue: 'Passwords do not match.' }));
      return;
    }
    if (tr.password.length < 6) {
      toast.error(t('auth.passwordMinLength', { defaultValue: 'Password must be at least 6 characters.' }));
      return;
    }
    setLoading(true);
    try {
      await registerTransporter(tr);
      toast.success(t('transport.profileUpdated', { defaultValue: 'Transporter account created successfully!' }));
      navigate('/transporter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || t('auth.registrationFailed', { defaultValue: 'Registration failed.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleFarmerSubmit = async (e) => {
    e.preventDefault();
    const f = farmerForm;
    if (!f.fullName || !f.email || !f.mobileNumber || !f.password || !f.farmName || !f.location) {
      toast.error(t('auth.fillAllRequired', { defaultValue: 'Please fill all required fields.' }));
      return;
    }
    if (f.password !== f.confirmPassword) {
      toast.error(t('auth.passwordsDoNotMatch', { defaultValue: 'Passwords do not match.' }));
      return;
    }
    if (f.password.length < 6) {
      toast.error(t('auth.passwordMinLength', { defaultValue: 'Password must be at least 6 characters.' }));
      return;
    }
    setLoading(true);
    try {
      await registerFarmer(f);
      toast.success(t('auth.registrationSuccess', { defaultValue: 'Farmer account created successfully!' }));
      setStep('farmer_verification_prompt');
    } catch (err) {
      toast.error(err.response?.data?.message || t('auth.registrationFailed', { defaultValue: 'Registration failed.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleBuyerSubmit = async (e) => {
    e.preventDefault();
    const b = buyerForm;
    if (!b.fullName || !b.email || !b.mobileNumber || !b.password) {
      toast.error(t('auth.fillAllRequired', { defaultValue: 'Please fill all required fields.' }));
      return;
    }
    if (b.password !== b.confirmPassword) {
      toast.error(t('auth.passwordsDoNotMatch', { defaultValue: 'Passwords do not match.' }));
      return;
    }
    if (b.password.length < 6) {
      toast.error(t('auth.passwordMinLength', { defaultValue: 'Password must be at least 6 characters.' }));
      return;
    }
    setLoading(true);
    try {
      await registerBuyer(b);
      toast.success(t('auth.registrationSuccess', { defaultValue: 'Account Created Successfully!' }));
      setStep('buyer_verification_prompt');
    } catch (err) {
      toast.error(err.response?.data?.message || t('auth.registrationFailed', { defaultValue: 'Registration failed.' }));
    } finally {
      setLoading(false);
    }
  };

  // Reusable Input styling helper
  const inputClass = `w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm font-medium transition-all focus:outline-none ${
    isDark
      ? 'bg-[#031A1E]/90 border border-[#00E676]/30 text-white placeholder:text-emerald-200/30 focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/20'
      : 'bg-slate-50 border border-slate-200 text-[#082B36] placeholder:text-slate-400 focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/15'
  }`;

  const labelClass = `block text-[11px] font-extrabold uppercase tracking-wider mb-2 ${
    isDark ? 'text-emerald-300' : 'text-[#082B36]'
  }`;

  const iconClass = `absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
    isDark ? 'text-emerald-400/60' : 'text-slate-400'
  }`;

  // ==================== PROMPT STEPS ====================
  if (step === 'farmer_verification_prompt') {
    const isFpoReg = farmerForm.farmerType === 'FPO';
    const onboardingPath = isFpoReg ? '/fpo/verification/onboarding' : '/farmer/verification/wizard';
    const badgeText = isFpoReg
      ? t('farmerVerification.verifiedFpoBadge', { defaultValue: '✓ VERIFIED FPO' })
      : t('farmerVerification.verifiedFarmerBadge', { defaultValue: '✓ VERIFIED FARMER' });
    const regTitle = isFpoReg
      ? t('register.completeFpoVerification', { defaultValue: 'Complete Your FPO Verification' })
      : t('register.completeFarmerVerification', { defaultValue: 'Complete Your Farmer Verification' });

    return (
      <div className={`min-h-[calc(100vh-var(--app-header-height))] flex items-center justify-center p-4 py-12 ${
        isDark ? 'bg-[#03151A] text-white' : 'bg-[#F4F7F2] text-[#082B36]'
      }`}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center">
          <div className={`rounded-3xl p-8 shadow-2xl space-y-6 ${
            isDark ? 'bg-[#052B29]/90 border border-[#00E676]/30' : 'bg-white border border-emerald-950/10'
          }`}>
            <div className="w-16 h-16 bg-[#00E676]/20 text-[#00E676] rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-[#00E676]/20 text-[#00E676] text-xs font-black rounded-full mb-2 tracking-wider">
                {badgeText}
              </span>
              <h2 className="text-2xl font-black">{regTitle}</h2>
              <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-emerald-100/70' : 'text-slate-600'}`}>
                {t('register.verifyIdentityDescription', {
                  defaultValue: 'To list commodities and receive buyers, complete your official identity verification.',
                })}
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => navigate(onboardingPath)}
                className="w-full py-4 bg-[#00E676] hover:bg-[#00c853] text-[#03151A] font-extrabold text-sm rounded-2xl shadow-lg shadow-[#00E676]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('register.startVerificationBtn', { defaultValue: 'Start Verification Now →' })}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/farmer/dashboard')}
                className={`w-full py-3.5 border rounded-2xl text-xs font-bold transition-colors ${
                  isDark ? 'border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/30' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t('register.skipForNowBtn', { defaultValue: 'Skip for Now' })}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'buyer_verification_prompt') {
    return (
      <div className={`min-h-[calc(100vh-var(--app-header-height))] flex items-center justify-center p-4 py-12 ${
        isDark ? 'bg-[#03151A] text-white' : 'bg-[#F4F7F2] text-[#082B36]'
      }`}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center">
          <div className={`rounded-3xl p-8 shadow-2xl space-y-6 ${
            isDark ? 'bg-[#052B29]/90 border border-[#00E676]/30' : 'bg-white border border-emerald-950/10'
          }`}>
            <div className="w-16 h-16 bg-[#00E676]/20 text-[#00E676] rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-[#00E676]/20 text-[#00E676] text-xs font-black rounded-full mb-2 tracking-wider">
                {t('buyerVerification.verifiedBuyerBadge', { defaultValue: '✓ VERIFIED BUYER' })}
              </span>
              <h2 className="text-2xl font-black">{t('register.completeBuyerVerificationTitle', { defaultValue: 'Complete Buyer Verification' })}</h2>
              <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-emerald-100/70' : 'text-slate-600'}`}>
                {t('register.verifyBuyerDescription', { defaultValue: 'Unlock bulk ordering limits and direct FPO negotiations by completing verification.' })}
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => navigate('/buyer/verification/wizard')}
                className="w-full py-4 bg-[#00E676] hover:bg-[#00c853] text-[#03151A] font-extrabold text-sm rounded-2xl shadow-lg shadow-[#00E676]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('register.startBuyerVerificationBtn', { defaultValue: 'Verify Business Now →' })}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/buyer/dashboard')}
                className={`w-full py-3.5 border rounded-2xl text-xs font-bold transition-colors ${
                  isDark ? 'border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/30' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t('register.skipForNowBtn', { defaultValue: 'Skip for Now' })}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==================== SPLIT SCREEN WRAPPER ====================
  return (
    <div className={`min-h-[calc(100vh-var(--app-header-height))] transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 lg:p-10 ${
      isDark ? 'bg-[#03151A] text-white' : 'bg-[#F4F7F2] text-[#082B36]'
    }`}>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ==================== LEFT HERO COLUMN ==================== */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 relative h-[500px] lg:h-[720px] rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col justify-between p-8 sm:p-12 border border-[#00E676]/20"
        >
          {/* Background Image & Overlay */}
          <img
            src={heroBg}
            alt="AgriBazaar Agriculture landscape"
            className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#03151A] via-[#03151A]/40 to-black/30" />
          <div className="absolute inset-0 bg-[#00E676]/10 mix-blend-overlay pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-[#00E676] text-[#03151A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00E676]/30">
              <Leaf className="w-7 h-7" />
            </div>
            <span className="text-3xl font-black text-white tracking-tight drop-shadow-md">
              {t('auth.agri', 'Agri')}<span className="text-[#00E676]">{t('auth.bazaar', 'Bazaar')}</span>
            </span>
          </div>

          {/* Center Hero Text */}
          <div className="relative z-10 my-auto max-w-lg">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg tracking-tight">
              {t('registerHero.heroTitle', "Join India's Most Trusted Digital")}{' '}
              <span className="text-[#00E676] block mt-1 drop-shadow-[0_4px_25px_rgba(0,230,118,0.4)]">
                {t('registerHero.heroHighlight', 'Agri Marketplace')}
              </span>
            </h1>
          </div>

          {/* Bottom 3 Benefit Badges */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/15">
            <div className="bg-[#03151A]/80 backdrop-blur-md border border-[#00E676]/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center shrink-0">
                <Tractor className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">
                {t('registerHero.benefit1', 'Direct Farm Sourcing')}
              </span>
            </div>

            <div className="bg-[#03151A]/80 backdrop-blur-md border border-[#00E676]/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">
                {t('registerHero.benefit2', '100% Verified Quality')}
              </span>
            </div>

            <div className="bg-[#03151A]/80 backdrop-blur-md border border-[#00E676]/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">
                {t('registerHero.benefit3', 'Transparent Settlement')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ==================== RIGHT REGISTER FORM / ROLE SELECTION COLUMN ==================== */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-6 flex flex-col justify-center"
        >
          <div
            className={`rounded-[2.5rem] p-6 sm:p-9 transition-all duration-300 max-h-[720px] overflow-y-auto ${
              isDark
                ? 'bg-[#052B29]/80 backdrop-blur-2xl border border-[#00E676]/25 shadow-[0_20px_60px_-15px_rgba(0,230,118,0.15)] text-white'
                : 'bg-white/95 backdrop-blur-2xl border border-emerald-950/10 shadow-2xl text-[#082B36]'
            }`}
          >

            {/* STEP 1: ROLE SELECTION */}
            {step === 'select' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-[#00E676] text-[#03151A] rounded-2xl shadow-lg shadow-[#00E676]/30 mb-3">
                    <Leaf className="w-8 h-8" />
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#082B36]'}`}>
                    {t('register.joinAgribazaar', 'Join AgriBazaar')}
                  </h2>
                  <p className={`mt-1.5 text-xs sm:text-sm font-semibold ${isDark ? 'text-emerald-200/70' : 'text-slate-500'}`}>
                    {t('register.selectYourAccountTypeToGet', 'Select your account type to get started')}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* FARMER CARD */}
                  <button
                    type="button"
                    onClick={() => setStep('farmer')}
                    className={`rounded-2xl p-5 text-left transition-all border group flex items-start gap-4 cursor-pointer ${
                      isDark
                        ? 'bg-[#031A1E]/80 border-[#00E676]/30 hover:border-[#00E676] hover:bg-[#031A1E]'
                        : 'bg-slate-50 border-slate-200 hover:border-[#00E676] hover:bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#00E676]/20 text-[#00E676] group-hover:bg-[#00E676] group-hover:text-[#03151A] flex items-center justify-center shrink-0 transition-colors">
                      <Tractor className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-[#082B36]'}`}>
                        {t('register.farmerFpo', 'Farmer / FPO')}
                      </h3>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-emerald-100/70' : 'text-slate-500'}`}>
                        {t('register.sellYourProduceDirectlyToBuyers', 'Sell your produce directly to buyers at fair market prices.')}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#00E676] group-hover:underline">
                        {t('auth.registerAsFarmerBtn', 'Register as Farmer →')}
                      </span>
                    </div>
                  </button>

                  {/* BUYER CARD */}
                  <button
                    type="button"
                    onClick={() => setStep('buyer')}
                    className={`rounded-2xl p-5 text-left transition-all border group flex items-start gap-4 cursor-pointer ${
                      isDark
                        ? 'bg-[#031A1E]/80 border-[#00E676]/30 hover:border-[#00E676] hover:bg-[#031A1E]'
                        : 'bg-slate-50 border-slate-200 hover:border-[#00E676] hover:bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#00E676]/20 text-[#00E676] group-hover:bg-[#00E676] group-hover:text-[#03151A] flex items-center justify-center shrink-0 transition-colors">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-[#082B36]'}`}>
                        {t('register.buyer', 'Buyer / Wholesale Retailer')}
                      </h3>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-emerald-100/70' : 'text-slate-500'}`}>
                        {t('register.sourceFreshAgriculturalProduceDirectlyFrom', 'Source fresh produce directly from verified farmers.')}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#00E676] group-hover:underline">
                        {t('auth.registerAsBuyerBtn', 'Register as Buyer →')}
                      </span>
                    </div>
                  </button>

                  {/* TRANSPORTER CARD */}
                  <button
                    type="button"
                    onClick={() => setStep('transporter')}
                    className={`rounded-2xl p-5 text-left transition-all border group flex items-start gap-4 cursor-pointer ${
                      isDark
                        ? 'bg-[#031A1E]/80 border-[#00E676]/30 hover:border-[#00E676] hover:bg-[#031A1E]'
                        : 'bg-slate-50 border-slate-200 hover:border-[#00E676] hover:bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#00E676]/20 text-[#00E676] group-hover:bg-[#00E676] group-hover:text-[#03151A] flex items-center justify-center shrink-0 transition-colors">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-[#082B36]'}`}>
                        {t('roles.transporter', 'Transporter / Logistics Partner')}
                      </h3>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-emerald-100/70' : 'text-slate-500'}`}>
                        {t('register.transporterDesc', 'Manage agricultural freight requests and track crop shipments.')}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#00E676] group-hover:underline">
                        {t('auth.registerAsTransporterBtn', 'Register as Transporter →')}
                      </span>
                    </div>
                  </button>
                </div>

                <div className="mt-6 text-center text-xs sm:text-sm">
                  <span className={isDark ? 'text-emerald-100/60' : 'text-slate-500'}>
                    {t('auth.alreadyHaveAccount', 'Already have an account?')}{' '}
                  </span>
                  <Link to="/login" className="font-extrabold text-[#00E676] hover:underline">
                    {t('register.signIn', 'Sign In')}
                  </Link>
                </div>
              </div>
            )}

            {/* STEP 2: FARMER REGISTRATION FORM */}
            {step === 'farmer' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('select')}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00E676] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t('registerHero.backToRoles', 'Back to role selection')}
                  </button>
                  <span className="text-xs font-extrabold px-3 py-1 bg-[#00E676]/20 text-[#00E676] rounded-full">
                    {t('register.farmerFpo', 'Farmer')}
                  </span>
                </div>

                <div>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#082B36]'}`}>
                    {t('register.farmerRegistration', 'Farmer Registration')}
                  </h2>
                  <p className={`text-xs mt-1 ${isDark ? 'text-emerald-200/70' : 'text-slate-500'}`}>
                    {t('register.createYourSellerProfileToList', 'Create seller profile to list crops')}
                  </p>
                </div>

                <form onSubmit={handleFarmerSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>{t('auth.fullNameLabel', 'Full Name *')}</label>
                    <div className="relative">
                      <User className={iconClass} />
                      <input
                        type="text"
                        required
                        placeholder={t('auth.placeholderFullName', 'Enter full name')}
                        value={farmerForm.fullName}
                        onChange={(e) => setFarmerForm({ ...farmerForm, fullName: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t('auth.emailAddressLabel', 'Email Address *')}</label>
                      <div className="relative">
                        <Mail className={iconClass} />
                        <input
                          type="email"
                          required
                          placeholder="farmer@example.com"
                          value={farmerForm.email}
                          onChange={(e) => setFarmerForm({ ...farmerForm, email: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{t('auth.mobileNumberLabel', 'Mobile Number *')}</label>
                      <div className="relative">
                        <Phone className={iconClass} />
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={farmerForm.mobileNumber}
                          onChange={(e) => setFarmerForm({ ...farmerForm, mobileNumber: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t('auth.passwordLabel', 'Password *')}</label>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input
                          type={showPass ? 'text' : 'password'}
                          required
                          placeholder={t('auth.placeholderMinChars', 'At least 6 chars')}
                          value={farmerForm.password}
                          onChange={(e) => setFarmerForm({ ...farmerForm, password: e.target.value })}
                          className={`${inputClass} pr-12`}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{t('auth.confirmPasswordLabel', 'Confirm Password *')}</label>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input
                          type={showPass ? 'text' : 'password'}
                          required
                          placeholder={t('auth.placeholderReEnterPassword', 'Re-enter password')}
                          value={farmerForm.confirmPassword}
                          onChange={(e) => setFarmerForm({ ...farmerForm, confirmPassword: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t('auth.farmOrgNameLabel', 'Farm / Org Name *')}</label>
                      <div className="relative">
                        <Building className={iconClass} />
                        <input
                          type="text"
                          required
                          placeholder={t('auth.placeholderFarmName', 'e.g. Krishna Organic Farm')}
                          value={farmerForm.farmName}
                          onChange={(e) => setFarmerForm({ ...farmerForm, farmName: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{t('auth.sellerTypeLabel', 'Seller Type *')}</label>
                      <select
                        value={farmerForm.farmerType}
                        onChange={(e) => setFarmerForm({ ...farmerForm, farmerType: e.target.value })}
                        className={inputClass}
                      >
                        <option value="FARMER">{t('register.individualFarmer', 'Individual Farmer')}</option>
                        <option value="FPO">{t('register.farmerProducerOrganizationFpo', 'Farmer Producer Organization (FPO)')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>{t('auth.locationLabel', 'Location (District, State) *')}</label>
                    <div className="relative">
                      <MapPin className={iconClass} />
                      <input
                        type="text"
                        required
                        placeholder={t('auth.placeholderLocation', 'e.g. Nashik, Maharashtra')}
                        value={farmerForm.location}
                        onChange={(e) => setFarmerForm({ ...farmerForm, location: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-[#00E676] hover:bg-[#00c853] text-[#03151A] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#00E676]/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? t('auth.creatingAccount', 'Creating Account...') : t('auth.registerAsFarmer', 'Register as Farmer')}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 3: BUYER REGISTRATION FORM */}
            {step === 'buyer' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('select')}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00E676] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t('registerHero.backToRoles', 'Back to role selection')}
                  </button>
                  <span className="text-xs font-extrabold px-3 py-1 bg-[#00E676]/20 text-[#00E676] rounded-full">
                    {t('register.buyer', 'Buyer')}
                  </span>
                </div>

                <div>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#082B36]'}`}>
                    {t('register.buyerRegistration', 'Buyer Registration')}
                  </h2>
                  <p className={`text-xs mt-1 ${isDark ? 'text-emerald-200/70' : 'text-slate-500'}`}>
                    {t('register.createYourAccountToPurchaseProduce', 'Create account to purchase produce')}
                  </p>
                </div>

                <form onSubmit={handleBuyerSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>{t('auth.fullNameLabel', 'Full Name *')}</label>
                    <div className="relative">
                      <User className={iconClass} />
                      <input
                        type="text"
                        required
                        placeholder={t('auth.placeholderFullName', 'Enter full name')}
                        value={buyerForm.fullName}
                        onChange={(e) => setBuyerForm({ ...buyerForm, fullName: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t('auth.emailAddressLabel', 'Email Address *')}</label>
                      <div className="relative">
                        <Mail className={iconClass} />
                        <input
                          type="email"
                          required
                          placeholder="buyer@example.com"
                          value={buyerForm.email}
                          onChange={(e) => setBuyerForm({ ...buyerForm, email: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{t('auth.mobileNumberLabel', 'Mobile Number *')}</label>
                      <div className="relative">
                        <Phone className={iconClass} />
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={buyerForm.mobileNumber}
                          onChange={(e) => setBuyerForm({ ...buyerForm, mobileNumber: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t('auth.passwordLabel', 'Password *')}</label>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input
                          type={showPass ? 'text' : 'password'}
                          required
                          placeholder={t('auth.placeholderMinChars', 'At least 6 chars')}
                          value={buyerForm.password}
                          onChange={(e) => setBuyerForm({ ...buyerForm, password: e.target.value })}
                          className={`${inputClass} pr-12`}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{t('auth.confirmPasswordLabel', 'Confirm Password *')}</label>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input
                          type={showPass ? 'text' : 'password'}
                          required
                          placeholder={t('auth.placeholderReEnterPassword', 'Re-enter password')}
                          value={buyerForm.confirmPassword}
                          onChange={(e) => setBuyerForm({ ...buyerForm, confirmPassword: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>{t('auth.buyerTypeLabel', 'Buyer Type *')}</label>
                    <select
                      value={buyerForm.buyerType}
                      onChange={(e) => setBuyerForm({ ...buyerForm, buyerType: e.target.value })}
                      className={inputClass}
                    >
                      <option value="INDIVIDUAL">{t('register.individualBuyer', 'Individual Consumer / Retail Buyer')}</option>
                      <option value="BUSINESS">{t('register.businessWholesaleBuyer', 'Business / Wholesale Retailer / Processor')}</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-[#00E676] hover:bg-[#00c853] text-[#03151A] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#00E676]/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? t('auth.creatingAccount', 'Creating Account...') : t('auth.registerAsBuyer', 'Register as Buyer')}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 4: TRANSPORTER REGISTRATION FORM */}
            {step === 'transporter' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('select')}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00E676] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> {t('registerHero.backToRoles', 'Back to role selection')}
                  </button>
                  <span className="text-xs font-extrabold px-3 py-1 bg-[#00E676]/20 text-[#00E676] rounded-full">
                    {t('roles.transporter', 'Transporter')}
                  </span>
                </div>

                <div>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#082B36]'}`}>
                    {t('auth.transporterRegistration', 'Transporter Registration')}
                  </h2>
                  <p className={`text-xs mt-1 ${isDark ? 'text-emerald-200/70' : 'text-slate-500'}`}>
                    {t('register.createTransporterProfile', 'Register freight carrier vehicle fleet')}
                  </p>
                </div>

                <form onSubmit={handleTransporterSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>{t('auth.fullNameLabel', 'Full Name *')}</label>
                    <div className="relative">
                      <User className={iconClass} />
                      <input
                        type="text"
                        required
                        placeholder={t('auth.placeholderFullName', 'Enter full name')}
                        value={transporterForm.fullName}
                        onChange={(e) => setTransporterForm({ ...transporterForm, fullName: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t('auth.emailAddressLabel', 'Email Address *')}</label>
                      <div className="relative">
                        <Mail className={iconClass} />
                        <input
                          type="email"
                          required
                          placeholder="transporter@example.com"
                          value={transporterForm.email}
                          onChange={(e) => setTransporterForm({ ...transporterForm, email: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{t('auth.mobileNumberLabel', 'Mobile Number *')}</label>
                      <div className="relative">
                        <Phone className={iconClass} />
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={transporterForm.mobileNumber}
                          onChange={(e) => setTransporterForm({ ...transporterForm, mobileNumber: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t('auth.passwordLabel', 'Password *')}</label>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input
                          type={showPass ? 'text' : 'password'}
                          required
                          placeholder={t('auth.placeholderMinChars', 'At least 6 chars')}
                          value={transporterForm.password}
                          onChange={(e) => setTransporterForm({ ...transporterForm, password: e.target.value })}
                          className={`${inputClass} pr-12`}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{t('auth.confirmPasswordLabel', 'Confirm Password *')}</label>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input
                          type={showPass ? 'text' : 'password'}
                          required
                          placeholder={t('auth.placeholderReEnterPassword', 'Re-enter password')}
                          value={transporterForm.confirmPassword}
                          onChange={(e) => setTransporterForm({ ...transporterForm, confirmPassword: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-[#00E676] hover:bg-[#00c853] text-[#03151A] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#00E676]/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? t('auth.creatingAccount', 'Creating Account...') : t('auth.registerAsTransporter', 'Register as Transporter')}
                  </button>
                </form>
              </div>
            )}

          </div>
        </motion.div>

      </div>
    </div>
  );
}
