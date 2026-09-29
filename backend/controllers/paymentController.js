const paymentService = require('../services/paymentService');
const Order = require('../models/Order');

exports.createPaymentOrder = async (req, res, next) => {
  try {
    const targetId = req.body.orderGroupId || req.body.orderId;
    if (!targetId) return res.status(400).json({ success: false, message: 'Order ID or Order Group ID is required.' });
    res.json(await paymentService.createPaymentOrder(targetId, req.user._id));
  } catch (error) { next(error); }
};
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, razorpay_payment_id, razorpay_signature } = req.body;
    res.json(await paymentService.verifyPayment(paymentId, req.user._id, razorpay_payment_id, razorpay_signature));
  } catch (error) { next(error); }
};
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const gatewayPaymentId = req.query.razorpay_payment_id || req.query.gatewayPaymentId;
    res.json(await paymentService.getPaymentStatus(req.params.id, req.user._id, gatewayPaymentId));
  } catch (error) { next(error); }
};
exports.handleWebhook = async (req, res, next) => {
  try { res.json(await paymentService.processWebhook(req.body, req.get('x-razorpay-signature'), req.get('x-razorpay-event-id'))); } catch (error) { next(error); }
};
