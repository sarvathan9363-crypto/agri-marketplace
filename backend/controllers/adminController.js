const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Dispute = require('../models/Dispute');
const Notification = require('../models/Notification');

// @desc    Admin dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await Farmer.countDocuments();
    const totalBuyers = await Buyer.countDocuments();
    const pendingVerifications = await Farmer.countDocuments({ verificationStatus: 'PENDING_VERIFICATION' });
    const activeProducts = await Product.countDocuments({ status: 'ACTIVE' });
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ orderStatus: 'DELIVERED' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'SUCCESSFUL' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // Monthly orders
    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    // Category distribution
    const categoryDistribution = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      dashboard: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        pendingVerifications,
        activeProducts,
        totalOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyOrders,
        categoryDistribution,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status === 'active') query.active = true;
    if (status === 'suspended') query.active = false;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      users,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id/status
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.active = !user.active;
    await user.save();

    res.json({ success: true, message: `User ${user.active ? 'activated' : 'suspended'}.`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all farmers for verification
// @route   GET /api/admin/farmers
exports.getFarmers = async (req, res, next) => {
  try {
    const { verificationStatus, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { farmName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Farmer.countDocuments(query);
    const farmers = await Farmer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      farmers,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify farmer
// @route   PUT /api/admin/farmers/:id/verify
exports.verifyFarmer = async (req, res, next) => {
  try {
    const { status, notes } = req.body; // VERIFIED or REJECTED
    const farmer = await Farmer.findById(req.params.id);

    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found.' });

    farmer.verificationStatus = status;
    farmer.verificationNotes = notes || '';
    if (status === 'VERIFIED') farmer.verifiedAt = new Date();
    await farmer.save();

    // Update products verification status
    if (status === 'VERIFIED') {
      await Product.updateMany(
        { farmerId: farmer._id },
        { farmerVerificationStatus: 'VERIFIED' }
      );
    }

    // Notify farmer
    const message = status === 'VERIFIED'
      ? 'Your farmer account has been verified! You can now publish active listings.'
      : `Your farmer verification was rejected. ${notes || ''}`;

    await Notification.create({
      userId: farmer.userId,
      title: status === 'VERIFIED' ? 'Account Verified!' : 'Verification Update',
      message,
      type: 'VERIFICATION',
    });

    res.json({ success: true, message: `Farmer ${status.toLowerCase()}.`, farmer });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (admin)
// @route   GET /api/admin/products
exports.getProducts = async (req, res, next) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) query.productName = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product status (admin)
// @route   PUT /api/admin/products/:id/status
exports.updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    res.json({ success: true, message: 'Product status updated.', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
exports.getOrders = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { buyerName: { $regex: search, $options: 'i' } },
        { farmerName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      orders,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (admin)
// @route   GET /api/admin/payments
exports.getPayments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      payments,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } },
    ]);

    const farmerRegistrations = await Farmer.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const orderStatusDistribution = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      analytics: {
        monthlyOrders,
        categoryStats,
        farmerRegistrations,
        orderStatusDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};
