import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, MapPin, DollarSign, CheckCircle2, ShieldCheck, ArrowRight, Package, UserCheck, Lock } from 'lucide-react';
import transportService from '../../services/transportService';
import { StatsCard, LoadingState } from '../../components/ui/Components';
import toast from 'react-hot-toast';

export default function TransporterDashboard() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quoteModal, setQuoteModal] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('REQUESTS'); // 'REQUESTS' | 'SHIPMENTS' | 'PROFILE'

  const [quoteForm, setQuoteForm] = useState({
    transportCharge: 450,
    loadingCharge: 50,
    unloadingCharge: 50,
    tollCharge: 0,
    handlingCharge: 0,
    otherCharges: 0,
    vehicleType: 'Refrigerated LCV (3.5T)',
    vehicleNumber: 'MH-12-AG-4589',
    estimatedPickup: 'Tomorrow Morning',
    estimatedDelivery: 'Within 2 Days',
    notes: '',
  });

  const [profileForm, setProfileForm] = useState({
    companyName: '',
    vehicleType: '',
    vehicleNumber: '',
    operatingStates: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqData, profData] = await Promise.all([
        transportService.getRequests(),
        transportService.getProfile(),
      ]);
      setRequests(reqData.requests || []);
      setProfile(profData.profile || null);
      if (profData.profile) {
        setProfileForm({
          companyName: profData.profile.companyName || '',
          vehicleType: profData.profile.vehicleType || '',
          vehicleNumber: profData.profile.vehicleNumber || '',
          operatingStates: profData.profile.operatingStates?.join(', ') || '',
        });
      }
    } catch {
      toast.error(t('transport.failedToLoadRequests', { defaultValue: 'Failed to load transport portal data.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!quoteModal) return;
    try {
      setSubmitting(true);
      await transportService.submitQuotation(quoteModal._id, quoteForm);
      toast.success(t('transport.quoteSubmitted', { defaultValue: 'Transport quotation submitted successfully!' }));
      setQuoteModal(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || t('transport.quoteSubmitFailed', { defaultValue: 'Failed to submit quotation.' }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptJob = async (quoteId) => {
    try {
      await transportService.acceptQuotationJob(quoteId);
      toast.success(t('transport.transporterAccepted', { defaultValue: 'Transport job accepted! Shipments confirmed.' }));
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || t('transport.acceptFailed', { defaultValue: 'Failed to accept transport job.' }));
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await transportService.updateShipmentStatus(requestId, newStatus);
      toast.success(t('transport.statusUpdated', { defaultValue: `Shipment status updated to ${newStatus}` }));
      setStatusModal(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || t('transport.updateStatusFailed', { defaultValue: 'Failed to update shipment status.' }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const statesArray = profileForm.operatingStates.split(',').map((s) => s.trim()).filter(Boolean);
      await transportService.updateProfile({
        companyName: profileForm.companyName,
        vehicleType: profileForm.vehicleType,
        vehicleNumber: profileForm.vehicleNumber,
        operatingStates: statesArray,
      });
      toast.success(t('transport.profileUpdated', { defaultValue: 'Transporter profile updated successfully!' }));
      setProfileModal(false);
      fetchData();
    } catch {
      toast.error(t('transport.profileUpdateFailed', { defaultValue: 'Failed to update profile.' }));
    }
  };

  if (loading) return <LoadingState />;

  const activeShipments = requests.filter((r) => ['QUOTATION_SELECTED', 'ASSIGNED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT'].includes(r.status));
  const openRequests = requests.filter((r) => r.status === 'OPEN' || r.status === 'QUOTES_RECEIVED');
  const completedShipments = requests.filter((r) => r.status === 'DELIVERED');
  const totalEarnings = [...activeShipments, ...completedShipments].reduce((sum, r) => sum + Number(r.confirmedTransportCharge || 0), 0);

  return (
    <div className="space-y-8 min-h-[calc(100vh-var(--app-header-height))] bg-[#fafcf8] p-6 rounded-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">
            {t('transport.portalTitle', { defaultValue: 'Transporter Logistics Portal' })}
          </span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">
            {t('transport.transporterDashboard', { defaultValue: 'Transporter Dashboard & Quotations' })}
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            {t('transport.dashboardSubtitle', { defaultValue: 'Manage agricultural freight requests, submit locked quotes, and track crop shipments.' })}
          </p>
        </div>

        <button
          onClick={() => setProfileModal(true)}
          className="px-4 py-2.5 bg-white border border-[#e8eddb] hover:border-[#00684a] rounded-2xl text-xs font-black text-[#001e2b] flex items-center gap-2 shadow-sm font-display transition"
        >
          <UserCheck className="w-4 h-4 text-[#00684a]" />
          <span>{profile?.companyName || t('transport.transporterProfile', { defaultValue: 'Transporter Profile' })}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard icon={Truck} label={t('transport.openRequests', { defaultValue: 'Open Transport Requests' })} value={openRequests.length} color="amber" />
        <StatsCard icon={CheckCircle2} label={t('transport.activeShipments', { defaultValue: 'Active Shipments' })} value={activeShipments.length} color="emerald" />
        <StatsCard icon={DollarSign} label={t('transport.totalFreightEarnings', { defaultValue: 'Confirmed Freight' })} value={`₹${totalEarnings.toLocaleString()}`} color="primary" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#e8eddb] pb-2">
        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-4 py-2 rounded-2xl text-xs font-black font-display transition ${
            activeTab === 'REQUESTS' ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-white text-gray-600 border border-[#e8eddb]'
          }`}
        >
          {t('transport.availableRequests', { defaultValue: 'Available Requests' })} ({openRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('SHIPMENTS')}
          className={`px-4 py-2 rounded-2xl text-xs font-black font-display transition ${
            activeTab === 'SHIPMENTS' ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-white text-gray-600 border border-[#e8eddb]'
          }`}
        >
          {t('transport.myShipments', { defaultValue: 'My Active Shipments' })} ({activeShipments.length})
        </button>
      </div>

      {/* Tab 1: Available Requests */}
      {activeTab === 'REQUESTS' && (
        <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-[#001e2b] font-display">
            {t('transport.availableRequestsHeading', { defaultValue: 'Available Agricultural Freight Requests' })}
          </h2>

          {openRequests.length === 0 ? (
            <div className="text-center py-12 bg-[#fafcf8] rounded-2xl border border-dashed border-[#e8eddb]">
              <Truck className="w-12 h-12 text-[#00684a] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-gray-500">{t('transport.noOpenRequests', { defaultValue: 'No open transport requests available at the moment.' })}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openRequests.map((req) => (
                <div key={req._id} className="p-5 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black text-[#00684a] uppercase bg-[#00ed64]/20 px-2 py-0.5 rounded-md font-display">
                        {req.requestNumber || 'TR-000101'}
                      </span>
                      <h3 className="font-extrabold text-[#001e2b] text-base font-display mt-1">{req.cropName}</h3>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">
                        {req.quantity} {req.unit} · {t('transport.totalWeight', { defaultValue: 'Weight' })}: {req.totalWeightKg || 100} KG
                      </p>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md font-display">
                      {req.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1 font-sans bg-white p-3 rounded-xl border border-gray-100">
                    <p><span className="font-bold text-gray-700">{t('transport.pickup', { defaultValue: 'Pickup' })}:</span> {req.pickupLocation}</p>
                    <p><span className="font-bold text-gray-700">{t('transport.delivery', { defaultValue: 'Delivery' })}:</span> {req.deliveryLocation}</p>
                  </div>

                  <button
                    onClick={() => setQuoteModal(req)}
                    className="w-full py-2.5 bg-[#001e2b] hover:bg-slate-800 text-[#00ed64] font-extrabold text-xs rounded-xl transition font-display flex items-center justify-center gap-1.5"
                  >
                    <span>{t('transport.submitQuote', { defaultValue: 'Submit Freight Quotation' })}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Active Shipments */}
      {activeTab === 'SHIPMENTS' && (
        <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-[#001e2b] font-display flex items-center gap-2">
            <Package className="w-5 h-5 text-[#00684a]" />
            {t('transport.assignedShipments', { defaultValue: 'Assigned Shipments & Accepted Jobs' })}
          </h2>

          {activeShipments.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              {t('transport.noActiveShipments', { defaultValue: 'No active shipments assigned yet.' })}
            </div>
          ) : (
            <div className="space-y-4">
              {activeShipments.map((req) => (
                <div key={req._id} className="p-5 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-[#00684a] uppercase font-display bg-[#00ed64]/20 px-2.5 py-0.5 rounded-md">
                        {req.requestNumber || 'TR-000101'} · {req.cropName} ({req.quantity} {req.unit})
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-display">• {req.buyerName}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 space-y-1 font-sans">
                      <p><MapPin className="w-3.5 h-3.5 inline text-amber-600 mr-1" />{t('transport.pickup', { defaultValue: 'Pickup' })}: {req.pickupLocation}</p>
                      <p><MapPin className="w-3.5 h-3.5 inline text-emerald-600 mr-1" />{t('transport.delivery', { defaultValue: 'Delivery' })}: {req.deliveryLocation}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-2">
                    <p className="text-xl font-black text-[#001e2b] font-display">₹{req.confirmedTransportCharge}</p>

                    {req.status === 'QUOTATION_SELECTED' ? (
                      <button
                        onClick={() => handleAcceptJob(req.selectedQuotationId?._id || req.selectedQuotationId)}
                        className="px-4 py-2 bg-[#00684a] hover:bg-[#00523a] text-white font-bold text-xs rounded-xl transition shadow font-display"
                      >
                        {t('transport.acceptJob', { defaultValue: 'Confirm & Accept Job' })}
                      </button>
                    ) : (
                      <div className="space-y-1">
                        <span className="inline-flex items-center text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                          ✓ {req.status}
                        </span>
                        <div>
                          <button
                            onClick={() => setStatusModal(req)}
                            className="text-xs font-bold text-[#00684a] underline hover:text-[#00523a] ml-2"
                          >
                            {t('transport.updateStatus', { defaultValue: 'Update Status' })}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quote Submission Modal */}
      {quoteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#e8eddb] shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-[#00684a] bg-[#00ed64]/20 px-2 py-0.5 rounded-md font-display">
                  {quoteModal.requestNumber || 'TR-000101'}
                </span>
                <h3 className="text-base font-black text-[#001e2b] font-display mt-1">
                  {t('transport.submitFreightQuote', { defaultValue: 'Submit Freight Quotation' })}
                </h3>
              </div>
              <button onClick={() => setQuoteModal(null)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <div className="text-xs bg-[#fafcf8] p-3 rounded-xl border border-[#e8eddb] space-y-1 font-sans">
              <p className="font-bold text-[#001e2b]">{quoteModal.cropName} ({quoteModal.quantity} {quoteModal.unit}) · {quoteModal.totalWeightKg || 100} KG</p>
              <p className="text-gray-600">{quoteModal.pickupLocation} → {quoteModal.deliveryLocation}</p>
              <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium pt-1 border-t border-gray-100">
                <Lock className="w-3 h-3 shrink-0" />
                <span>{t('transport.quoteLockedNotice', { defaultValue: 'Submitted quotes are locked and cannot be directly edited.' })}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transport.baseCharge', { defaultValue: 'Base Freight Charge (₹) *' })}</label>
                <input
                  type="number"
                  required
                  value={quoteForm.transportCharge}
                  onChange={(e) => setQuoteForm({ ...quoteForm, transportCharge: Number(e.target.value) })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#001e2b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('transport.loadingCharge', { defaultValue: 'Loading Charge (₹)' })}</label>
                  <input
                    type="number"
                    value={quoteForm.loadingCharge}
                    onChange={(e) => setQuoteForm({ ...quoteForm, loadingCharge: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('transport.unloadingCharge', { defaultValue: 'Unloading Charge (₹)' })}</label>
                  <input
                    type="number"
                    value={quoteForm.unloadingCharge}
                    onChange={(e) => setQuoteForm({ ...quoteForm, unloadingCharge: Number(e.target.value) })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transport.vehicleType', { defaultValue: 'Vehicle Type' })}</label>
                <input
                  type="text"
                  value={quoteForm.vehicleType}
                  onChange={(e) => setQuoteForm({ ...quoteForm, vehicleType: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                <span className="font-extrabold text-[#001e2b] font-display">{t('transport.totalQuote', { defaultValue: 'Total Quotation Amount' })}:</span>
                <span className="text-lg font-black text-[#00684a] font-display">
                  ₹{Number(quoteForm.transportCharge) + Number(quoteForm.loadingCharge) + Number(quoteForm.unloadingCharge) + Number(quoteForm.handlingCharge) + Number(quoteForm.tollCharge)}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setQuoteModal(null)}
                  className="w-full py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition font-display"
                >
                  {t('common.cancel', { defaultValue: 'Cancel' })}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl transition shadow font-display"
                >
                  {submitting ? t('common.submitting', { defaultValue: 'Submitting...' }) : t('transport.submitQuoteBtn', { defaultValue: 'Submit Locked Quote' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shipment Status Update Modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-[#e8eddb] shadow-2xl">
            <h3 className="text-base font-black text-[#001e2b] font-display">
              {t('transport.updateShipmentStatus', { defaultValue: 'Update Shipment Status' })}
            </h3>
            <p className="text-xs text-gray-500 font-sans">{statusModal.requestNumber} · {statusModal.cropName}</p>

            <div className="space-y-2 pt-2">
              {['PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(statusModal._id, st)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-bold font-display transition ${
                    statusModal.status === st ? 'bg-[#00684a] text-white border-[#00684a]' : 'bg-gray-50 hover:bg-gray-100 text-[#001e2b]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStatusModal(null)}
              className="w-full py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs"
            >
              {t('common.close', { defaultValue: 'Close' })}
            </button>
          </div>
        </div>
      )}

      {/* Transporter Profile Modal */}
      {profileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#e8eddb] shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#001e2b] font-display">
                {t('transport.editTransporterProfile', { defaultValue: 'Transporter Logistics Profile' })}
              </h3>
              <button onClick={() => setProfileModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transport.companyName', { defaultValue: 'Transporter / Logistics Company Name' })}</label>
                <input
                  type="text"
                  required
                  value={profileForm.companyName}
                  onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transport.vehicleType', { defaultValue: 'Primary Vehicle Type' })}</label>
                <input
                  type="text"
                  value={profileForm.vehicleType}
                  onChange={(e) => setProfileForm({ ...profileForm, vehicleType: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transport.vehicleNumber', { defaultValue: 'Vehicle Registration Number' })}</label>
                <input
                  type="text"
                  value={profileForm.vehicleNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, vehicleNumber: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('transport.operatingStates', { defaultValue: 'Service Areas / States (comma separated)' })}</label>
                <input
                  type="text"
                  value={profileForm.operatingStates}
                  onChange={(e) => setProfileForm({ ...profileForm, operatingStates: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  placeholder="Maharashtra, Karnataka, Tamil Nadu"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProfileModal(false)}
                  className="w-full py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl"
                >
                  {t('common.cancel', { defaultValue: 'Cancel' })}
                </button>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00684a] hover:bg-[#00523a] text-white font-extrabold rounded-xl"
                >
                  {t('common.save', { defaultValue: 'Save Profile' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
