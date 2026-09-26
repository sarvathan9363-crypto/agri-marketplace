import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import buyerService from '../../services/buyerService';
import Button from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import { Card, LoadingState } from '../../components/ui/Components';
import toast from 'react-hot-toast';
import { translateRole } from '../../utils/enumTranslations';

export default function BuyerProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [buyer, setBuyer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buyerService.getProfile().then(r => { setBuyer(r.buyer); setForm(r.buyer); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await buyerService.updateProfile(form);
      setBuyer(res.buyer);
      setEditing(false);
      toast.success(t('buyerProfile.profileUpdatedToast', { defaultValue: 'Buyer profile updated!' }));
    } catch { toast.error('Failed to update.'); }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('buyerProfile.buyerAccount')}</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('buyerProfile.buyerProfile')}</h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">{t('buyerProfile.manageYourPersonalDetailsAndDefault')}</p>
        </div>
        {!editing ? (
          <Button variant="primary" size="md" onClick={() => setEditing(true)}>
            {t('common.editProfile', { defaultValue: 'Edit Profile' })}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="md" onClick={() => { setEditing(false); setForm(buyer); }}>
              {t('common.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button variant="primary" size="md" onClick={handleSave}>
              {t('common.saveChanges', { defaultValue: 'Save Changes' })}
            </Button>
          </div>
        )}
      </div>

      {user?.accountHash && (
        <div className="bg-[#001e2b] text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-900/40">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00ed64] font-display flex items-center gap-1.5">
              {t('farmerProfile.onChainHashTitle', { defaultValue: '🛡️ ON-CHAIN CRYPTOGRAPHIC ACCOUNT HASH' })}
            </span>
            <p className="font-mono text-xs text-gray-300 mt-1 break-all">{user.accountHash}</p>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(user.accountHash); toast.success(t('buyerProfile.accountHashCopiedToast', { defaultValue: 'Account Hash copied!' })); }}
            className="px-4 py-2 bg-[#00ed64] text-[#001e2b] font-bold text-xs rounded-xl hover:bg-[#00c954] transition-colors shrink-0"
          >
            {t('common.copyHash', { defaultValue: 'Copy Hash' })}
          </button>
        </div>
      )}

      <Card className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">{t('buyerProfile.fullName')}</label>
            {editing ? (
              <Input value={form.fullName || ''} onChange={e => setForm({ ...form, fullName: e.target.value })} />
            ) : (
              <p className="text-base font-bold text-[#001e2b] font-display">{buyer?.fullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#f0f4e8]">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">{t('buyerProfile.emailAddress')}</label>
              <p className="text-sm font-semibold text-[#001e2b] font-sans">{buyer?.email}</p>
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">{t('buyerProfile.mobileNumber')}</label>
              <p className="text-sm font-semibold text-[#001e2b] font-sans">{buyer?.mobileNumber}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#f0f4e8]">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">{t('buyerProfile.deliveryAddress')}</label>
            {editing ? (
              <TextArea rows={2} value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
            ) : (
              <p className="text-sm text-gray-700 font-sans">{buyer?.address || '—'}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">{t('buyerProfile.city')}</label>
              {editing ? <Input value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} /> : <p className="text-sm font-bold text-[#001e2b] font-display">{buyer?.city || '—'}</p>}
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">{t('buyerProfile.state')}</label>
              {editing ? <Input value={form.state || ''} onChange={e => setForm({ ...form, state: e.target.value })} /> : <p className="text-sm font-bold text-[#001e2b] font-display">{buyer?.state || '—'}</p>}
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">{t('buyerProfile.pincode')}</label>
              {editing ? <Input value={form.pincode || ''} onChange={e => setForm({ ...form, pincode: e.target.value })} /> : <p className="text-sm font-bold text-[#001e2b] font-display">{buyer?.pincode || '—'}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0f4e8]">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">{t('buyerProfile.buyerAccountType')}</label>
            <p className="text-sm font-bold text-[#001e2b] font-display">{translateRole(t, buyer?.buyerType)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
