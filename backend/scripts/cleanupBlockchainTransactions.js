require('dotenv').config();
const mongoose = require('mongoose');

async function cleanupOldBlockchainTransactions() {
  console.log('⚠️  AgriBazaar MongoDB One-Time Cleanup Script');
  console.log('Target Collection: db.blockchaintransactions ONLY\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agribazaar';

  try {
    console.log(`Connecting to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***@')}...`);
    await mongoose.connect(mongoUri);

    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'blockchaintransactions' }).toArray();

    if (collections.length === 0) {
      console.log('ℹ️ Collection "blockchaintransactions" does not exist in MongoDB. Nothing to clean.');
      process.exit(0);
    }

    const count = await db.collection('blockchaintransactions').countDocuments();
    console.log(`Found ${count} records in "blockchaintransactions" collection.`);

    if (process.argv.includes('--confirm')) {
      console.log('Executing drop on collection "blockchaintransactions"...');
      await db.collection('blockchaintransactions').drop();
      console.log('✅ Collection "blockchaintransactions" successfully dropped.');
    } else {
      console.log('\n⚠️  DRY RUN MODE: No data was modified.');
      console.log('To perform deletion, re-run with: node scripts/cleanupBlockchainTransactions.js --confirm\n');
    }
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}

cleanupOldBlockchainTransactions();
