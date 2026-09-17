const Dispute = require('../models/Dispute');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// @desc    Create dispute
// @route   POST /api/disputes
exports.createDispute = async (req, res, next) => {
  try {
    const { orderId, reason, description } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Check if user is involved in the order
    if (order.buyerId.toString() !== req.user._id.toString() &&
        order.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to raise dispute for this order.' });
    }

    const existingDispute = await Dispute.findOne({ orderId, raisedBy: req.user._id });
    if (existingDispute) {
      return res.status(400).json({ success: false, message: 'A dispute already exists for this order.' });
    }

    const dispute = await Dispute.create({
      orderId,
      raisedBy: req.user._id,
      raisedByName: req.user.fullName,
      reason,
      description: description || '',
    });

    res.status(201).json({ success: true, message: 'Dispute raised successfully.', dispute });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user disputes
// @route   GET /api/disputes
exports.getUserDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find({ raisedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, disputes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all disputes (admin)
// @route   GET /api/admin/disputes
exports.getAllDisputes = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Dispute.countDocuments(query);
    const disputes = await Dispute.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      disputes,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update dispute (admin)
// @route   PUT /api/admin/disputes/:id
exports.updateDispute = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;

    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminResponse: adminResponse || '',
        ...(status === 'RESOLVED' ? { resolvedAt: new Date() } : {}),
      },
      { new: true }
    );

    if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found.' });

    // Notify the user who raised the dispute
    await Notification.create({
      userId: dispute.raisedBy,
      title: 'Dispute Updated',
      message: `Your dispute has been ${status.toLowerCase().replace('_', ' ')}. ${adminResponse || ''}`,
      type: 'DISPUTE',
    });

    res.json({ success: true, message: 'Dispute updated.', dispute });
  } catch (error) {
    next(error);
  }
};
