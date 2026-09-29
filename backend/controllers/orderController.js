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
        transportRequestId: req.body.transportRequestId || selectedTransportRequest?._id || null,
        transporterId: selectedQuotation?.transporterId || null,
        deliveryAddress,
        deliveryCity: deliveryCity || '',
        deliveryState: deliveryState || '',
        deliveryPincode: deliveryPincode || '',
        paymentStatus: req.body.paymentStatus || 'PENDING',
        orderStatus: req.body.orderStatus || 'PENDING_PAYMENT',
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

    // Supersede any remaining draft transport requests for this buyer so old quotes never leak to future orders
    await TransportRequest.updateMany(
      {
        buyerId: req.user._id,
        _id: { $ne: selectedTransportRequest?._id },
        status: { $in: ['OPEN', 'QUOTES_RECEIVED', 'QUOTATION_SELECTED'] },
        $or: [{ orderId: null }, { orderId: { $exists: false } }]
      },
      { status: 'SUPERSEDED' }
    );

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

// @desc    Get single order or order group
// @route   GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const isObjectId = mongoose.isValidObjectId(id);

    const initialOrders = await Order.find({
      $or: [
        { orderGroupId: id },
        ...(isObjectId ? [{ _id: id }] : [])
      ]
    });

    if (!initialOrders || initialOrders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const groupKey = initialOrders[0].orderGroupId || initialOrders[0]._id.toString();
    const orders = await Order.find({
      $or: [
        { orderGroupId: groupKey },
        ...(isObjectId ? [{ _id: id }] : [])
      ]
    }).populate({
      path: 'transportRequestId',
      populate: { path: 'selectedQuotationId' },
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Check permission
    const firstOrder = orders[0];
    const isOwner = orders.some(o => o.buyerId.toString() === req.user._id.toString()) ||
                    orders.some(o => o.farmerId?.toString() === req.user._id.toString()) ||
                    req.user.role === 'ADMIN';

    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order.' });
    }

    let totalProductAmount = 0;
    let transportCharge = 0;
    let transportRequestId = null;
    let selectedQuote = null;

    const items = orders.map(ord => {
      totalProductAmount += Number(ord.totalAmount || 0);
      if (ord.transportCharge > 0) transportCharge = ord.transportCharge;
      if (!transportRequestId && ord.transportRequestId) {
        transportRequestId = ord.transportRequestId;
      }
      return {
        _id: ord._id,
        productId: ord.productId,
        productName: ord.productName,
        productImage: ord.productImage,
        farmerId: ord.farmerId,
        farmerName: ord.farmerName,
        quantity: ord.quantity,
        unit: ord.unit,
        pricePerUnit: ord.pricePerUnit,
        totalAmount: ord.totalAmount,
        subtotal: ord.totalAmount,
      };
    });

    if (!transportRequestId) {
      transportRequestId = await TransportRequest.findOne({
        $or: [
          { orderGroupId: groupKey },
          { orderId: { $in: orders.map(o => o._id) } },
          { buyerId: firstOrder.buyerId, status: { $in: ['OPEN', 'QUOTES_RECEIVED', 'QUOTATION_SELECTED'] } }
        ],
        status: { $ne: 'SUPERSEDED' }
      }).sort({ createdAt: -1 }).populate('selectedQuotationId');
    }

    if (transportRequestId) {
      if (transportRequestId.selectedQuotationId) {
        selectedQuote = transportRequestId.selectedQuotationId;
        if (selectedQuote.totalQuote > 0) transportCharge = Number(selectedQuote.totalQuote);
      }
    }

    const payment = await paymentService.getPaymentByOrder(firstOrder.orderGroupId || firstOrder._id);

    res.json({
      success: true,
      order: {
        _id: firstOrder._id,
        orderGroupId: firstOrder.orderGroupId || firstOrder._id.toString(),
        orderNumber: `AGR-O-${(firstOrder.orderGroupId || firstOrder._id.toString()).replace('grp_', '').slice(-8).toUpperCase()}`,
        buyerId: firstOrder.buyerId,
        deliveryAddress: firstOrder.deliveryAddress,
        deliveryCity: firstOrder.deliveryCity,
        deliveryState: firstOrder.deliveryState,
        deliveryPincode: firstOrder.deliveryPincode,
        orderStatus: firstOrder.orderStatus,
        paymentStatus: firstOrder.paymentStatus,
        createdAt: firstOrder.createdAt,
        items,
        totalProductAmount,
        transportCharge,
        grandTotal: totalProductAmount + transportCharge,
        transportRequestId,
        selectedQuote,
      },
      orders,
      payment,
    });
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
    if (status && status !== 'ALL') {
      if (status === 'CREATED' || status === 'PENDING_PAYMENT') {
        query.orderStatus = { $in: ['CREATED', 'PENDING_PAYMENT'] };
      } else {
        query.orderStatus = status;
      }
    }

    const rawOrders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'transportRequestId',
        populate: { path: 'selectedQuotationId' },
      });

    // Group raw orders by orderGroupId (or single order _id)
    const groupsMap = {};
    const groupOrderList = [];

    for (const ord of rawOrders) {
      const groupKey = ord.orderGroupId || ord._id.toString();
      if (!groupsMap[groupKey]) {
        groupsMap[groupKey] = {
          _id: ord._id,
          orderGroupId: groupKey,
          orderNumber: `AGR-O-${groupKey.replace('grp_', '').slice(-8).toUpperCase()}`,
          createdAt: ord.createdAt,
          orderStatus: ord.orderStatus,
          paymentStatus: ord.paymentStatus,
          deliveryAddress: ord.deliveryAddress,
          deliveryCity: ord.deliveryCity,
          deliveryState: ord.deliveryState,
          deliveryPincode: ord.deliveryPincode,
          items: [],
          farmerIds: new Set(),
          farmerNames: new Set(),
          totalProductAmount: 0,
          totalWeightKg: 0,
          transportRequestId: ord.transportRequestId || null,
          transportCharge: ord.transportCharge || 0,
          transporterId: ord.transporterId || null,
        };
        groupOrderList.push(groupKey);
      }

      const grp = groupsMap[groupKey];
      grp.items.push({
        _id: ord._id,
        productId: ord.productId,
        productName: ord.productName,
        productImage: ord.productImage,
        farmerId: ord.farmerId,
        farmerName: ord.farmerName,
        quantity: ord.quantity,
        unit: ord.unit,
        pricePerUnit: ord.pricePerUnit,
        totalAmount: ord.totalAmount,
      });

      if (ord.farmerId) grp.farmerIds.add(ord.farmerId.toString());
      if (ord.farmerName) grp.farmerNames.add(ord.farmerName);
      grp.totalProductAmount += Number(ord.totalAmount || 0);
      grp.totalWeightKg += Number(ord.quantity || 1);
      if (!grp.transportRequestId && ord.transportRequestId) {
        grp.transportRequestId = ord.transportRequestId;
      }
      if (ord.transportCharge > 0) grp.transportCharge = ord.transportCharge;
    }

    // Fallback: Link TransportRequest by orderGroupId or orderId if missing from Order schema
    const groupsMissingTr = Object.values(groupsMap).filter(g => !g.transportRequestId);
    if (groupsMissingTr.length > 0) {
      const missingGroupKeys = groupsMissingTr.map(g => g.orderGroupId);
      const missingOrderIds = groupsMissingTr.map(g => g._id);
      const trList = await TransportRequest.find({
        $or: [
          { orderGroupId: { $in: missingGroupKeys } },
          { orderId: { $in: missingOrderIds } }
        ],
        status: { $ne: 'SUPERSEDED' }
      }).populate('selectedQuotationId');

      trList.forEach(tr => {
        const matchingGroup = Object.values(groupsMap).find(g =>
          g.orderGroupId === tr.orderGroupId || String(g._id) === String(tr.orderId)
        );
        if (matchingGroup && !matchingGroup.transportRequestId) {
          matchingGroup.transportRequestId = tr;
        }
      });
    }

    // Collect all transport request IDs to fetch real-time quotes count
    const trIds = Object.values(groupsMap).map(g => g.transportRequestId?._id || g.transportRequestId).filter(Boolean);
    const quoteCountsMap = {};
    if (trIds.length > 0) {
      const qCounts = await TransportQuotation.aggregate([
        { $match: { requestId: { $in: trIds }, status: 'SUBMITTED' } },
        { $group: { _id: '$requestId', count: { $sum: 1 } } }
      ]);
      qCounts.forEach(qc => { quoteCountsMap[qc._id.toString()] = qc.count; });
    }

    // Format final grouped order list
    const groupedOrders = groupOrderList.map(gKey => {
      const grp = groupsMap[gKey];
      const trDoc = grp.transportRequestId;

      let transportCharge = grp.transportCharge;
      let quotesCount = 0;
      let transportStatus = 'TRANSPORT_NOT_REQUESTED';

      if (trDoc) {
        const trIdStr = (trDoc._id || trDoc).toString();
        quotesCount = quoteCountsMap[trIdStr] || 0;
        transportStatus = trDoc.status || 'OPEN';

        if (trDoc.confirmedTransportCharge > 0) {
          transportCharge = trDoc.confirmedTransportCharge;
        } else if (trDoc.selectedQuotationId?.totalQuote > 0) {
          transportCharge = trDoc.selectedQuotationId.totalQuote;
        }
      }

      const finalPayableAmount = grp.totalProductAmount + (transportCharge || 0);

      // Strict payment eligibility evaluation (Requirement #15)
      let paymentAllowed = true;
      let paymentEligibilityReason = 'Ready for Payment';

      if (grp.paymentStatus === 'CAPTURED') {
        paymentAllowed = false;
        paymentEligibilityReason = 'Order Paid';
      } else if (!trDoc) {
        paymentAllowed = false;
        paymentEligibilityReason = 'Transport Not Requested - Continue Checkout';
      } else if (trDoc && !['SUPERSEDED', 'CANCELLED', 'EXPIRED'].includes(trDoc.status)) {
        const validTransportFinalStatuses = ['QUOTATION_SELECTED', 'CONFIRMED', 'ASSIGNED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
        if (!validTransportFinalStatuses.includes(trDoc.status) || !trDoc.selectedQuotationId) {
          paymentAllowed = false;
          paymentEligibilityReason = quotesCount > 0 ? `${quotesCount} Quotations Available - Selection Required` : 'Awaiting Transporter Quotations';
        }
      }

      return {
        _id: grp._id,
        orderGroupId: grp.orderGroupId,
        orderNumber: grp.orderNumber,
        createdAt: grp.createdAt,
        orderStatus: grp.orderStatus,
        paymentStatus: grp.paymentStatus,
        deliveryAddress: grp.deliveryAddress,
        deliveryCity: grp.deliveryCity,
        deliveryState: grp.deliveryState,
        deliveryPincode: grp.deliveryPincode,
        items: grp.items,
        itemCount: grp.items.length,
        farmerCount: grp.farmerNames.size,
        farmers: Array.from(grp.farmerNames),
        totalProductAmount: grp.totalProductAmount,
        totalWeightKg: grp.totalWeightKg,
        transportRequestId: trDoc,
        quotesCount,
        transportStatus,
        transportCharge,
        finalPayableAmount,
        paymentAllowed,
        paymentEligibilityReason,
      };
    });

    const skip = (Number(page) - 1) * Number(limit);
    const paginatedOrders = groupedOrders.slice(skip, skip + Number(limit));

    res.json({
      success: true,
      orders: paginatedOrders,
      pagination: { page: Number(page), limit: Number(limit), total: groupedOrders.length, pages: Math.ceil(groupedOrders.length / Number(limit)) },
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
