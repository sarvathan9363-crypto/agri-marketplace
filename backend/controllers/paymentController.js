const paymentService = require('../services/paymentService');
const Order = require('../models/Order');

exports.createPaymentOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json(await paymentService.createPaymentOrder(order, req.user._id));
  } catch (error) { next(error); }
};
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, razorpay_payment_id, razorpay_signature } = req.body;
    res.json(await paymentService.verifyPayment(paymentId, req.user._id, razorpay_payment_id, razorpay_signature));
  } catch (error) { next(error); }
};
exports.getPaymentStatus = async (req, res, next) => {
  try { res.json(await paymentService.getPaymentStatus(req.params.id, req.user._id)); } catch (error) { next(error); }
};
exports.handleWebhook = async (req, res, next) => {
  try { res.json(await paymentService.processWebhook(req.body, req.get('x-razorpay-signature'), req.get('x-razorpay-event-id'))); } catch (error) { next(error); }
};
