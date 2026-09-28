require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Farmer = require('../models/Farmer');

const TARGET_PHONE = '9600598613';
const FORMATTED_EMAIL = 'farmer.9600598613@agribazaar.in';

async function seedFarmer() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  try {
    // 1. Check or create User
    let user = await User.findOne({
      $or: [
        { mobileNumber: TARGET_PHONE },
        { mobileNumber: `+91${TARGET_PHONE}` },
        { mobileNumber: `0${TARGET_PHONE}` },
        { email: FORMATTED_EMAIL }
      ]
    });

    if (!user) {
      console.log(`Creating User account for phone: ${TARGET_PHONE}...`);
      user = await User.create({
        fullName: 'Murugan Selvan',
        email: FORMATTED_EMAIL,
        mobileNumber: TARGET_PHONE,
        password: 'Password@123',
        role: 'FARMER',
        active: true
      });
      console.log(`✅ User created with ID: ${user._id}`);
    } else {
      console.log(`Found existing user ID: ${user._id}, updating phone to ${TARGET_PHONE}...`);
      user.mobileNumber = TARGET_PHONE;
      await user.save();
    }

    // 2. Check or create Farmer Profile
    let farmer = await Farmer.findOne({
      $or: [
        { userId: user._id },
        { mobileNumber: TARGET_PHONE },
        { mobileNumber: `+91${TARGET_PHONE}` },
        { mobileNumber: `0${TARGET_PHONE}` }
      ]
    });

    const farmerData = {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: TARGET_PHONE,
      farmName: 'Selvan Organic Farm',
      farmerType: 'FARMER',
      location: 'Pollachi, Coimbatore',
      address: '12/4 East Street, Pollachi, Coimbatore, Tamil Nadu - 642001',
      description: 'Cultivating premium quality organic tomatoes, onions, and vegetables for over 15 years.',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
      verificationNotes: 'Verified via AgriVoice phone onboarding test profile.',
      verification: {
        aadhaar: {
          status: 'verified',
          referenceId: 'AADHAAR-96005-VERIFIED',
          verifiedName: 'Murugan Selvan',
          verifiedAt: new Date()
        },
        farmerRegistry: {
          status: 'verified',
          farmerIdMasked: 'TN-CBE-****8613',
          state: 'Tamil Nadu',
          district: 'Coimbatore',
          referenceId: 'REG-TN-2026-8613',
          verifiedAt: new Date()
        },
        landRecord: {
          status: 'verified',
          state: 'Tamil Nadu',
          district: 'Coimbatore',
          taluk: 'Pollachi',
          village: 'Anaimalai',
          pattaNumberMasked: 'PATTA-****-8613',
          surveyNumber: '142/3A',
          landType: 'WETLAND',
          extent: '4.5 Acres',
          ownershipMatch: true,
          isTenant: false,
          verifiedAt: new Date()
        },
        bankAccount: {
          status: 'verified',
          accountHolderName: 'Murugan Selvan',
          accountNumberMasked: '************8613',
          bankName: 'State Bank of India',
          branchName: 'Pollachi Main Branch',
          ifsc: 'SBIN0001234',
          verifiedAt: new Date()
        }
      },
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      rating: 4.8
    };

    if (!farmer) {
      console.log('Creating Farmer profile...');
      farmer = await Farmer.create(farmerData);
      console.log(`✅ Farmer profile created with ID: ${farmer._id}`);
    } else {
      console.log(`Updating existing Farmer profile ID: ${farmer._id}...`);
      Object.assign(farmer, farmerData);
      await farmer.save();
      console.log(`✅ Farmer profile updated successfully!`);
    }

    console.log('\n====================================================');
    console.log('🌾 FARMER DUMMY RECORD SEEDED SUCCESSFULLY:');
    console.log(`   - Name: ${farmer.fullName}`);
    console.log(`   - Farm Name: ${farmer.farmName}`);
    console.log(`   - Phone Number: ${farmer.mobileNumber}`);
    console.log(`   - Location: ${farmer.location}`);
    console.log(`   - Verification Status: ${farmer.verificationStatus}`);
    console.log(`   - Farmer ID: ${farmer._id}`);
    console.log(`   - User ID: ${farmer.userId}`);
    console.log('====================================================');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding farmer record:', error);
    process.exit(1);
  }
}

seedFarmer();
