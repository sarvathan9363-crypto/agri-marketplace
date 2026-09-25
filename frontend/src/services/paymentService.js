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
  getPaymentStatus: async (paymentId, razorpayPaymentId = '') => {
    const query = razorpayPaymentId ? `?razorpay_payment_id=${encodeURIComponent(razorpayPaymentId)}` : '';
    const res = await api.get(`/payments/${paymentId}${query}`);
    return res.data;
  },
};

export default paymentService;
