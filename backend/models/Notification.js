const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['ORDER', 'VERIFICATION', 'PAYMENT', 'SYSTEM', 'DISPUTE'],
    default: 'SYSTEM',
  },
  read: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

notificationSchema.index({ userId: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
