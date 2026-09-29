import api from './api';

const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  registerFarmer: async (data) => {
    const res = await api.post('/auth/register/farmer', data);
    return res.data;
  },

  registerBuyer: async (data) => {
    const res = await api.post('/auth/register/buyer', data);
    return res.data;
  },

  registerTransporter: async (data) => {
    const res = await api.post('/auth/register/transporter', data);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('agribazaar_token');
    localStorage.removeItem('agribazaar_user');
  },
};

export default authService;
