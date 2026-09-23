const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['CREATED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED', 'REFUNDED'],
    default: 'CREATED',
  },
  paymentMethod: {
    type: String,
    default: '',
  },
  razorpayOrderId: {
    type: String,
    default: '',
  },
  razorpayPaymentId: {
    type: String,
    default: '',
  },
  verifiedAt: {
    type: Date,
  },
  failureReason: {
    type: String,
    default: '',
  },
  method: { type: String, default: '' },
  sideEffectsApplied: { type: Boolean, default: false },
}, {
  timestamps: true,
});

paymentSchema.index({ orderId: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
