const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner User ID is required'],
    index: true,
  },
  ownerType: {
    type: String,
    enum: ['FARMER', 'BUYER', 'ADMIN', 'FPO'],
    default: 'FARMER',
  },
  category: {
    type: String,
    enum: ['VERIFICATION', 'PRODUCT', 'PROFILE', 'ORDER'],
    required: [true, 'Category is required'],
    index: true,
  },
  subCategory: {
    type: String,
    enum: [
      'IDENTITY', 'FARMER_ID', 'LAND', 'BANK', 'PAN', 'PM_KISAN', 'OTHER',
      'REGISTRATION', 'GST', 'AUTHORIZATION', 'UDYAM', 'FSSAI',
      'ADDRESS', 'BUSINESS', 'REPRESENTATIVE',
      'AVATAR', 'IMAGES', 'DOCUMENTS',
    ],
    required: [true, 'SubCategory is required'],
    index: true,
  },
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
  },
  entityType: {
    type: String,
    enum: ['USER', 'VERIFICATION', 'PRODUCT', 'ORDER'],
    default: 'VERIFICATION',
  },
  entityId: {
    type: String,
    default: '',
    index: true,
  },
  fileName: {
    type: String,
    required: [true, 'Original file name is required'],
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required'],
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
  },
  cloudinaryPublicId: {
    type: String,
    required: [true, 'Cloudinary public ID is required'],
  },
  secureUrl: {
    type: String,
    required: [true, 'Cloudinary secure URL is required'],
  },
  resourceType: {
    type: String,
    default: 'auto',
  },
  format: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['UPLOADED', 'REPLACED', 'DELETED'],
    default: 'UPLOADED',
    index: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Compound indexes for optimized file queries
uploadedFileSchema.index({ ownerId: 1, category: 1, subCategory: 1, status: 1 });
uploadedFileSchema.index({ entityType: 1, entityId: 1, status: 1 });

module.exports = mongoose.model('UploadedFile', uploadedFileSchema);
