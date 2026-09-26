const mongoose = require('mongoose');

const transportRequestSchema = new mongoose.Schema({
  requestNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  orderGroupId: {
    type: String,
    default: '',
    index: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  buyerName: {
    type: String,
    default: '',
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  farmerName: {
    type: String,
    default: '',
  },
  itemsSnapshot: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'KG' },
    weightKg: { type: Number, default: 0 },
  }],
  pickupLocation: {
    type: String,
    required: true,
  },
  deliveryLocation: {
    type: String,
    required: true,
  },
  deliveryCity: {
    type: String,
    default: '',
  },
  deliveryState: {
    type: String,
    default: '',
  },
  deliveryPincode: {
    type: String,
    default: '',
  },
  cropName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  totalWeightKg: {
    type: Number,
    default: 100,
  },
  itemCount: {
    type: Number,
    default: 1,
  },
  requiredVehicleType: {
    type: String,
    default: 'Any / Light Commercial Vehicle',
  },
  specialRequirements: {
    type: String,
    default: 'Standard Agricultural Produce Handling',
  },
  status: {
    type: String,
    enum: [
      'OPEN',
      'QUOTES_RECEIVED',
      'QUOTATION_SELECTED',
      'ASSIGNED',
      'PICKUP_SCHEDULED',
      'PICKED_UP',
      'IN_TRANSIT',
      'DELIVERED',
      'SUPERSEDED',
      'CANCELLED',
      'EXPIRED'
    ],
    default: 'OPEN',
    index: true,
  },
  selectedQuotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransportQuotation',
    default: null,
  },
  transporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  confirmedTransportCharge: {
    type: Number,
    default: 0,
  },
  cancellationReason: {
    type: String,
    default: '',
  },
  version: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

transportRequestSchema.index({ buyerId: 1, status: 1 });
transportRequestSchema.index({ farmerId: 1, status: 1 });

module.exports = mongoose.model('TransportRequest', transportRequestSchema);
