import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import transportService from '../../services/transportService';
import Button from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import { Card, StatusBadge, LoadingState } from '../../components/ui/Components';
import toast from 'react-hot-toast';
import SecureFileUpload from '../../components/common/SecureFileUpload';
import { Truck, ShieldCheck, UserCheck, Phone, Mail, MapPin, Building } from 'lucide-react';

export default function TransporterProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [verification, setVerification] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [pRes, vRes] = await Promise.all([
        transportService.getProfile().catch(() => ({ profile: {} })),
        transportService.getVerification().catch(() => ({})),
      ]);

      const pData = pRes.profile || {};
      const vInfo = vRes.profileInfo || {};

      const combined = {
        companyName: pData.companyName || vInfo.companyName || (user?.fullName ? `${user.fullName} Logistics` : 'Transporter Logistics'),
        contactPerson: vInfo.contactPerson || user?.fullName || '',
        mobileNumber: vInfo.mobileNumber || user?.mobileNumber || '',
        email: vInfo.email || user?.email || '',
        address: pData.address || vInfo.address || '',
        state: pData.state || vInfo.state || 'Maharashtra',
        district: pData.district || vInfo.district || '',
        pincode: pData.pincode || vInfo.pincode || '',
        serviceAreas: pData.operatingStates?.join(', ') || vInfo.serviceAreas?.join(', ') || 'Maharashtra, Gujarat, Karnataka',
        transporterIdCode: pData.transporterIdCode || `AGR-T-${user?._id?.slice(-5)?.toUpperCase() || '88392'}`,
        verificationStatus: vRes.verificationStatus || pData.verificationStatus || 'NOT_STARTED',
        profileImage: pData.profileImage || '',
      };

      setProfile(combined);
      setForm(combined);
      setVerification(vRes.verification || null);
      setVehicles(vRes.vehicles || []);
      setDrivers(vRes.drivers || []);
    } catch {
      toast.error(t('transporterProfile.failedToLoad', { defaultValue: 'Failed to load transporter profile.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const areasArr = typeof form.serviceAreas === 'string'
        ? form.serviceAreas.split(',').map((s) => s.trim()).filter(Boolean)
        : form.serviceAreas;

      const res = await transportService.updateProfile({
        companyName: form.companyName,
        contactPerson: form.contactPerson,
        mobileNumber: form.mobileNumber,
        email: form.email,
        address: form.address,
        state: form.state,
        district: form.district,
        pincode: form.pincode,
        operatingStates: areasArr,
      });

      setProfile((prev) => ({
        ...prev,
        ...form,
        serviceAreas: Array.isArray(areasArr) ? areasArr.join(', ') : form.serviceAreas,
      }));
      setEditing(false);
      toast.success(t('transporterProfile.updatedSuccess', { defaultValue: 'Transporter profile updated successfully!' }));
    } catch (err) {
      toast.error(err.response?.data?.message || t('transporterProfile.updateFailed', { defaultValue: 'Failed to update profile.' }));
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">
            {t('transporterProfile.logisticsBadge', { defaultValue: 'Verified Logistics Partner' })}
          </span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">
            {t('transporterProfile.title', { defaultValue: 'Transporter Fleet Profile' })}
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            {t('transporterProfile.subtitle', { defaultValue: 'Manage your commercial freight details, contact information, and service regions.' })}
          </p>
        </div>

        {!editing ? (
          <Button variant="primary" size="md" onClick={() => setEditing(true)}>
            {t('transporterProfile.editBtn', { defaultValue: 'Edit Profile' })}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="md" onClick={() => { setEditing(false); setForm(profile); }}>
              {t('common.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button variant="primary" size="md" onClick={handleSave}>
              {t('common.saveChanges', { defaultValue: 'Save Changes' })}
            </Button>
          </div>
        )}
      </div>

      {/* Account Cryptographic Hash */}
      {user?.accountHash && (
        <div className="bg-[#001e2b] text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-900/40">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00ed64] font-display flex items-center gap-1.5">
              🛡️ {t('transporterProfile.accountHashLabel', { defaultValue: 'On-Chain Transporter Identity Hash' })}
            </span>
            <p className="font-mono text-xs text-gray-300 mt-1 break-all">{user.accountHash}</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(user.accountHash);
              toast.success(t('transporterProfile.hashCopied', { defaultValue: 'Account Hash copied to clipboard!' }));
            }}
            className="px-4 py-2 bg-[#00ed64] text-[#001e2b] font-bold text-xs rounded-xl hover:bg-[#00c954] transition-colors shrink-0"
          >
            {t('common.copyHash', { defaultValue: 'Copy Hash' })}
          </button>
        </div>
      )}

      {/* Main Profile Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#f0f4e8] gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#00ed64]/20 text-[#00684a] rounded-2xl flex items-center justify-center font-black text-2xl font-display">
              {profile?.companyName?.[0] || 'T'}
            </div>
            <div>
              <h2 className="text-xl font-black text-[#001e2b] font-display">{profile?.companyName}</h2>
              <p className="font-mono text-xs text-emerald-700 font-bold mt-0.5">{profile?.transporterIdCode}</p>
            </div>
          </div>
          <div>
            <StatusBadge status={profile?.verificationStatus} />
          </div>
        </div>

        {/* Form Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">
              {t('transporterProfile.companyName', { defaultValue: 'Company / Transporter Name' })}
            </label>
            {editing ? (
              <Input
                value={form.companyName || ''}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            ) : (
              <p className="text-base font-bold text-[#001e2b] font-display">{profile?.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">
              {t('transporterProfile.contactPerson', { defaultValue: 'Primary Contact Person' })}
            </label>
            {editing ? (
              <Input
                value={form.contactPerson || ''}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
              />
            ) : (
              <p className="text-base font-bold text-[#001e2b] font-display">{profile?.contactPerson}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">
              {t('transporterProfile.email', { defaultValue: 'Email Address' })}
            </label>
            {editing ? (
              <Input
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            ) : (
              <p className="text-sm font-semibold text-[#001e2b] font-sans flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-600" />
                {profile?.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">
              {t('transporterProfile.mobile', { defaultValue: 'Mobile Number' })}
            </label>
            {editing ? (
              <Input
                value={form.mobileNumber || ''}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
              />
            ) : (
              <p className="text-sm font-semibold text-[#001e2b] font-sans flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                {profile?.mobileNumber}
              </p>
            )}
          </div>
        </div>

        {/* Address & Service Areas */}
        <div className="space-y-4 pt-4 border-t border-[#f0f4e8]">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">
              {t('transporterProfile.address', { defaultValue: 'Business Address' })}
            </label>
            {editing ? (
              <TextArea
                rows={2}
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            ) : (
              <p className="text-sm font-semibold text-[#001e2b] font-sans flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                {profile?.address ? `${profile.address}, ${profile.district || ''}, ${profile.state} - ${profile.pincode || ''}` : '—'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">
              {t('transporterProfile.serviceAreas', { defaultValue: 'Operating States / Routes' })}
            </label>
            {editing ? (
              <Input
                value={form.serviceAreas || ''}
                onChange={(e) => setForm({ ...form, serviceAreas: e.target.value })}
                placeholder="Maharashtra, Gujarat, Karnataka"
              />
            ) : (
              <p className="text-sm font-bold text-[#00684a] font-display bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl inline-block">
                {profile?.serviceAreas}
              </p>
            )}
          </div>
        </div>

        {/* Fleet & Roster Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#f0f4e8]">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
            <Truck className="w-8 h-8 text-[#00684a]" />
            <div>
              <p className="text-2xl font-black text-[#001e2b] font-display">{vehicles.length}</p>
              <p className="text-xs font-bold text-gray-500">{t('transporterProfile.registeredVehicles', { defaultValue: 'Registered Vehicles' })}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-[#00684a]" />
            <div>
              <p className="text-2xl font-black text-[#001e2b] font-display">{drivers.length}</p>
              <p className="text-xs font-bold text-gray-500">{t('transporterProfile.activeDrivers', { defaultValue: 'Active Drivers' })}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
