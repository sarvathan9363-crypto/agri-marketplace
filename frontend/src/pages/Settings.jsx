import { useState } from 'react';
import { Bell, Shield, Lock, Smartphone, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Account preferences updated successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Preferences</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Account Settings</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">Manage your system preferences, security, and notification channels.</p>
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
                <h2 className="text-lg font-extrabold text-[#001e2b] font-display">Notification Preferences</h2>
                <p className="text-xs text-gray-500">Configure how AgriBazaar alerts you of orders and stock updates.</p>
              </div>
            </div>

            <div className="space-y-5 divide-y divide-[#f0f4e8]">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-bold text-[#001e2b]">Email Order Notifications</p>
                  <p className="text-xs text-gray-500">Receive emails for new orders and status updates.</p>
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
                  <p className="text-sm font-bold text-[#001e2b]">SMS Notifications</p>
                  <p className="text-xs text-gray-500">Get instant SMS alerts on dispatch and delivery.</p>
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
                  <p className="text-sm font-bold text-[#001e2b]">Market Price Trend Alerts</p>
                  <p className="text-xs text-gray-500">Daily summaries of top agricultural market price shifts.</p>
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
                <h2 className="text-lg font-extrabold text-[#001e2b] font-display">Security & Access</h2>
                <p className="text-xs text-gray-500">Protect your account with extra security layers.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#001e2b]">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-gray-500">Require OTP verification on login.</p>
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
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>

        {/* Info Side Panel */}
        <div className="bg-[#001e2b] text-white rounded-3xl p-8 border border-emerald-900/40 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[#00ed64] text-xs font-black uppercase tracking-widest font-display">AgriBazaar Platform</span>
            <h3 className="text-xl font-extrabold text-white mt-2 font-display">Need Help?</h3>
            <p className="text-sm text-gray-300 mt-2 font-sans leading-relaxed">
              If you need assistance updating your KYC details or farmer verification, contact platform administration.
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-emerald-900/40">
            <p className="text-xs text-gray-400 font-mono">System Version: v1.0.4-production</p>
            <p className="text-xs text-gray-400 font-mono mt-1">Direct Agriculture Commerce Architecture</p>
          </div>
        </div>
      </div>
    </div>
  );
}
