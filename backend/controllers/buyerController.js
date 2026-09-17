const Buyer = require('../models/Buyer');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get buyer profile
// @route   GET /api/buyers/profile
exports.getProfile = async (req, res, next) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }
    res.json({ success: true, buyer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update buyer profile
// @route   PUT /api/buyers/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, address, city, state, pincode } = req.body;

    const buyer = await Buyer.findOneAndUpdate(
      { userId: req.user._id },
      { fullName, address, city, state, pincode },
      { new: true, runValidators: true }
    );

    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    res.json({ success: true, message: 'Profile updated successfully.', buyer });
  } catch (error) {
    next(error);
  }
};

// @desc    Get buyer dashboard
// @route   GET /api/buyers/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    const totalOrders = await Order.countDocuments({ buyerId: req.user._id });
    const activeOrders = await Order.countDocuments({
      buyerId: req.user._id,
      orderStatus: { $in: ['CREATED', 'CONFIRMED', 'DISPATCHED'] },
    });
    const completedOrders = await Order.countDocuments({ buyerId: req.user._id, orderStatus: 'DELIVERED' });

    const recentOrders = await Order.find({ buyerId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Recommended products (random active products)
    const recommendedProducts = await Product.find({ status: 'ACTIVE' })
      .sort({ orderCount: -1 })
      .limit(6);

    res.json({
      success: true,
      dashboard: {
        totalOrders,
        activeOrders,
        completedOrders,
        totalSpent: buyer.totalSpent,
        recentOrders,
        recommendedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};
