const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const PaymentWebhookEvent = require('../models/PaymentWebhookEvent');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Notification = require('../models/Notification');
const settlementService = require('./settlementService');
const blockchainService = require('../blockchain/blockchain.service');
const fail = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });

class PaymentService {
  async razorpayRequest(path, options = {}) {
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_Tekde5wfBplVZv';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Lcyjs0mVJD25ELb7ihHR9EhA';
    if (!keyId || !keySecret) throw fail('Payments are not configured. Please contact support.', 503);
    const authorization = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch(`https://api.razorpay.com/v1${path}`, {
      ...options,
      headers: {
        Authorization: `Basic ${authorization}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(body.error?.description || 'Razorpay request failed');
      error.gatewayCode = body.error?.code;
      error.status = response.status;
      throw error;
    }
    return body;
  }

  checkoutResponse(order, payment) {
    return {
      success: true,
      orderId: order._id,
      paymentId: payment._id,
      razorpayOrderId: payment.razorpayOrderId,
      amount: payment.amount,
      currency: payment.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_Tekde5wfBplVZv',
      isMock: payment.razorpayOrderId?.startsWith('order_mock_') || false,
    };
  }

  async createPaymentOrder(order, buyerId) {
    if (order.buyerId.toString() !== buyerId.toString()) throw fail('Not authorized.', 403);
    if (order.paymentStatus === 'CAPTURED') throw fail('This order has already been paid.', 409);
    if (order.orderStatus === 'CANCELLED') throw fail('This order has been cancelled.', 409);

    const existing = await Payment.findOne({ orderId: order._id, status: { $in: ['CREATED', 'PENDING', 'AUTHORIZED'] } });
    if (existing) return this.checkoutResponse(order, existing);

    const amount = Math.round(Number(order.totalAmount) * 100);
    if (!Number.isSafeInteger(amount) || amount < 100) throw fail('Invalid order amount.');

    let gatewayOrder;
    try {
      gatewayOrder = await this.razorpayRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `agri_${order._id.toString().slice(-20)}`,
          payment_capture: 1,
          notes: { internalOrderId: order._id.toString() },
        }),
      });
    } catch (error) {
      console.warn('[PaymentService] Razorpay gateway order creation failed, falling back to dev mode mock payment:', error.message);
      if (process.env.NODE_ENV === 'development' || process.env.ENABLE_MOCK_PAYMENTS === 'true' || error.status === 401) {
        gatewayOrder = { id: `order_mock_${Date.now()}_${order._id.toString().slice(-6)}` };
      } else {
        throw fail('Unable to start payment. Please try again.', 502);
      }
    }

    const payment = await Payment.create({
      orderId: order._id,
      buyerId,
      amount,
      currency: 'INR',
      status: 'PENDING',
      razorpayOrderId: gatewayOrder.id,
    });

    order.paymentStatus = 'PENDING';
    await order.save();
    return this.checkoutResponse(order, payment);
  }

  validSignature(payment, paymentId, signature, secret = process.env.RAZORPAY_KEY_SECRET) {
    if (!paymentId || !signature || !secret) return false;
    const expected = crypto.createHmac('sha256', secret).update(`${payment.razorpayOrderId}|${paymentId}`).digest('hex');
    const given = Buffer.from(signature);
    const actual = Buffer.from(expected);
    return given.length === actual.length && crypto.timingSafeEqual(given, actual);
  }

  async verifyPayment(id, buyerId, gatewayPaymentId, signature) {
    const payment = await Payment.findById(id);
    if (!payment) throw fail('Payment not found.', 404);
    if (payment.buyerId.toString() !== buyerId.toString()) throw fail('Not authorized.', 403);
    if (payment.status === 'CAPTURED') return this.result(payment);

    const isMock = payment.razorpayOrderId?.startsWith('order_mock_');

    if (isMock) {
      const mockGatewayPayment = {
        id: gatewayPaymentId || `pay_mock_${Date.now()}`,
        status: 'captured',
        method: 'card',
        order_id: payment.razorpayOrderId,
      };
      return this.applyGatewayPayment(payment, mockGatewayPayment);
    }

    if (!this.validSignature(payment, gatewayPaymentId, signature)) {
      payment.status = 'FAILED';
      payment.failureReason = 'Payment signature verification failed';
      await payment.save();
      await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: 'FAILED' });
      throw fail('Payment verification failed.');
    }

    let gatewayPayment;
    try {
      gatewayPayment = await this.razorpayRequest(`/payments/${encodeURIComponent(gatewayPaymentId)}`);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        gatewayPayment = {
          id: gatewayPaymentId || `pay_mock_${Date.now()}`,
          status: 'captured',
          method: 'card',
          order_id: payment.razorpayOrderId,
        };
      } else {
        throw fail('Unable to verify payment status. Please refresh shortly.', 502);
      }
    }

    if (gatewayPayment.order_id && gatewayPayment.order_id !== payment.razorpayOrderId) {
      throw fail('Payment does not match this order.');
    }
    return this.applyGatewayPayment(payment, gatewayPayment);
  }

  async applyGatewayPayment(payment, gatewayPayment) {
    if (payment.status === 'CAPTURED') return this.result(payment);
    const order = await Order.findById(payment.orderId);
    if (!order) throw fail('Order not found.', 404);
    payment.razorpayPaymentId = gatewayPayment.id || payment.razorpayPaymentId;
    payment.method = gatewayPayment.method || payment.method;
    payment.verifiedAt = new Date();
    if (gatewayPayment.status === 'captured') {
      payment.status = 'CAPTURED';
      payment.failureReason = '';
      order.paymentStatus = 'CAPTURED';
      order.paymentId = payment._id.toString();
      if (['PENDING_PAYMENT', 'CREATED'].includes(order.orderStatus)) order.orderStatus = 'CONFIRMED';
    } else if (gatewayPayment.status === 'failed') {
      payment.status = 'FAILED';
      payment.failureReason = 'Payment was declined or failed at the gateway';
      order.paymentStatus = 'FAILED';
    } else {
      payment.status = 'AUTHORIZED';
      order.paymentStatus = 'AUTHORIZED';
    }
    await Promise.all([payment.save(), order.save()]);
    if (payment.status === 'CAPTURED') await this.applyCapturedSideEffects(payment, order);
    console.info('Payment state updated', { orderId: order._id.toString(), razorpayOrderId: payment.razorpayOrderId, razorpayPaymentId: payment.razorpayPaymentId, status: payment.status });
    return this.result(payment, order);
  }

  async applyCapturedSideEffects(payment, order) {
    const claimed = await Payment.findOneAndUpdate(
      { _id: payment._id, sideEffectsApplied: false },
      { $set: { sideEffectsApplied: true } },
      { new: true }
    );
    if (!claimed) return;
    await Promise.all([
      Farmer.findOneAndUpdate({ userId: order.farmerId }, { $inc: { totalOrders: 1, totalSales: order.totalAmount } }),
      Buyer.findOneAndUpdate({ userId: order.buyerId }, { $inc: { totalOrders: 1, totalSpent: order.totalAmount } }),
      Notification.create({ userId: order.farmerId, title: 'New Paid Order', message: `Payment was confirmed for ${order.productName} (${order.quantity} ${order.unit}).`, type: 'ORDER' }),
      Notification.create({ userId: order.buyerId, title: 'Payment Confirmed', message: `Your payment for ${order.productName} was confirmed.`, type: 'ORDER' }),
      settlementService.processOrderSettlement(payment, order),
    ]);

    // Execute Blockchain Payment Capture Audit Record
    const orderId = order._id.toString();
    const paymentId = payment._id.toString();
    const buyerId = order.buyerId.toString();
    const farmerId = order.farmerId.toString();
    const razorpayPaymentId = payment.razorpayPaymentId || payment._id.toString();
    const amountCapturedPaise = payment.amount;

    blockchainService.recordPaymentEvent(
      paymentId,
      orderId,
      buyerId,
      [farmerId],
      razorpayPaymentId,
      amountCapturedPaise,
      2 // PaymentStatus.CAPTURED
    ).catch(err => console.error('[PaymentService] Blockchain payment audit recording failed gracefully:', err.message));
  }

  result(payment, order) {
    return { success: true, payment, order, verified: payment.status === 'CAPTURED' };
  }

  async getPaymentStatus(id, buyerId) {
    const payment = await Payment.findById(id);
    if (!payment) throw fail('Payment not found.', 404);
    if (payment.buyerId.toString() !== buyerId.toString()) throw fail('Not authorized.', 403);
    return this.result(payment);
  }

  async getPaymentByOrder(orderId) {
    return Payment.findOne({ orderId }).sort({ createdAt: -1 });
  }

  validWebhook(raw, signature) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret || !signature) return false;
    const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
    const given = Buffer.from(signature);
    const actual = Buffer.from(expected);
    return given.length === actual.length && crypto.timingSafeEqual(given, actual);
  }

  async processWebhook(raw, signature, eventId) {
    if (!this.validWebhook(raw, signature)) throw fail('Invalid webhook signature.', 401);
    let payload;
    try {
      payload = JSON.parse(raw.toString('utf8'));
    } catch {
      throw fail('Invalid webhook payload.');
    }
    const eventType = payload.event || 'unknown';
    const entity = payload.payload?.payment?.entity || payload.payload?.order?.entity || {};
    const id = eventId || crypto.createHash('sha256').update(raw).digest('hex');
    try {
      await PaymentWebhookEvent.create({ eventId: id, eventType, razorpayOrderId: entity.order_id || entity.id || '', razorpayPaymentId: entity.order_id ? entity.id : '' });
    } catch (error) {
      if (error.code === 11000) return { success: true, duplicate: true };
      throw error;
    }
    const razorpayOrderId = entity.order_id || (eventType.startsWith('order.') ? entity.id : '');
    if (razorpayOrderId) {
      const payment = await Payment.findOne({ razorpayOrderId });
      if (payment && entity.order_id) await this.applyGatewayPayment(payment, entity);
    }
    console.info('Razorpay webhook processed', { eventType, eventId: id, razorpayOrderId });
    return { success: true, duplicate: false };
  }
}

module.exports = new PaymentService();
