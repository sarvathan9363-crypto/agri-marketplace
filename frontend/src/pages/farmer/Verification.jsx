import { useState, useEffect } from 'react';
import farmerService from '../../services/farmerService';
import { StatusBadge, LoadingState, Card } from '../../components/ui/Components';
import { ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export default function FarmerVerification() {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    farmerService.getVerification().then(r => setVerification(r)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  const isVerified = verification?.status === 'VERIFIED';
  const isRejected = verification?.status === 'REJECTED';

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">KYC Verification</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Verification Status</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">Track your agricultural producer verification status.</p>
      </div>

      <Card className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6 border-b border-[#f0f4e8] pb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
            isVerified ? 'bg-[#00ed64] text-[#001e2b]' : isRejected ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-800'
          }`}>
            {isVerified ? <ShieldCheck className="w-6 h-6" /> : isRejected ? <AlertTriangle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase font-display">Account Status:</span>
              <StatusBadge status={verification?.status || 'PENDING_VERIFICATION'} />
            </div>
            <p className="text-sm font-extrabold text-[#001e2b] font-display mt-1">
              {isVerified ? 'Verified Agricultural Producer' : isRejected ? 'Verification Application Rejected' : 'Under Platform Review'}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 font-sans leading-relaxed">
          {isVerified
            ? 'Your farmer account is verified! Your products can be published live to buyers across India with a verified badge.'
            : isRejected
            ? `Your verification application was rejected: ${verification?.notes || 'Please update your farm credentials or contact support.'}`
            : 'Your farm profile is currently undergoing review by AgriBazaar administration. Verification typically completes within 24-48 hours.'}
        </p>

        {verification?.verifiedAt && (
          <p className="text-xs font-bold text-gray-400 mt-4 font-display">Verified Date: {new Date(verification.verifiedAt).toLocaleDateString()}</p>
        )}
      </Card>
    </div>
  );
}
