const Farmer = require('../models/Farmer');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get farmer profile
// @route   GET /api/farmers/profile
exports.getProfile = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }
    res.json({ success: true, farmer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farmer profile
// @route   PUT /api/farmers/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, farmName, location, address, description } = req.body;

    const farmer = await Farmer.findOneAndUpdate(
      { userId: req.user._id },
      { fullName, farmName, location, address, description },
      { new: true, runValidators: true }
    );

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    res.json({ success: true, message: 'Profile updated successfully.', farmer });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer products
// @route   GET /api/farmers/products
exports.getMyProducts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const farmer = await Farmer.findOne({ userId: req.user._id });

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const query = { farmerId: farmer._id };
    if (status && status !== 'ALL') query.status = status;
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

// @desc    Get farmer sales stats
// @route   GET /api/farmers/sales
exports.getSalesStats = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const totalProducts = await Product.countDocuments({ farmerId: farmer._id });
    const activeListings = await Product.countDocuments({ farmerId: farmer._id, status: 'ACTIVE' });
    const pendingOrders = await Order.countDocuments({ farmerId: req.user._id, orderStatus: 'CREATED' });
    const confirmedOrders = await Order.countDocuments({ farmerId: req.user._id, orderStatus: 'CONFIRMED' });
    const completedOrders = await Order.countDocuments({ farmerId: req.user._id, orderStatus: 'DELIVERED' });

    // Monthly sales aggregation
    const monthlySales = await Order.aggregate([
      { $match: { farmerId: req.user._id, paymentStatus: 'SUCCESSFUL' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        activeListings,
        pendingOrders,
        confirmedOrders,
        completedOrders,
        totalSales: farmer.totalSales,
        totalOrders: farmer.totalOrders,
        monthlySales,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer dashboard
// @route   GET /api/farmers/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const totalProducts = await Product.countDocuments({ farmerId: farmer._id });
    const activeListings = await Product.countDocuments({ farmerId: farmer._id, status: 'ACTIVE' });
    const pendingOrders = await Order.countDocuments({ farmerId: req.user._id, orderStatus: { $in: ['CREATED', 'CONFIRMED'] } });
    const completedOrders = await Order.countDocuments({ farmerId: req.user._id, orderStatus: 'DELIVERED' });

    const recentOrders = await Order.find({ farmerId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const activeProducts = await Product.find({ farmerId: farmer._id, status: 'ACTIVE' })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      dashboard: {
        totalProducts,
        activeListings,
        pendingOrders,
        completedOrders,
        totalSales: farmer.totalSales,
        verificationStatus: farmer.verificationStatus,
        recentOrders,
        activeProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer verification status
// @route   GET /api/farmers/verification
exports.getVerificationStatus = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    res.json({
      success: true,
      verification: {
        status: farmer.verificationStatus,
        notes: farmer.verificationNotes,
        verifiedAt: farmer.verifiedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
