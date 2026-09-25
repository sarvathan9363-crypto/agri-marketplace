import api from './api';

const adminService = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },
  getUsers: async (params = {}) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },
  toggleUserStatus: async (id) => {
    const res = await api.put(`/admin/users/${id}/status`);
    return res.data;
  },
  getFarmers: async (params = {}) => {
    const res = await api.get('/admin/farmers', { params });
    return res.data;
  },
  verifyFarmer: async (id, data) => {
    const res = await api.put(`/admin/farmers/${id}/verify`, data);
    return res.data;
  },
  getProducts: async (params = {}) => {
    const res = await api.get('/admin/products', { params });
    return res.data;
  },
  updateProductStatus: async (id, status) => {
    const res = await api.put(`/admin/products/${id}/status`, { status });
    return res.data;
  },
  getOrders: async (params = {}) => {
    const res = await api.get('/admin/orders', { params });
    return res.data;
  },
  getPayments: async (params = {}) => {
    const res = await api.get('/admin/payments', { params });
    return res.data;
  },
  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },
  getDisputes: async (params = {}) => {
    const res = await api.get('/admin/disputes', { params });
    return res.data;
  },
  updateDispute: async (id, data) => {
    const res = await api.put(`/admin/disputes/${id}`, data);
    return res.data;
  },
  getFarmerSettlements: async (params = {}) => {
    const res = await api.get('/admin/farmers/settlements', { params });
    return res.data;
  },
  getBlockchainAuditEvents: async () => {
    const res = await api.get('/admin/blockchain/events');
    return res.data;
  },
  verifyBlockchainHash: async (eventIdHash) => {
    const res = await api.get(`/blockchain/audit/${eventIdHash}`);
    return res.data;
  },
  lookupAccountByHash: async (accountHash) => {
    try {
      const res = await api.get(`/admin/account-lookup/${accountHash}`);
      return res.data;
    } catch {
      const res = await api.get(`/blockchain/account-lookup/${accountHash}`);
      return res.data;
    }
  },
};

export default adminService;
