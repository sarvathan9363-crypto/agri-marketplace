const mongoose = require('mongoose');

const transportQuotationSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransportRequest',
    required: true,
    index: true,
  },
  requestNumber: {
    type: String,
    default: '',
  },
  transporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  transporterName: {
    type: String,
    required: true,
  },
  transporterCompany: {
    type: String,
    default: 'Express Agri-Logistics',
  },
  vehicleType: {
    type: String,
    default: 'Light Commercial Vehicle',
  },
  vehicleNumber: {
    type: String,
    default: 'MH-12-AG-4589',
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  totalDeliveries: {
    type: Number,
    default: 24,
  },
  quotedWeightKg: {
    type: Number,
    default: 100,
  },
  quotedItemCount: {
    type: Number,
    default: 1,
  },
  estimatedPickup: {
    type: String,
    default: 'Tomorrow Morning',
  },
  estimatedDelivery: {
    type: String,
    default: 'Within 2 Days',
  },
  transportCharge: {
    type: Number,
    required: true,
  },
  loadingCharge: {
    type: Number,
    default: 0,
  },
  unloadingCharge: {
    type: Number,
    default: 0,
  },
  tollCharge: {
    type: Number,
    default: 0,
  },
  handlingCharge: {
    type: Number,
    default: 0,
  },
  otherCharges: {
    type: Number,
    default: 0,
  },
  totalQuote: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'SELECTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED', 'SUPERSEDED'],
    default: 'SUBMITTED',
    index: true,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

transportQuotationSchema.index({ requestId: 1, transporterId: 1 });

module.exports = mongoose.model('TransportQuotation', transportQuotationSchema);
