const mongoose = require('mongoose');

const marketplaceSettlementSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  razorpayLinkedAccountId: {
    type: String,
    default: null,
  },
  grossAmount: {
    type: Number,
    required: true,
  },
  platformCommission: {
    type: Number,
    required: true,
  },
  sellerAmount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'TRANSFERRED', 'FAILED', 'REVERSED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
    default: 'PENDING',
  },
  razorpayTransferId: {
    type: String,
    default: null,
  },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
  failureReason: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

marketplaceSettlementSchema.index({ orderId: 1 });
marketplaceSettlementSchema.index({ farmerId: 1 });
marketplaceSettlementSchema.index({ razorpayTransferId: 1 });
marketplaceSettlementSchema.index({ status: 1 });
marketplaceSettlementSchema.index({ orderId: 1, farmerId: 1 }, { unique: true });

module.exports = mongoose.model('MarketplaceSettlement', marketplaceSettlementSchema);
