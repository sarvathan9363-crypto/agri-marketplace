const mongoose = require('mongoose');

// Razorpay can retry webhooks. Keeping only the delivery identifier makes
// processing idempotent without retaining sensitive payload data.
const paymentWebhookEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  eventType: { type: String, required: true },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('PaymentWebhookEvent', paymentWebhookEventSchema);
