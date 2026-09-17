import api from './api';

const paymentService = {
  createPaymentOrder: async (orderId) => {
    const res = await api.post('/payments/create-order', { orderId });
    return res.data;
  },
  verifyPayment: async (data) => {
    const res = await api.post('/payments/verify', data);
    return res.data;
  },
  getPaymentStatus: async (paymentId) => {
    const res = await api.get(`/payments/${paymentId}`);
    return res.data;
  },
};

export default paymentService;
