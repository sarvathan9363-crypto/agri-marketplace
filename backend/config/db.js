const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agribazaar';

  if (uri.includes('<db_username>')) {
    console.warn('\n⚠️  WARNING: MONGODB_URI contains "<db_username>" placeholder in backend/.env!');
    console.warn('👉 Please replace "<db_username>" in backend/.env with your actual MongoDB database username (e.g. admin or agribazaar_user).\n');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('👉 Make sure your IP is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0) and credentials in backend/.env are correct.');
  }
};

module.exports = connectDB;
