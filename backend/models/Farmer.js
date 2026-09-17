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
  verification: {
    aadhaar: {
      status: { type: String, enum: ['pending', 'verified', 'failed'], default: 'pending' },
      referenceId: { type: String, default: null },
      verifiedName: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    farmerRegistry: {
      status: { type: String, enum: ['pending', 'verified', 'failed'], default: 'pending' },
      farmerIdMasked: { type: String, default: null },
      state: { type: String, default: null },
      district: { type: String, default: null },
      referenceId: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    landRecord: {
      status: { type: String, enum: ['pending', 'verified', 'failed'], default: 'pending' },
      state: { type: String, default: null },
      district: { type: String, default: null },
      taluk: { type: String, default: null },
      village: { type: String, default: null },
      pattaNumberMasked: { type: String, default: null },
      surveyNumber: { type: String, default: null },
      subdivisionNumber: { type: String, default: null },
      landType: { type: String, default: null },
      extent: { type: String, default: null },
      ownershipMatch: { type: Boolean, default: null },
      isTenant: { type: Boolean, default: false },
      verifiedAt: { type: Date, default: null },
    },
    bankAccount: {
      status: { type: String, enum: ['pending', 'verified', 'failed'], default: 'pending' },
      accountHolderName: { type: String, default: null },
      accountNumberMasked: { type: String, default: null },
      bankName: { type: String, default: null },
      branchName: { type: String, default: null },
      ifsc: { type: String, default: null },
      nameMatch: { type: Boolean, default: null },
      referenceId: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    pan: {
      status: { type: String, enum: ['pending', 'verified', 'failed'], default: 'pending' },
      panMasked: { type: String, default: null },
      nameMatch: { type: Boolean, default: null },
      referenceId: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    pmKisan: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      referenceId: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    overallStatus: {
      type: String,
      enum: ['incomplete', 'verified'],
      default: 'incomplete',
    },
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
