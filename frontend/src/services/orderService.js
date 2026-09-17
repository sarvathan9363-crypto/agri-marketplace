import api from './api';

const orderService = {
  createOrder: async (data) => {
    const res = await api.post('/orders', data);
    return res.data;
  },
  getOrder: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  updateOrderStatus: async (id, data) => {
    const res = await api.put(`/orders/${id}/status`, data);
    return res.data;
  },
  getBuyerOrders: async (params = {}) => {
    const res = await api.get('/buyers/orders', { params });
    return res.data;
  },
  getFarmerOrders: async (params = {}) => {
    const res = await api.get('/farmers/orders', { params });
    return res.data;
  },
};

export default orderService;
