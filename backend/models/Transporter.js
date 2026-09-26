const mongoose = require('mongoose');

const transporterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    default: 'GreenRoute Transport & Logistics',
  },
  transporterIdCode: {
    type: String,
    default: 'AGR-T-00025',
  },
  vehicleNumber: {
    type: String,
    default: 'MH-12-AG-4589',
  },
  vehicleType: {
    type: String,
    default: 'Refrigerated LCV (3.5T)',
  },
  operatingStates: [{
    type: String,
  }],
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'VERIFIED',
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  totalDeliveries: {
    type: Number,
    default: 38,
  },
  razorpayLinkedAccountId: {
    type: String,
    default: null,
  },
  razorpaySellerStatus: {
    type: String,
    default: 'ACTIVE',
  },
  razorpaySettlementEnabled: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transporter', transporterSchema);
