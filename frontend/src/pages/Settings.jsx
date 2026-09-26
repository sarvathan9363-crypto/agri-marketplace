import { useState } from 'react';
import { Bell, Shield, Lock, Smartphone, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success(t('settings.saved'));
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('settings.preferences')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('settings.title')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('settings.description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications Card */}
          <div className="bg-white rounded-3xl border border-[#e8eddb] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#00684a] text-[#00ed64] rounded-2xl flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#001e2b] font-display">{t('settings.notificationPreferences')}</h2>
                <p className="text-xs text-gray-500">{t('settings.notificationDescription')}</p>
              </div>
            </div>

            <div className="space-y-5 divide-y divide-[#f0f4e8]">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-bold text-[#001e2b]">{t('settings.emailOrders')}</p>
                  <p className="text-xs text-gray-500">{t('settings.emailOrdersDescription')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-5 h-5 accent-[#00684a] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-bold text-[#001e2b]">{t('settings.sms')}</p>
                  <p className="text-xs text-gray-500">{t('settings.smsDescription')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-5 h-5 accent-[#00684a] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-bold text-[#001e2b]">{t('settings.priceAlerts')}</p>
                  <p className="text-xs text-gray-500">{t('settings.priceAlertsDescription')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={orderUpdates}
                  onChange={(e) => setOrderUpdates(e.target.checked)}
                  className="w-5 h-5 accent-[#00684a] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-3xl border border-[#e8eddb] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#001e2b] text-[#00ed64] rounded-2xl flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#001e2b] font-display">{t('settings.security')}</h2>
                <p className="text-xs text-gray-500">{t('settings.securityDescription')}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#001e2b]">{t('settings.twoFactor')}</p>
                  <p className="text-xs text-gray-500">{t('settings.twoFactorDescription')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="w-5 h-5 accent-[#00684a] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="btn-mongo-primary text-base px-8 py-3.5"
          >
            <Save className="w-4 h-4" /> {t('settings.save')}
          </button>
        </div>

        {/* Info Side Panel */}
        <div className="bg-[#001e2b] text-white rounded-3xl p-8 border border-emerald-900/40 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[#00ed64] text-xs font-black uppercase tracking-widest font-display">{t('settings.platform')}</span>
            <h3 className="text-xl font-extrabold text-white mt-2 font-display">{t('settings.help')}</h3>
            <p className="text-sm text-gray-300 mt-2 font-sans leading-relaxed">
              {t('settings.helpDescription')}
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-emerald-900/40">
            <p className="text-xs text-gray-400 font-mono">{t('settings.systemVersionV104production')}</p>
            <p className="text-xs text-gray-400 font-mono mt-1">{t('settings.architecture')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
