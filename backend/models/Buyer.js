const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
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
  buyerType: {
    type: String,
    enum: ['INDIVIDUAL', 'BUSINESS', 'BULK_BUYER'],
    default: 'INDIVIDUAL',
  },
  address: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  pincode: {
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
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'],
    default: 'PENDING_VERIFICATION',
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  verification: {
    mobile: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      referenceId: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    identity: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      referenceId: { type: String, default: null },
      verifiedName: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    address: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      address: { type: String, default: null },
      state: { type: String, default: null },
      district: { type: String, default: null },
      city: { type: String, default: null },
      pincode: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    business: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      legalName: { type: String, default: null },
      tradeName: { type: String, default: null },
      businessType: { type: String, default: null },
      address: { type: String, default: null },
      state: { type: String, default: null },
      district: { type: String, default: null },
      city: { type: String, default: null },
      pincode: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    pan: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed'], default: 'pending' },
      panMasked: { type: String, default: null },
      nameMatch: { type: Boolean, default: null },
      referenceId: { type: String, default: null },
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
      authDocUploaded: { type: Boolean, default: false },
      referenceId: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    bank: {
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
    udyam: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed', 'not_applicable'], default: 'pending' },
      udyamNumber: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    fssai: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed', 'not_applicable'], default: 'pending' },
      fssaiNumber: { type: String, default: null },
      licenseType: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    documents: {
      status: { type: String, enum: ['pending', 'verified', 'skipped', 'failed', 'under_review'], default: 'pending' },
      businessCert: { type: Boolean, default: false },
      panDoc: { type: Boolean, default: false },
      bankProof: { type: Boolean, default: false },
      authDoc: { type: Boolean, default: false },
      gstCert: { type: Boolean, default: false },
      udyamCert: { type: Boolean, default: false },
      fssaiCert: { type: Boolean, default: false },
      verifiedAt: { type: Date, default: null },
    },
    overallStatus: {
      type: String,
      enum: ['incomplete', 'verified'],
      default: 'incomplete',
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Buyer', buyerSchema);
