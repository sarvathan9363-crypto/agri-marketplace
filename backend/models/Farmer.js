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
  walletAddress: {
    type: String,
    default: null,
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
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      referenceId: { type: String, default: null },
      verifiedName: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    farmerRegistry: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      farmerIdMasked: { type: String, default: null },
      state: { type: String, default: null },
      district: { type: String, default: null },
      referenceId: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    landRecord: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
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
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
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
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
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
    // FPO / FPC Specific Verification Fields
    orgIdentity: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      orgName: { type: String, default: null },
      orgType: { type: String, default: null },
      registrationNumber: { type: String, default: null },
      cin: { type: String, default: null },
      state: { type: String, default: null },
      district: { type: String, default: null },
      address: { type: String, default: null },
      pincode: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    orgPan: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      panMasked: { type: String, default: null },
      nameMatch: { type: Boolean, default: null },
      verifiedAt: { type: Date, default: null },
    },
    gstin: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed', 'not_applicable'], default: 'pending' },
      gstinNumber: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    representative: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      repName: { type: String, default: null },
      designation: { type: String, default: null },
      mobileNumber: { type: String, default: null },
      referenceId: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    orgBank: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      accountHolderName: { type: String, default: null },
      accountNumberMasked: { type: String, default: null },
      bankName: { type: String, default: null },
      branchName: { type: String, default: null },
      ifsc: { type: String, default: null },
      nameMatch: { type: Boolean, default: null },
      verifiedAt: { type: Date, default: null },
    },
    orgDocuments: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed', 'under_review'], default: 'pending' },
      regCertUploaded: { type: Boolean, default: false },
      panDocUploaded: { type: Boolean, default: false },
      bankProofUploaded: { type: Boolean, default: false },
      authDocUploaded: { type: Boolean, default: false },
      gstCertUploaded: { type: Boolean, default: false },
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
  // Razorpay Route / Marketplace Seller Settlement Fields
  razorpaySellerStatus: {
    type: String,
    enum: ['NOT_STARTED', 'ONBOARDING', 'PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'],
    default: 'NOT_STARTED',
  },
  razorpayLinkedAccountId: {
    type: String,
    default: null,
  },
  razorpayAccountReference: {
    type: String,
    default: null,
  },
  razorpayOnboardingStatus: {
    type: String,
    default: null,
  },
  razorpayActivationStatus: {
    type: String,
    default: null,
  },
  razorpayLastSyncedAt: {
    type: Date,
    default: null,
  },
  razorpayOnboardingUrl: {
    type: String,
    default: null,
  },
  razorpayRejectionReason: {
    type: String,
    default: null,
  },
  razorpaySettlementEnabled: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Farmer', farmerSchema);
