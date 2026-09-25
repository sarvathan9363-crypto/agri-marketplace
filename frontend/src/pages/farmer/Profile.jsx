import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import farmerService from '../../services/farmerService';
import Button from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import { Card, StatusBadge, LoadingState } from '../../components/ui/Components';
import toast from 'react-hot-toast';
import SecureFileUpload from '../../components/common/SecureFileUpload';

export default function FarmerProfile() {
  const { user } = useAuth();
  const [farmer, setFarmer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await farmerService.getProfile();
      setFarmer(res.farmer);
      setForm(res.farmer);
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      const res = await farmerService.updateProfile(form);
      setFarmer(res.farmer);
      setEditing(false);
      toast.success('Farmer profile updated!');
    } catch { toast.error('Failed to update profile.'); }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Seller Identity</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Farmer Profile</h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">Manage your agricultural credentials, farm location, and contact information.</p>
        </div>
        {!editing ? (
          <Button variant="primary" size="md" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="md" onClick={() => { setEditing(false); setForm(farmer); }}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {user?.accountHash && (
        <div className="bg-[#001e2b] text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-900/40">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00ed64] font-display flex items-center gap-1.5">
              🛡️ On-Chain Cryptographic Account Hash
            </span>
            <p className="font-mono text-xs text-gray-300 mt-1 break-all">{user.accountHash}</p>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(user.accountHash); toast.success('Account Hash copied!'); }}
            className="px-4 py-2 bg-[#00ed64] text-[#001e2b] font-bold text-xs rounded-xl hover:bg-[#00c954] transition-colors shrink-0"
          >
            Copy Hash
          </button>
        </div>
      )}

      <Card className="max-w-2xl">
        <div className="space-y-6">
          <div className="pb-4 border-b border-[#f0f4e8]">
            <SecureFileUpload
              documentType="AVATAR_IMAGE"
              category="PROFILE"
              subCategory="AVATAR"
              entityType="USER"
              acceptedFileTypes=".jpg,.jpeg,.png,.webp"
              label="Profile Avatar Photo"
              description="Upload avatar photo (JPG, PNG, WEBP)"
              existingFile={farmer?.profileImage}
              onUploadSuccess={(fileData) => {
                setFarmer((prev) => ({ ...prev, profileImage: fileData.secureUrl }));
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Full Name</label>
            {editing ? (
              <Input value={form.fullName || ''} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            ) : (
              <p className="text-base font-bold text-[#001e2b] font-display">{farmer?.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Farm / FPO Name</label>
            {editing ? (
              <Input value={form.farmName || ''} onChange={(e) => setForm({ ...form, farmName: e.target.value })} />
            ) : (
              <p className="text-base font-bold text-[#001e2b] font-display">{farmer?.farmName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#f0f4e8]">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">Email Address</label>
              <p className="text-sm font-semibold text-[#001e2b] font-sans">{farmer?.email}</p>
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">Mobile Number</label>
              <p className="text-sm font-semibold text-[#001e2b] font-sans">{farmer?.mobileNumber}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#f0f4e8]">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Location</label>
            {editing ? (
              <Input value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            ) : (
              <p className="text-sm font-semibold text-[#001e2b] font-sans">{farmer?.location}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Address</label>
            {editing ? (
              <TextArea rows={2} value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            ) : (
              <p className="text-sm text-gray-700 font-sans">{farmer?.address || '—'}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#f0f4e8]">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">Seller Type</label>
              <p className="text-sm font-bold text-[#001e2b] font-display">{farmer?.farmerType}</p>
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1 font-display">Verification Status</label>
              <StatusBadge status={farmer?.verificationStatus} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
