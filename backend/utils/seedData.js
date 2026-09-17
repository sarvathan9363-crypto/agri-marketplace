require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agribazaar';

const seedData = async () => {
  try {
    if (MONGODB_URI.includes('<db_username>')) {
      console.error('\n❌ ERROR: Please replace "<db_username>" in backend/.env with your actual database username before running seedData!\n');
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Farmer.deleteMany({});
    await Buyer.deleteMany({});
    await Product.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing data.');

    // --- Create Admin ---
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@agribazaar.com',
      mobileNumber: '9000000001',
      password: 'admin123',
      role: 'ADMIN',
    });
    console.log('✓ Admin created: admin@agribazaar.com / admin123');

    // --- Create Demo Farmer ---
    const farmerUser = await User.create({
      fullName: 'Rajesh Kumar',
      email: 'farmer@agribazaar.com',
      mobileNumber: '9000000002',
      password: 'farmer123',
      role: 'FARMER',
    });

    const farmer = await Farmer.create({
      userId: farmerUser._id,
      fullName: 'Rajesh Kumar',
      email: 'farmer@agribazaar.com',
      mobileNumber: '9000000002',
      farmName: 'Krishna Organic Farm',
      farmerType: 'FARMER',
      location: 'Nashik, Maharashtra',
      address: 'Village Ozar, Nashik District, Maharashtra 422206',
      description: 'Organic farming since 2015. Specializing in grains, vegetables, and fruits.',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
    });
    console.log('✓ Farmer created: farmer@agribazaar.com / farmer123');

    // --- Create Demo FPO ---
    const fpoUser = await User.create({
      fullName: 'Lakshmi Devi',
      email: 'fpo@agribazaar.com',
      mobileNumber: '9000000005',
      password: 'fpo12345',
      role: 'FARMER',
    });

    const fpo = await Farmer.create({
      userId: fpoUser._id,
      fullName: 'Lakshmi Devi',
      email: 'fpo@agribazaar.com',
      mobileNumber: '9000000005',
      farmName: 'Green Valley FPO',
      farmerType: 'FPO',
      location: 'Anantapur, Andhra Pradesh',
      address: 'FPO Office, Main Road, Anantapur, AP 515001',
      description: 'Farmer Producer Organization with 150+ member farmers. Specializing in millets and pulses.',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
    });
    console.log('✓ FPO created: fpo@agribazaar.com / fpo12345');

    // --- Create Demo Buyer ---
    const buyerUser = await User.create({
      fullName: 'Priya Sharma',
      email: 'buyer@agribazaar.com',
      mobileNumber: '9000000003',
      password: 'buyer123',
      role: 'BUYER',
    });

    const buyer = await Buyer.create({
      userId: buyerUser._id,
      fullName: 'Priya Sharma',
      email: 'buyer@agribazaar.com',
      mobileNumber: '9000000003',
      buyerType: 'INDIVIDUAL',
      address: '45, MG Road, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    });
    console.log('✓ Buyer created: buyer@agribazaar.com / buyer123');

    // --- Create Demo Bulk Buyer ---
    const bulkBuyerUser = await User.create({
      fullName: 'Metro Fresh Mart',
      email: 'bulk@agribazaar.com',
      mobileNumber: '9000000004',
      password: 'bulk1234',
      role: 'BUYER',
    });

    await Buyer.create({
      userId: bulkBuyerUser._id,
      fullName: 'Metro Fresh Mart',
      email: 'bulk@agribazaar.com',
      mobileNumber: '9000000004',
      buyerType: 'BULK_BUYER',
      address: '12, Industrial Area, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    });
    console.log('✓ Bulk Buyer created: bulk@agribazaar.com / bulk1234');

    // --- Create Demo Products ---
    const products = [
      {
        productName: 'Basmati Rice',
        category: 'GRAINS',
        description: 'Premium aged Basmati rice from the foothills of the Himalayas. Long grain, aromatic, and perfect for biryanis and pulao. Organically grown without pesticides.',
        quantity: 500,
        unit: 'KG',
        pricePerUnit: 85,
        location: 'Nashik, Maharashtra',
        harvestDate: '2024-09-01',
        availableFrom: '2024-09-15',
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
        farmerId: farmer._id,
        farmerUserId: farmerUser._id,
        farmerName: 'Krishna Organic Farm',
        farmerVerificationStatus: 'VERIFIED',
        status: 'ACTIVE',
      },
      {
        productName: 'Fresh Tomato',
        category: 'VEGETABLES',
        description: 'Farm-fresh red tomatoes, handpicked and naturally ripened. Rich in vitamins and antioxidants. Ideal for cooking, salads, and sauces.',
        quantity: 200,
        unit: 'KG',
        pricePerUnit: 30,
        location: 'Nashik, Maharashtra',
        harvestDate: '2024-10-01',
        availableFrom: '2024-10-02',
        images: ['https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400'],
        farmerId: farmer._id,
        farmerUserId: farmerUser._id,
        farmerName: 'Krishna Organic Farm',
        farmerVerificationStatus: 'VERIFIED',
        status: 'ACTIVE',
      },
      {
        productName: 'Onion',
        category: 'VEGETABLES',
        description: 'High-quality red onions from Nashik, known as the onion capital of India. Perfect for everyday cooking. Fresh harvest, minimal storage.',
        quantity: 1000,
        unit: 'KG',
        pricePerUnit: 25,
        location: 'Nashik, Maharashtra',
        harvestDate: '2024-09-20',
        availableFrom: '2024-09-25',
        images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400'],
        farmerId: farmer._id,
        farmerUserId: farmerUser._id,
        farmerName: 'Krishna Organic Farm',
        farmerVerificationStatus: 'VERIFIED',
        status: 'ACTIVE',
      },
      {
        productName: 'Banana (Elaichi)',
        category: 'FRUITS',
        description: 'Sweet and aromatic Elaichi bananas, small-sized and perfect for snacking. Naturally ripened on the farm. Rich in potassium and fiber.',
        quantity: 300,
        unit: 'KG',
        pricePerUnit: 40,
        location: 'Nashik, Maharashtra',
        harvestDate: '2024-10-05',
        availableFrom: '2024-10-06',
        images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'],
        farmerId: farmer._id,
        farmerUserId: farmerUser._id,
        farmerName: 'Krishna Organic Farm',
        farmerVerificationStatus: 'VERIFIED',
        status: 'ACTIVE',
      },
      {
        productName: 'Turmeric (Haldi)',
        category: 'SPICES',
        description: 'Premium quality turmeric from the farms of Maharashtra. High curcumin content. Sun-dried and ground fresh. Ideal for cooking and medicinal use.',
        quantity: 100,
        unit: 'KG',
        pricePerUnit: 120,
        location: 'Nashik, Maharashtra',
        harvestDate: '2024-08-15',
        availableFrom: '2024-09-01',
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400'],
        farmerId: farmer._id,
        farmerUserId: farmerUser._id,
        farmerName: 'Krishna Organic Farm',
        farmerVerificationStatus: 'VERIFIED',
        status: 'ACTIVE',
      },
      {
        productName: 'Green Gram (Moong Dal)',
        category: 'PULSES',
        description: 'Whole green gram, organically grown. Excellent source of plant protein. Perfect for sprouts, dal, and traditional Indian dishes.',
        quantity: 250,
        unit: 'KG',
        pricePerUnit: 95,
        location: 'Anantapur, Andhra Pradesh',
        harvestDate: '2024-09-10',
        availableFrom: '2024-09-20',
        images: ['https://images.unsplash.com/photo-1585996839228-ce8bc2cb1605?w=400'],
        farmerId: fpo._id,
        farmerUserId: fpoUser._id,
        farmerName: 'Green Valley FPO',
        farmerVerificationStatus: 'VERIFIED',
        status: 'ACTIVE',
      },
      {
        productName: 'Groundnut',
        category: 'OTHER',
        description: 'Fresh groundnuts harvested from the red soil of Andhra Pradesh. High oil content, perfect for cooking, snacking, and oil extraction.',
        quantity: 400,
        unit: 'KG',
        pricePerUnit: 70,
        location: 'Anantapur, Andhra Pradesh',
        harvestDate: '2024-09-05',
        availableFrom: '2024-09-15',
        images: ['https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=400'],
        farmerId: fpo._id,
        farmerUserId: fpoUser._id,
        farmerName: 'Green Valley FPO',
        farmerVerificationStatus: 'VERIFIED',
        status: 'ACTIVE',
      },
      {
        productName: 'Finger Millet (Ragi)',
        category: 'MILLETS',
        description: 'Nutritious finger millet from the dryland farms of Andhra Pradesh. Rich in calcium and iron. Ideal for ragi mudde, porridge, and healthy baking.',
        quantity: 300,
        unit: 'KG',
        pricePerUnit: 55,
        location: 'Anantapur, Andhra Pradesh',
        harvestDate: '2024-08-20',
        availableFrom: '2024-09-01',
        images: ['https://images.unsplash.com/photo-1586444248879-bc604bc77dac?w=400'],
        farmerId: fpo._id,
        farmerUserId: fpoUser._id,
        farmerName: 'Green Valley FPO',
        farmerVerificationStatus: 'VERIFIED',
        status: 'ACTIVE',
      },
      {
        productName: 'Potato',
        category: 'VEGETABLES',
        description: 'Fresh potatoes from the farms of Maharashtra. Medium-sized, clean, and ready for cooking. Ideal for curries, fries, and traditional dishes.',
        quantity: 800,
        unit: 'KG',
        pricePerUnit: 20,
        location: 'Nashik, Maharashtra',
        harvestDate: '2024-10-01',
        availableFrom: '2024-10-03',
        images: ['https://images.unsplash.com/photo-1518977676601-b53f82ber40?w=400'],
        farmerId: farmer._id,
        farmerUserId: farmerUser._id,
        farmerName: 'Krishna Organic Farm',
        farmerVerificationStatus: 'VERIFIED',
        status: 'ACTIVE',
      },
      {
        productName: 'Alphonso Mango',
        category: 'FRUITS',
        description: 'Premium Alphonso mangoes from Ratnagiri, Maharashtra. Known as the king of mangoes. Naturally ripened, sweet, and aromatic. Seasonal produce.',
        quantity: 150,
        unit: 'KG',
        pricePerUnit: 350,
        location: 'Ratnagiri, Maharashtra',
        harvestDate: '2024-04-15',
        availableFrom: '2024-04-20',
        images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'],
        farmerId: farmer._id,
        farmerUserId: farmerUser._id,
        farmerName: 'Krishna Organic Farm',
        farmerVerificationStatus: 'VERIFIED',
        status: 'ACTIVE',
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✓ ${createdProducts.length} demo products created.`);

    // Update farmer product counts
    await Farmer.findByIdAndUpdate(farmer._id, { totalProducts: 7 });
    await Farmer.findByIdAndUpdate(fpo._id, { totalProducts: 3 });

    // Create welcome notifications
    await Notification.create({
      userId: farmerUser._id,
      title: 'Account Verified!',
      message: 'Your farmer account has been verified. You can now publish active listings.',
      type: 'VERIFICATION',
    });

    console.log('\n🌾 Seed data created successfully!\n');
    console.log('Demo Accounts:');
    console.log('─────────────────────────────────────────');
    console.log('Admin:      admin@agribazaar.com  / admin123');
    console.log('Farmer:     farmer@agribazaar.com / farmer123');
    console.log('FPO:        fpo@agribazaar.com    / fpo12345');
    console.log('Buyer:      buyer@agribazaar.com  / buyer123');
    console.log('Bulk Buyer: bulk@agribazaar.com   / bulk1234');
    console.log('─────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
