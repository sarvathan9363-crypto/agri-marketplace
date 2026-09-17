/**
 * Payment Service
 *
 * Future payment gateway integration (Razorpay / Stripe / other).
 *
 * Currently simulates payment flow for development.
 * Replace with actual gateway SDK when ready.
 *
 * SECURITY:
 * - NEVER store card numbers, CVV, UPI PIN, or bank passwords
 * - Only store safe payment references (gateway IDs, signatures)
 * - Gateway secrets should ONLY be in server-side environment variables
 */

const Payment = require('../models/Payment');

class PaymentService {
  constructor() {
    // Future: Initialize payment gateway SDK
    // this.razorpay = new Razorpay({ key_id, key_secret });
    console.log('PaymentService: Initialized in simulation mode.');
  }

  async createPaymentOrder(orderId, amount, currency = 'INR', buyerId) {
    // Future: Create order on payment gateway
    // const gatewayOrder = await this.razorpay.orders.create({ amount, currency });

    const payment = await Payment.create({
      orderId,
      buyerId,
      amount,
      currency,
      status: 'PENDING',
      gatewayOrderId: `sim_order_${Date.now()}`,
    });

    return {
      success: true,
      payment,
      // Future: return gatewayOrder details for frontend SDK
      gatewayOrderId: payment.gatewayOrderId,
    };
  }

  async verifyPayment(paymentId, gatewayPaymentId, gatewaySignature) {
    // Future: Verify signature with gateway SDK
    // const isValid = this.verifySignature(gatewayOrderId, gatewayPaymentId, gatewaySignature);

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Simulate successful verification
    payment.status = 'SUCCESSFUL';
    payment.gatewayPaymentId = gatewayPaymentId || `sim_pay_${Date.now()}`;
    payment.gatewaySignature = gatewaySignature || 'simulated';
    payment.paymentMethod = 'SIMULATED';
    await payment.save();

    return {
      success: true,
      payment,
    };
  }

  async getPaymentStatus(paymentId) {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return { success: true, payment };
  }

  async getPaymentByOrder(orderId) {
    const payment = await Payment.findOne({ orderId });
    return payment;
  }
}

module.exports = new PaymentService();
