const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  farmName: {
    type: String,
    required: [true, 'Farm/FPO name is required'],
    trim: true,
  },
  farmerType: {
    type: String,
    enum: ['FARMER', 'FPO'],
    default: 'FARMER',
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  address: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'],
    default: 'PENDING_VERIFICATION',
  },
  verificationNotes: {
    type: String,
    default: '',
  },
  verifiedAt: {
    type: Date,
  },
  totalProducts: {
    type: Number,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalSales: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Farmer', farmerSchema);
