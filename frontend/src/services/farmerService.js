import api from './api';

const farmerService = {
  getProfile: async () => {
    const res = await api.get('/farmers/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/farmers/profile', data);
    return res.data;
  },
  getMyProducts: async (params = {}) => {
    const res = await api.get('/farmers/products', { params });
    return res.data;
  },
  getDashboard: async () => {
    const res = await api.get('/farmers/dashboard');
    return res.data;
  },
  getSalesStats: async () => {
    const res = await api.get('/farmers/sales');
    return res.data;
  },
  getVerification: async () => {
    const res = await api.get('/farmers/verification');
    return res.data;
  },
  sendAadhaarOtp: async (aadhaarNumber) => {
    const res = await api.post('/farmers/verify/aadhaar-otp', { aadhaarNumber });
    return res.data;
  },
  verifyAadhaarOtp: async (referenceId, otp) => {
    const res = await api.post('/farmers/verify/aadhaar-confirm', { referenceId, otp });
    return res.data;
  },
  verifyFarmerRegistry: async (data) => {
    const res = await api.post('/farmers/verify/farmer-id', data);
    return res.data;
  },
  verifyLandRecord: async (data) => {
    const res = await api.post('/farmers/verify/land-record', data);
    return res.data;
  },
  verifyBankAccount: async (data) => {
    const res = await api.post('/farmers/verify/bank-account', data);
    return res.data;
  },
  verifyPan: async (data) => {
    const res = await api.post('/farmers/verify/pan', data);
    return res.data;
  },
  verifyPmKisan: async (data) => {
    const res = await api.post('/farmers/verify/pm-kisan', data);
    return res.data;
  },
  skipStep: async (stepKey) => {
    const res = await api.post('/farmers/verify/skip-step', { stepKey });
    return res.data;
  },
  // FPO Methods
  verifyOrgIdentity: async (data) => {
    const res = await api.post('/farmers/verify/fpo-org-identity', data);
    return res.data;
  },
  verifyOrgPan: async (data) => {
    const res = await api.post('/farmers/verify/fpo-org-pan', data);
    return res.data;
  },
  verifyGstin: async (data) => {
    const res = await api.post('/farmers/verify/fpo-gstin', data);
    return res.data;
  },
  sendRepOtp: async (mobileNumber) => {
    const res = await api.post('/farmers/verify/fpo-rep-otp', { mobileNumber });
    return res.data;
  },
  verifyRepOtp: async (data) => {
    const res = await api.post('/farmers/verify/fpo-rep-confirm', data);
    return res.data;
  },
  verifyOrgBank: async (data) => {
    const res = await api.post('/farmers/verify/fpo-org-bank', data);
    return res.data;
  },
  verifyOrgDocuments: async (data) => {
    const res = await api.post('/farmers/verify/fpo-org-docs', data);
    return res.data;
  },
  // Razorpay Route / Payment Settlement Account Methods
  getPaymentAccountStatus: async () => {
    const res = await api.get('/farmers/payment-account/status');
    return res.data;
  },
  initiatePaymentAccountOnboarding: async () => {
    const res = await api.post('/farmers/payment-account/onboarding');
    return res.data;
  },
  refreshPaymentAccountStatus: async () => {
    const res = await api.post('/farmers/payment-account/refresh');
    return res.data;
  },
  continuePaymentAccountSetup: async () => {
    const res = await api.post('/farmers/payment-account/continue');
    return res.data;
  },
};

export default farmerService;
