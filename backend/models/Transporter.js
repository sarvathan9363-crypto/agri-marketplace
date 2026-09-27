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
  transporterType: {
    type: String,
    enum: ['INDIVIDUAL', 'BUSINESS'],
    default: 'INDIVIDUAL',
  },
  contactPerson: {
    type: String,
    default: '',
  },
  contactMobile: {
    type: String,
    default: '',
  },
  contactEmail: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  mobileNumber: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  district: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: 'Maharashtra',
  },
  pincode: {
    type: String,
    default: '',
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
  serviceAreas: [{
    type: String,
  }],
  verificationStatus: {
    type: String,
    enum: ['NOT_STARTED', 'PENDING_VERIFICATION', 'UNDER_REVIEW', 'ACTION_REQUIRED', 'VERIFIED', 'REJECTED', 'SUSPENDED'],
    default: 'NOT_STARTED',
    index: true,
  },
  verificationNotes: {
    type: String,
    default: '',
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  currentStep: {
    type: Number,
    default: 1,
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  totalDeliveries: {
    type: Number,
    default: 38,
  },
  // Multi-vehicle support
  vehicles: [{
    registrationNumber: { type: String, required: true },
    vehicleType: { type: String, default: 'LCV' },
    makeModel: { type: String, default: 'Tata Ace / Ashok Leyland Dost' },
    capacityKg: { type: Number, default: 1500 },
    rcDocUrl: { type: String, default: '' },
    insuranceDocUrl: { type: String, default: '' },
    fitnessDocUrl: { type: String, default: '' },
    pucDocUrl: { type: String, default: '' },
    permitDocUrl: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  }],
  // Multi-driver support
  drivers: [{
    driverName: { type: String, default: '' },
    name: { type: String, default: '' },
    mobileNumber: { type: String, default: '' },
    licenseNumber: { type: String, required: true },
    licenseDocUrl: { type: String, default: '' },
    licenseExpiry: { type: String, default: '' },
    assignedVehicleReg: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'verified', 'rejected', 'PENDING', 'VERIFIED', 'REJECTED'], default: 'pending' },
  }],
  // Verification progress breakdown
  verification: {
    basicDetails: {
      transporterType: { type: String, default: 'INDIVIDUAL' },
      companyName: { type: String, default: '' },
      contactPerson: { type: String, default: '' },
      mobileNumber: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
      state: { type: String, default: '' },
      district: { type: String, default: '' },
      pincode: { type: String, default: '' },
      serviceAreas: [{ type: String }],
      status: { type: String, enum: ['pending', 'submitted', 'verified', 'rejected', 'PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED'], default: 'pending' },
      verifiedAt: { type: Date, default: null },
    },
    identity: {
      status: { type: String, enum: ['pending', 'submitted', 'verified', 'rejected', 'PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED'], default: 'pending' },
      aadhaarMasked: { type: String, default: null },
      aadhaarNumberMasked: { type: String, default: null },
      aadhaarVerified: { type: Boolean, default: false },
      panMasked: { type: String, default: null },
      panNumber: { type: String, default: null },
      panVerified: { type: Boolean, default: false },
      idDocUrl: { type: String, default: null },
      panDocUrl: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    businessRegistration: {
      status: { type: String, enum: ['pending', 'submitted', 'verified', 'skipped', 'not_applicable', 'PENDING', 'SUBMITTED', 'VERIFIED', 'SKIPPED'], default: 'pending' },
      gstinNumber: { type: String, default: null },
      gstin: { type: String, default: null },
      gstinDocUrl: { type: String, default: null },
      gstDocUrl: { type: String, default: null },
      udyamNumber: { type: String, default: null },
      udyamDocUrl: { type: String, default: null },
      regCertDocUrl: { type: String, default: null },
      businessType: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    bankAccount: {
      status: { type: String, enum: ['pending', 'submitted', 'verified', 'rejected', 'PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED'], default: 'pending' },
      accountHolderName: { type: String, default: null },
      accountNumberMasked: { type: String, default: null },
      bankName: { type: String, default: null },
      branchName: { type: String, default: null },
      ifsc: { type: String, default: null },
      bankProofDocUrl: { type: String, default: null },
      accountNumber: { type: String, default: null },
      cancelledChequeDocUrl: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
    vehiclesStep: {
      status: { type: String, enum: ['pending', 'submitted', 'verified', 'rejected', 'PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED'], default: 'pending' },
      count: { type: Number, default: 0 },
      verifiedAt: { type: Date, default: null },
    },
    driversStep: {
      status: { type: String, enum: ['pending', 'submitted', 'verified', 'rejected', 'PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED'], default: 'pending' },
      count: { type: Number, default: 0 },
      verifiedAt: { type: Date, default: null },
    },
    overallStatus: {
      type: String,
      enum: ['incomplete', 'submitted', 'under_review', 'action_required', 'verified', 'rejected', 'NOT_STARTED', 'PENDING_VERIFICATION', 'SUBMITTED', 'UNDER_REVIEW', 'ACTION_REQUIRED', 'VERIFIED', 'REJECTED'],
      default: 'incomplete',
    },
    submittedAt: { type: Date, default: null },
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
