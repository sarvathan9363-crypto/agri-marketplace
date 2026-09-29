import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, Users, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import heroBg from '../assets/ChatGPT Image Sep 29, 2026, 11_51_33 AM.png';

export default function Login() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error(t('login.requiredFields', { defaultValue: t('auth.requiredFields', 'Please fill in all fields.') }));
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(t('login.loginSuccess', { defaultValue: t('auth.loginSuccess', 'Logged in successfully') }));
      if (data.user.role === 'FARMER') navigate('/farmer/dashboard');
      else if (data.user.role === 'BUYER') navigate('/buyer/dashboard');
      else if (data.user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (data.user.role === 'TRANSPORTER') navigate('/transporter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || t('login.loginFailed', { defaultValue: t('auth.loginFailed', 'Login failed. Please try again.') }));
    } finally {
      setLoading(false);
    }
  };

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
          className="lg:col-span-7 relative h-[480px] lg:h-[620px] rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col justify-between p-8 sm:p-12 border border-[#00E676]/20"
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
              {t('login.heroTitle', 'Empowering Farmers, Transforming')}{' '}
              <span className="text-[#00E676] block mt-1 drop-shadow-[0_4px_25px_rgba(0,230,118,0.4)]">
                {t('login.heroHighlight', 'Agricultural Trade')}
              </span>
            </h1>
          </div>

          {/* Bottom 3 Benefit Badges */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/15">
            <div className="bg-[#03151A]/80 backdrop-blur-md border border-[#00E676]/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">
                {t('login.benefit1', 'Fair Prices for Farmers')}
              </span>
            </div>

            <div className="bg-[#03151A]/80 backdrop-blur-md border border-[#00E676]/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">
                {t('login.benefit2', 'Fresh & Quality Products')}
              </span>
            </div>

            <div className="bg-[#03151A]/80 backdrop-blur-md border border-[#00E676]/30 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[#00E676]/20 text-[#00E676] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">
                {t('login.benefit3', 'Direct from Farm to You')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ==================== RIGHT LOGIN FORM COLUMN ==================== */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 flex flex-col justify-center"
        >
          <div
            className={`rounded-[2.5rem] p-7 sm:p-10 transition-all duration-300 ${
              isDark
                ? 'bg-[#052B29]/80 backdrop-blur-2xl border border-[#00E676]/25 shadow-[0_20px_60px_-15px_rgba(0,230,118,0.15)] text-white'
                : 'bg-white/95 backdrop-blur-2xl border border-emerald-950/10 shadow-2xl text-[#082B36]'
            }`}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#00E676] text-[#03151A] rounded-2xl shadow-lg shadow-[#00E676]/30 mb-4">
                <Leaf className="w-8 h-8" />
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-[#082B36]'}`}>
                {t('login.welcomeBack', 'Welcome back')}
              </h2>
              <p className={`mt-1.5 text-xs sm:text-sm font-semibold ${isDark ? 'text-emerald-200/70' : 'text-slate-500'}`}>
                {t('login.signInSubtitle', 'Sign in AgriBazaar')}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL FIELD */}
              <div>
                <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-emerald-300' : 'text-[#082B36]'
                }`}>
                  {t('login.email', 'EMAIL')}
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-emerald-400/60' : 'text-slate-400'
                  }`} />
                  <input
                    type="email"
                    required
                    placeholder={t('login.emailPlaceholder', 'you@example.com')}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm font-medium transition-all focus:outline-none ${
                      isDark
                        ? 'bg-[#031A1E]/90 border border-[#00E676]/30 text-white placeholder:text-emerald-200/30 focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/20'
                        : 'bg-slate-50 border border-slate-200 text-[#082B36] placeholder:text-slate-400 focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/15'
                    }`}
                  />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div>
                <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-emerald-300' : 'text-[#082B36]'
                }`}>
                  {t('login.password', 'PASSWORD')}
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-emerald-400/60' : 'text-slate-400'
                  }`} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder={t('login.passwordPlaceholder', 'Enter your password')}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-2xl text-sm font-medium transition-all focus:outline-none ${
                      isDark
                        ? 'bg-[#031A1E]/90 border border-[#00E676]/30 text-white placeholder:text-emerald-200/30 focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/20'
                        : 'bg-slate-50 border border-slate-200 text-[#082B36] placeholder:text-slate-400 focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                      isDark ? 'text-emerald-400/60 hover:text-[#00E676]' : 'text-slate-400 hover:text-[#082B36]'
                    }`}
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME & FORGOT PASSWORD */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className={`flex items-center gap-2 font-semibold cursor-pointer select-none ${
                  isDark ? 'text-emerald-100/80' : 'text-slate-600'
                }`}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#00E676]/40 text-[#00E676] focus:ring-[#00E676] accent-[#00E676]"
                  />
                  {t('login.rememberMe', 'Remember me')}
                </label>
                <Link
                  to="/forgot-password"
                  className="font-bold text-[#00E676] hover:underline transition-all"
                >
                  {t('login.forgotPassword', 'Forgot password?')}
                </Link>
              </div>

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-[#00E676] hover:bg-[#00c853] text-[#03151A] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#00E676]/25 transition-all transform active:scale-98 flex items-center justify-center gap-2 group mt-3 cursor-pointer"
              >
                {loading ? (
                  <span>{t('login.signingIn', 'Signing in...')}</span>
                ) : (
                  <>
                    <span>{t('login.signIn', 'Sign In')}</span>
                    <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* CREATE ACCOUNT LINK */}
            <div className="mt-8 text-center text-xs sm:text-sm">
              <span className={isDark ? 'text-emerald-100/60' : 'text-slate-500'}>
                {t('login.dontHaveAccount', "Don't have an account?")}{' '}
              </span>
              <Link to="/register" className="font-extrabold text-[#00E676] hover:underline">
                {t('login.createAccount', 'Create your account')}
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
