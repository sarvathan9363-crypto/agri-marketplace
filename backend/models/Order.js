const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    default: '',
  },
  quantity: {
    type: Number,
    required: true,
    min: [0.01, 'Quantity must be greater than 0'],
  },
  unit: {
    type: String,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
  },
  orderStatus: {
    type: String,
    enum: ['CREATED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'],
    default: 'CREATED',
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Delivery address is required'],
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
  paymentId: {
    type: String,
    default: '',
  },
  cancellationReason: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

orderSchema.index({ buyerId: 1, orderStatus: 1 });
orderSchema.index({ farmerId: 1, orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
