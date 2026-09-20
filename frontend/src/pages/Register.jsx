import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, Tractor, ShoppingBag, Mail, Lock, Phone, User, MapPin, Eye, EyeOff, Building, ShieldCheck, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [step, setStep] = useState('select'); // select, farmer, buyer, farmer_verification_prompt
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerFarmer, registerBuyer } = useAuth();
  const navigate = useNavigate();

  const [farmerForm, setFarmerForm] = useState({
    fullName: '', email: '', mobileNumber: '', password: '', confirmPassword: '',
    farmName: '', farmerType: 'FARMER', location: '', address: '',
  });

  const [buyerForm, setBuyerForm] = useState({
    fullName: '', email: '', mobileNumber: '', password: '', confirmPassword: '',
    buyerType: 'INDIVIDUAL', address: '', city: '', state: '', pincode: '',
  });

  const handleFarmerSubmit = async (e) => {
    e.preventDefault();
    const f = farmerForm;
    if (!f.fullName || !f.email || !f.mobileNumber || !f.password || !f.farmName || !f.location) {
      toast.error('Please fill all required fields.'); return;
    }
    if (f.password !== f.confirmPassword) {
      toast.error('Passwords do not match.'); return;
    }
    if (f.password.length < 6) {
      toast.error('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      await registerFarmer(f);
      toast.success('Farmer account created successfully!');
      setStep('farmer_verification_prompt');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyerSubmit = async (e) => {
    e.preventDefault();
    const b = buyerForm;
    if (!b.fullName || !b.email || !b.mobileNumber || !b.password) {
      toast.error('Please fill all required fields.'); return;
    }
    if (b.password !== b.confirmPassword) {
      toast.error('Passwords do not match.'); return;
    }
    if (b.password.length < 6) {
      toast.error('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      await registerBuyer(b);
      toast.success('Account Created Successfully!');
      setStep('buyer_verification_prompt');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Post-registration Farmer Verification prompt
  if (step === 'farmer_verification_prompt') {
    const isFpoReg = farmerForm.farmerType === 'FPO';
    const onboardingPath = isFpoReg ? '/fpo/verification/onboarding' : '/farmer/verification/wizard';
    const badgeText = isFpoReg ? '✓ VERIFIED FPO' : '✓ VERIFIED FARMER';
    const regTitle = isFpoReg ? 'Complete Your FPO Verification' : 'Complete Your Farmer Verification';

    return (
      <div className="app-auth-page bg-[#fafcf8] flex items-center justify-center p-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center">
          <div className="bg-white rounded-3xl border-2 border-[#e8eddb] p-8 shadow-xl space-y-6">
            <div className="w-16 h-16 bg-[#e8f5e9] text-[#00684a] rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#00684a] bg-[#f0fdf4] px-3 py-1 rounded-full border border-[#bbf7d0]">
                Registration Successful
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#001e2b] font-display mt-3">
                {regTitle}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-sans leading-relaxed">
                Verify your credentials and bank account to unlock your <strong className="text-[#001e2b]">{badgeText}</strong> badge and sell produce on AgriBazaar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(onboardingPath)}
                className="btn-mongo-primary w-full sm:w-auto px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Start Verification
              </button>

              <button
                type="button"
                onClick={() => navigate('/farmer/dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 border-2 border-[#d0d7de] rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                Skip for Now
              </button>
            </div>

            <p className="text-[11px] text-gray-400">
              You can complete verification anytime later from your Seller Dashboard.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Post-registration Buyer Verification prompt
  if (step === 'buyer_verification_prompt') {
    const rawType = buyerForm.buyerType || 'INDIVIDUAL';
    const badgeText = rawType === 'BULK_BUYER' ? '✓ VERIFIED WHOLESALE BUYER' : rawType === 'BUSINESS' ? '✓ VERIFIED BUSINESS BUYER' : '✓ VERIFIED BUYER';

    return (
      <div className="app-auth-page bg-[#fafcf8] flex items-center justify-center p-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center">
          <div className="bg-white rounded-3xl border-2 border-[#e8eddb] p-8 shadow-xl space-y-6">
            <div className="w-16 h-16 bg-[#e8f5e9] text-[#00684a] rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#00684a] bg-[#f0fdf4] px-3 py-1 rounded-full border border-[#bbf7d0]">
                Account Created Successfully
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#001e2b] font-display mt-3">
                Complete Buyer Verification
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 font-sans leading-relaxed">
                Verify your details to unlock verified buyer features, build trust on AgriBazaar, and earn your <strong className="text-[#001e2b]">{badgeText}</strong> badge.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/buyer/verification/wizard')}
                className="btn-mongo-primary w-full sm:w-auto px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Start Verification
              </button>

              <button
                type="button"
                onClick={() => navigate('/buyer/dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 border-2 border-[#d0d7de] rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                Skip for Now
              </button>
            </div>

            <p className="text-[11px] text-gray-400">
              Skipping verification does NOT mean verified. Status will remain PENDING_VERIFICATION until completed.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Role selection step
  if (step === 'select') {
    return (
      <div className="app-auth-page bg-[#fafcf8] flex items-center justify-center p-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-12 h-12 bg-[#00ed64] text-[#001e2b] rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7" />
              </div>
              <span className="text-3xl font-black text-[#001e2b] font-display">Agri<span className="text-[#00684a]">Bazaar</span></span>
            </Link>
            <h1 className="text-3xl font-black text-[#001e2b] font-display">Join AgriBazaar</h1>
            <p className="mt-1 text-sm text-gray-600 font-medium">Select your account type to get started</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button onClick={() => setStep('farmer')} className="bg-white rounded-3xl border-2 border-[#e8eddb] hover:border-[#00684a] p-8 text-left transition-all group hover:shadow-xl">
              <div className="w-14 h-14 bg-[#f0fdf4] group-hover:bg-[#00ed64] rounded-2xl flex items-center justify-center transition-colors mb-4">
                <Tractor className="w-7 h-7 text-[#00684a] group-hover:text-[#001e2b]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#001e2b] font-display">Farmer / FPO</h3>
              <p className="mt-1.5 text-xs text-gray-500 font-medium leading-relaxed">Sell your produce directly to buyers at fair market prices.</p>
              <span className="inline-block mt-4 text-xs font-bold text-[#00684a] group-hover:underline">Register as Farmer →</span>
            </button>

            <button onClick={() => setStep('buyer')} className="bg-white rounded-3xl border-2 border-[#e8eddb] hover:border-[#00684a] p-8 text-left transition-all group hover:shadow-xl">
              <div className="w-14 h-14 bg-[#f0fdf4] group-hover:bg-[#00ed64] rounded-2xl flex items-center justify-center transition-colors mb-4">
                <ShoppingBag className="w-7 h-7 text-[#00684a] group-hover:text-[#001e2b]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#001e2b] font-display">Buyer</h3>
              <p className="mt-1.5 text-xs text-gray-500 font-medium leading-relaxed">Source fresh agricultural produce directly from verified farmers.</p>
              <span className="inline-block mt-4 text-xs font-bold text-[#00684a] group-hover:underline">Register as Buyer →</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-[#00684a] font-bold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    );
  }

  // Farmer registration form
  if (step === 'farmer') {
    return (
      <div className="app-auth-page bg-[#fafcf8] flex items-center justify-center p-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-[#001e2b] font-display">Farmer Registration</h1>
            <p className="text-sm text-gray-600 mt-1">Create your seller profile to list produce</p>
          </div>

          <div className="bg-white rounded-3xl border border-[#e8eddb] p-8 shadow-xl">
            <form onSubmit={handleFarmerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={farmerForm.fullName}
                    onChange={(e) => setFarmerForm({ ...farmerForm, fullName: e.target.value })}
                    className="input-mongo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="farmer@example.com"
                      value={farmerForm.email}
                      onChange={(e) => setFarmerForm({ ...farmerForm, email: e.target.value })}
                      className="input-mongo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={farmerForm.mobileNumber}
                      onChange={(e) => setFarmerForm({ ...farmerForm, mobileNumber: e.target.value })}
                      className="input-mongo"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="At least 6 chars"
                      value={farmerForm.password}
                      onChange={(e) => setFarmerForm({ ...farmerForm, password: e.target.value })}
                      className="input-mongo pr-10"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={farmerForm.confirmPassword}
                      onChange={(e) => setFarmerForm({ ...farmerForm, confirmPassword: e.target.value })}
                      className="input-mongo"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Farm / Organization Name *</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Krishna Organic Farm"
                      value={farmerForm.farmName}
                      onChange={(e) => setFarmerForm({ ...farmerForm, farmName: e.target.value })}
                      className="input-mongo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Seller Type *</label>
                  <select
                    value={farmerForm.farmerType}
                    onChange={(e) => setFarmerForm({ ...farmerForm, farmerType: e.target.value })}
                    className="w-full py-3.5 px-4 bg-white border border-[#d0d7de] rounded-xl text-sm text-[#001e2b] font-medium focus:outline-none focus:border-[#00684a]"
                  >
                    <option value="FARMER">Individual Farmer</option>
                    <option value="FPO">Farmer Producer Organization (FPO)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Location (City/District, State) *</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nashik, Maharashtra"
                    value={farmerForm.location}
                    onChange={(e) => setFarmerForm({ ...farmerForm, location: e.target.value })}
                    className="input-mongo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Full Farm Address</label>
                <textarea
                  rows={2}
                  placeholder="Street, Village, Pincode"
                  value={farmerForm.address}
                  onChange={(e) => setFarmerForm({ ...farmerForm, address: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[#d0d7de] rounded-xl text-sm text-[#001e2b] focus:outline-none focus:border-[#00684a] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-mongo-primary w-full py-4 text-base mt-2"
              >
                {loading ? 'Creating Account...' : 'Register as Farmer'}
              </button>
            </form>

            <button
              onClick={() => setStep('select')}
              className="w-full mt-4 text-sm font-bold text-gray-500 hover:text-[#001e2b] text-center block"
            >
              ← Back to role selection
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Buyer registration form
  return (
    <div className="app-auth-page bg-[#fafcf8] flex items-center justify-center p-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-[#001e2b] font-display">Buyer Registration</h1>
          <p className="text-sm text-gray-600 mt-1">Create your account to purchase produce</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#e8eddb] p-8 shadow-xl">
          <form onSubmit={handleBuyerSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={buyerForm.fullName}
                  onChange={(e) => setBuyerForm({ ...buyerForm, fullName: e.target.value })}
                  className="input-mongo"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="buyer@example.com"
                    value={buyerForm.email}
                    onChange={(e) => setBuyerForm({ ...buyerForm, email: e.target.value })}
                    className="input-mongo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={buyerForm.mobileNumber}
                    onChange={(e) => setBuyerForm({ ...buyerForm, mobileNumber: e.target.value })}
                    className="input-mongo"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 chars"
                    value={buyerForm.password}
                    onChange={(e) => setBuyerForm({ ...buyerForm, password: e.target.value })}
                    className="input-mongo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={buyerForm.confirmPassword}
                    onChange={(e) => setBuyerForm({ ...buyerForm, confirmPassword: e.target.value })}
                    className="input-mongo"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Buyer Type *</label>
              <select
                value={buyerForm.buyerType}
                onChange={(e) => setBuyerForm({ ...buyerForm, buyerType: e.target.value })}
                className="w-full py-3.5 px-4 bg-white border border-[#d0d7de] rounded-xl text-sm text-[#001e2b] font-medium focus:outline-none focus:border-[#00684a]"
              >
                <option value="INDIVIDUAL">Individual Consumer</option>
                <option value="BUSINESS">Business / Retailer</option>
                <option value="BULK_BUYER">Wholesale Bulk Buyer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001e2b] mb-1 font-display">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Street address"
                  value={buyerForm.address}
                  onChange={(e) => setBuyerForm({ ...buyerForm, address: e.target.value })}
                  className="input-mongo"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input
                placeholder="City"
                value={buyerForm.city}
                onChange={(e) => setBuyerForm({ ...buyerForm, city: e.target.value })}
                className="w-full px-3 py-3 bg-white border border-[#d0d7de] rounded-xl text-sm text-[#001e2b]"
              />
              <input
                placeholder="State"
                value={buyerForm.state}
                onChange={(e) => setBuyerForm({ ...buyerForm, state: e.target.value })}
                className="w-full px-3 py-3 bg-white border border-[#d0d7de] rounded-xl text-sm text-[#001e2b]"
              />
              <input
                placeholder="Pincode"
                value={buyerForm.pincode}
                onChange={(e) => setBuyerForm({ ...buyerForm, pincode: e.target.value })}
                className="w-full px-3 py-3 bg-white border border-[#d0d7de] rounded-xl text-sm text-[#001e2b]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-mongo-primary w-full py-4 text-base mt-2"
            >
              {loading ? 'Creating Account...' : 'Register as Buyer'}
            </button>
          </form>

          <button
            onClick={() => setStep('select')}
            className="w-full mt-4 text-sm font-bold text-gray-500 hover:text-[#001e2b] text-center block"
          >
            ← Back to role selection
          </button>
        </div>
      </motion.div>
    </div>
  );
}
