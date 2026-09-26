const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Notification = require('../models/Notification');
const paymentService = require('../services/paymentService');

// @desc    Create order (from cart or direct buy)
const mongoose = require('mongoose');

// @desc    Create order (from cart or direct buy)
// @route   POST /api/orders
const TransportQuotation = require('../models/TransportQuotation');
const TransportRequest = require('../models/TransportRequest');

// @desc    Create order (from cart or direct buy)
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, deliveryCity, deliveryState, deliveryPincode, quotationId, transportRequestId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items to order.' });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Delivery address is required.' });
    }

    let transportCharge = 0;
    let selectedQuotation = null;
    let selectedTransportRequest = null;

    if (quotationId) {
      selectedQuotation = await TransportQuotation.findById(quotationId);
      if (!selectedQuotation) {
        return res.status(404).json({ success: false, message: 'Transport quotation not found.' });
      }
      transportCharge = Number(selectedQuotation.totalQuote || 0);
      selectedQuotation.status = 'ACCEPTED';
      await selectedQuotation.save();

      if (selectedQuotation.requestId) {
        selectedTransportRequest = await TransportRequest.findById(selectedQuotation.requestId);
        if (selectedTransportRequest) {
          selectedTransportRequest.status = 'CONFIRMED';
          selectedTransportRequest.selectedQuotationId = selectedQuotation._id;
          selectedTransportRequest.transporterId = selectedQuotation.transporterId;
          await selectedTransportRequest.save();
        }
      }
    } else if (transportRequestId) {
      selectedTransportRequest = await TransportRequest.findById(transportRequestId);
      if (selectedTransportRequest && selectedTransportRequest.selectedQuotationId) {
        selectedQuotation = await TransportQuotation.findById(selectedTransportRequest.selectedQuotationId);
        if (selectedQuotation) {
          transportCharge = Number(selectedQuotation.totalQuote || 0);
        }
      }
    }

    const buyer = await Buyer.findOne({ userId: req.user._id });
    const orderGroupId = 'grp_' + new mongoose.Types.ObjectId().toString();
    const orders = [];
    let totalGroupAmount = 0;

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.productName}. Available: ${product.quantity} ${product.unit}`,
        });
      }

      const itemTotal = item.quantity * product.pricePerUnit;
      totalGroupAmount += itemTotal;

      // Transport charge is assigned to the primary order in the order group
      const itemTransportCharge = index === 0 ? transportCharge : 0;

      const order = await Order.create({
        buyerId: req.user._id,
        buyerName: req.user.fullName,
        farmerId: product.farmerUserId,
        farmerName: product.farmerName,
        productId: product._id,
        productName: product.productName,
        productImage: product.images?.[0] || '',
        quantity: item.quantity,
        unit: product.unit,
        pricePerUnit: product.pricePerUnit,
        totalAmount: itemTotal,
        transportCharge: itemTransportCharge,
        transportRequestId: selectedTransportRequest?._id || null,
        transporterId: selectedQuotation?.transporterId || null,
        deliveryAddress,
        deliveryCity: deliveryCity || '',
        deliveryState: deliveryState || '',
        deliveryPincode: deliveryPincode || '',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING_PAYMENT',
        orderGroupId,
      });

      if (selectedTransportRequest && index === 0) {
        selectedTransportRequest.orderId = order._id;
        await selectedTransportRequest.save();
      }

      // Update product quantity
      product.quantity -= item.quantity;
      product.orderCount += 1;
      if (product.quantity <= 0) product.status = 'OUT_OF_STOCK';
      await product.save();

      orders.push(order);
    }

    // Clear cart
    await Cart.findOneAndUpdate({ buyerId: req.user._id }, { items: [], totalAmount: 0 });

    // Notify buyer
    await Notification.create({
      userId: req.user._id,
      title: 'Payment Pending',
      message: `Your order${orders.length > 1 ? 's are' : ' is'} awaiting payment confirmation.`,
      type: 'ORDER',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      orderGroupId,
      totalAmount: totalGroupAmount + transportCharge,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Check permission
    const isOwner = order.buyerId.toString() === req.user._id.toString() ||
                    order.farmerId.toString() === req.user._id.toString() ||
                    req.user.role === 'ADMIN';

    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order.' });
    }

    const payment = await paymentService.getPaymentByOrder(order._id);

    res.json({ success: true, order, payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, cancellationReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Check permission
    const isFarmer = order.farmerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';
    const isBuyer = order.buyerId.toString() === req.user._id.toString();

    if (!isFarmer && !isAdmin && !isBuyer) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    // Buyers can only cancel
    if (isBuyer && orderStatus !== 'CANCELLED') {
      return res.status(403).json({ success: false, message: 'Buyers can only cancel orders.' });
    }

    if (isFarmer && order.paymentStatus !== 'CAPTURED') {
      return res.status(409).json({ success: false, message: 'An order cannot be processed before payment capture.' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (cancellationReason) order.cancellationReason = cancellationReason;

    await order.save();



    // Status notification messages
    const statusMessages = {
      CONFIRMED: 'Your order has been confirmed.',
      DISPATCHED: 'Your order has been dispatched.',
      DELIVERED: 'Your order has been delivered.',
      CANCELLED: 'Your order has been cancelled.',
    };

    if (orderStatus && statusMessages[orderStatus]) {
      // Notify buyer
      await Notification.create({
        userId: order.buyerId,
        title: `Order ${orderStatus.charAt(0) + orderStatus.slice(1).toLowerCase()}`,
        message: `${statusMessages[orderStatus]} (Order for ${order.productName})`,
        type: 'ORDER',
      });

      // If cancelled, restore product quantity
      if (orderStatus === 'CANCELLED') {
        await Product.findByIdAndUpdate(order.productId, {
          $inc: { quantity: order.quantity, orderCount: -1 },
        });
      }
    }

    res.json({ success: true, message: 'Order status updated.', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get buyer orders
// @route   GET /api/buyers/orders
exports.getBuyerOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { buyerId: req.user._id };
    if (status && status !== 'ALL') query.orderStatus = status;

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

// @desc    Get farmer orders
// @route   GET /api/farmers/orders
exports.getFarmerOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { farmerId: req.user._id };
    if (status && status !== 'ALL') query.orderStatus = status;

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
