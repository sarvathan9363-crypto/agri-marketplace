const paymentService = require('../services/paymentService');
const Order = require('../models/Order');

// @desc    Create payment order
// @route   POST /api/payments/create-order
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const result = await paymentService.createPaymentOrder(
      orderId, order.totalAmount, 'INR', req.user._id
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, gatewayPaymentId, gatewaySignature } = req.body;

    const result = await paymentService.verifyPayment(paymentId, gatewayPaymentId, gatewaySignature);

    // Update order payment status
    if (result.payment) {
      await Order.findByIdAndUpdate(result.payment.orderId, {
        paymentStatus: 'SUCCESSFUL',
        paymentId: result.payment._id,
      });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment status
// @route   GET /api/payments/:id
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const result = await paymentService.getPaymentStatus(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
