const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['FRUITS', 'VEGETABLES', 'GRAINS', 'PULSES', 'SPICES', 'MILLETS', 'DAIRY', 'OTHER'],
    required: [true, 'Category is required'],
  },
  description: {
    type: String,
    default: '',
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  unit: {
    type: String,
    enum: ['KG', 'QUINTAL', 'TON', 'LITRE', 'PIECE'],
    required: [true, 'Unit is required'],
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Price per unit is required'],
    min: [0, 'Price cannot be negative'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  harvestDate: {
    type: String,
    default: '',
  },
  availableFrom: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  farmerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  farmerVerificationStatus: {
    type: String,
    default: 'PENDING_VERIFICATION',
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DRAFT'],
    default: 'DRAFT',
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  orderCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for search
productSchema.index({ productName: 'text', description: 'text', location: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ farmerId: 1 });

module.exports = mongoose.model('Product', productSchema);
