require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Transporter = require('../models/Transporter');

  // Reset transporters that are marked VERIFIED but have no submitted verification steps
  const result = await Transporter.updateMany(
    {
      verificationStatus: 'VERIFIED',
      $or: [
        { 'verification.basicDetails.status': { $ne: 'submitted' } },
        { 'verification.basicDetails': { $exists: false } },
        { verification: { $exists: false } },
      ]
    },
    { $set: { verificationStatus: 'NOT_STARTED' } }
  );

  console.log('Fixed', result.modifiedCount, 'transporter(s) with incorrect VERIFIED status -> NOT_STARTED');
  
  // Show remaining verified ones (these should have been properly admin-approved)
  const verified = await Transporter.countDocuments({ verificationStatus: 'VERIFIED' });
  console.log(verified, 'transporter(s) remain with VERIFIED status (correctly admin-approved)');

  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
