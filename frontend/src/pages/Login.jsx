import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error(t('auth.requiredFields', { defaultValue: 'Please fill in all fields.' }));
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(t('auth.loginSuccess'));
      if (data.user.role === 'FARMER') navigate('/farmer/dashboard');
      else if (data.user.role === 'BUYER') navigate('/buyer/dashboard');
      else if (data.user.role === 'ADMIN') navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || t('auth.loginFailed', { defaultValue: 'Login failed. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F9F3] flex items-center justify-center p-4 py-16 min-h-[calc(100vh-var(--app-header-height))]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 bg-[#00E676] text-[#002B36] rounded-full flex items-center justify-center shadow-md">
              <Leaf className="w-7 h-7" />
            </div>
            <span className="text-3xl font-black text-[#002B36]">{t('auth.agri')}<span className="text-[#00C853]">{t('auth.bazaar')}</span></span>
          </Link>
          <h1 className="text-3xl font-black text-[#082B36]">{t('auth.welcomeBack')}</h1>
          <p className="mt-1 text-sm text-slate-600 font-medium">{t('navigation.signIn')} AgriBazaar</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E2E8E5] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#082B36] mb-1.5">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder={t('auth.placeholderEmail', { defaultValue: 'you@example.com' })}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2E8E5] rounded-xl text-sm text-[#082B36] focus:outline-none focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/15"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#082B36] mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder={t('auth.placeholderPassword', { defaultValue: 'Enter your password' })}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 bg-white border border-[#E2E8E5] rounded-xl text-sm text-[#082B36] focus:outline-none focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#082B36]"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input type="checkbox" className="rounded border-[#E2E8E5] text-[#00C853] focus:ring-[#00E676]" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-[#00C853] hover:underline">{t('auth.forgotPassword')}</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-agri-primary w-full py-3.5 text-base mt-2 rounded-xl"
            >
              {loading ? t('common.loading') : t('navigation.signIn')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[#00C853] font-bold hover:underline">{t('auth.createAccount')}</Link>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-[#002B36] text-white p-4 rounded-2xl text-center border border-[#E2E8E5]/20 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#00E676] mb-1">{t('auth.demoCredentials')}</p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Admin: <code className="text-[#00E676]">admin@agribazaar.com</code> / admin123<br />
            Farmer: <code className="text-[#00E676]">farmer@agribazaar.com</code> / farmer123<br />
            Buyer: <code className="text-[#00E676]">buyer@agribazaar.com</code> / buyer123
          </p>
        </div>
      </motion.div>
    </div>
  );
}
