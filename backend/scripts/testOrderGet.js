const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Order = require('../models/Order');
const paymentService = require('../services/paymentService');

async function testGetOrder() {
  await connectDB();
  const sampleOrder = await Order.findOne();
  if (!sampleOrder) {
    console.log('No order found to test.');
    process.exit(0);
  }

  const groupId = sampleOrder.orderGroupId || sampleOrder._id.toString();
  console.log('Testing lookup for orderGroupId:', groupId);

  const isObjId = mongoose.isValidObjectId(groupId);
  const payment = await paymentService.getPaymentByOrder(groupId);
  console.log('✅ Payment lookup succeeded without error:', payment ? payment._id : 'None');

  process.exit(0);
}

testGetOrder().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
