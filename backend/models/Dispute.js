const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  raisedByName: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
    default: 'OPEN',
  },
  adminResponse: {
    type: String,
    default: '',
  },
  resolvedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Dispute', disputeSchema);
