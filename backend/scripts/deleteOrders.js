const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Order = require('../models/Order');
const TransportRequest = require('../models/TransportRequest');
const TransportQuotation = require('../models/TransportQuotation');
const Payment = require('../models/Payment');
const PaymentWebhookEvent = require('../models/PaymentWebhookEvent');
const MarketplaceSettlement = require('../models/MarketplaceSettlement');
const Dispute = require('../models/Dispute');
const Notification = require('../models/Notification');
const Cart = require('../models/Cart');

async function deleteAllOrdersData() {
  await connectDB();

  console.log('Clearing all order and transport records from database...');

  const ordersRes = await Order.deleteMany({});
  console.log(`Deleted ${ordersRes.deletedCount} Orders.`);

  const trRes = await TransportRequest.deleteMany({});
  console.log(`Deleted ${trRes.deletedCount} Transport Requests.`);

  const tqRes = await TransportQuotation.deleteMany({});
  console.log(`Deleted ${tqRes.deletedCount} Transport Quotations.`);

  const payRes = await Payment.deleteMany({});
  console.log(`Deleted ${payRes.deletedCount} Payment Records.`);

  const payWhRes = await PaymentWebhookEvent.deleteMany({});
  console.log(`Deleted ${payWhRes.deletedCount} Payment Webhook Events.`);

  const msRes = await MarketplaceSettlement.deleteMany({});
  console.log(`Deleted ${msRes.deletedCount} Marketplace Settlements.`);

  const dispRes = await Dispute.deleteMany({});
  console.log(`Deleted ${dispRes.deletedCount} Disputes.`);

  const notifRes = await Notification.deleteMany({ type: { $in: ['ORDER', 'TRANSPORT', 'PAYMENT'] } });
  console.log(`Deleted ${notifRes.deletedCount} Order/Transport/Payment Notifications.`);

  const cartRes = await Cart.updateMany({}, { items: [], totalAmount: 0 });
  console.log(`Reset ${cartRes.modifiedCount} Carts.`);

  console.log('✅ All available orders and associated records deleted successfully.');
  process.exit(0);
}

deleteAllOrdersData().catch((err) => {
  console.error('Error deleting orders:', err);
  process.exit(1);
});
