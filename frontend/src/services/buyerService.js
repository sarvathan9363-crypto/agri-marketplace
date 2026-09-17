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
};

export default buyerService;
