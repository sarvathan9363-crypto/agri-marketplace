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
    enum: ['PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
  },
  paymentMethod: {
    type: String,
    default: '',
  },
  gatewayOrderId: {
    type: String,
    default: '',
  },
  gatewayPaymentId: {
    type: String,
    default: '',
  },
  gatewaySignature: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
