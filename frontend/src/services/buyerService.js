import api from './api';

const buyerService = {
  getProfile: async () => {
    const res = await api.get('/buyers/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/buyers/profile', data);
    return res.data;
  },
  getDashboard: async () => {
    const res = await api.get('/buyers/dashboard');
    return res.data;
  },
  // Buyer Verification API Methods
  getVerificationStatus: async () => {
    const res = await api.get('/buyers/verification');
    return res.data;
  },
  sendMobileOtp: async (data) => {
    const res = await api.post('/buyers/verify/mobile-otp', data);
    return res.data;
  },
  verifyMobileOtp: async (data) => {
    const res = await api.post('/buyers/verify/mobile-confirm', data);
    return res.data;
  },
  verifyIdentity: async (data) => {
    const res = await api.post('/buyers/verify/identity', data);
    return res.data;
  },
  verifyAddress: async (data) => {
    const res = await api.post('/buyers/verify/address', data);
    return res.data;
  },
  verifyBusiness: async (data) => {
    const res = await api.post('/buyers/verify/business', data);
    return res.data;
  },
  verifyPan: async (data) => {
    const res = await api.post('/buyers/verify/pan', data);
    return res.data;
  },
  verifyGstin: async (data) => {
    const res = await api.post('/buyers/verify/gstin', data);
    return res.data;
  },
  sendRepOtp: async (data) => {
    const res = await api.post('/buyers/verify/representative-otp', data);
    return res.data;
  },
  verifyRepresentative: async (data) => {
    const res = await api.post('/buyers/verify/representative', data);
    return res.data;
  },
  verifyBank: async (data) => {
    const res = await api.post('/buyers/verify/bank', data);
    return res.data;
  },
  verifyUdyam: async (data) => {
    const res = await api.post('/buyers/verify/udyam', data);
    return res.data;
  },
  verifyFssai: async (data) => {
    const res = await api.post('/buyers/verify/fssai', data);
    return res.data;
  },
  verifyDocuments: async (data) => {
    const res = await api.post('/buyers/verify/documents', data);
    return res.data;
  },
  skipStep: async (stepKey) => {
    const res = await api.post('/buyers/verify/skip-step', { stepKey });
    return res.data;
  },
  completeVerification: async () => {
    const res = await api.post('/buyers/verify/complete');
    return res.data;
  },
};

export default buyerService;
