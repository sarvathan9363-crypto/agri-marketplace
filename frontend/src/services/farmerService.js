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
};

export default farmerService;
