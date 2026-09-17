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
};

export default farmerService;
