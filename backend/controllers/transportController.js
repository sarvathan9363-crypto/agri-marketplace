const TransportRequest = require('../models/TransportRequest');
const TransportQuotation = require('../models/TransportQuotation');
const Transporter = require('../models/Transporter');
const Order = require('../models/Order');
const User = require('../models/User');

const fail = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });

// Helper to generate unique request number e.g. TR-100023
const generateRequestNumber = async () => {
  const count = await TransportRequest.countDocuments();
  const num = String(count + 1).padStart(6, '0');
  return `TR-${num}`;
};

// @desc    Get transport requests based on role
// @route   GET /api/transport/requests
exports.getRequests = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    let query = {};

    if (userRole === 'BUYER') {
      query.buyerId = req.user._id;
    } else if (userRole === 'TRANSPORTER') {
      query.$or = [
        { status: { $in: ['OPEN', 'QUOTES_RECEIVED'] } },
        { transporterId: req.user._id },
      ];
    } else if (userRole === 'FARMER') {
      query.farmerId = req.user._id;
    }

    const requests = await TransportRequest.find(query)
      .sort({ createdAt: -1 })
      .populate('selectedQuotationId');

    res.json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a Transport Request with SNAPSHOT of order items & weight
// @route   POST /api/transport/requests
exports.createRequest = async (req, res, next) => {
  try {
    const {
      orderId,
      orderGroupId,
      farmerId,
      items,
      pickupLocation,
      deliveryLocation,
      deliveryCity,
      deliveryState,
      deliveryPincode,
      cropName,
      quantity,
      unit,
      estimatedWeightKg,
      requiredVehicleType,
      specialRequirements,
    } = req.body;

    if (!pickupLocation || !deliveryLocation || !cropName) {
      throw fail('Pickup location, delivery location, and crop name are required.');
    }

    // Check if an active request already exists for this order/orderGroup
    let targetOrderId = orderId || null;
    let existingRequest = null;
    if (targetOrderId) {
      existingRequest = await TransportRequest.findOne({ orderId: targetOrderId, status: { $in: ['OPEN', 'QUOTES_RECEIVED', 'QUOTATION_SELECTED'] } });
    } else if (orderGroupId) {
      existingRequest = await TransportRequest.findOne({ orderGroupId, status: { $in: ['OPEN', 'QUOTES_RECEIVED', 'QUOTATION_SELECTED'] } });
    }

    // RULE: If buyer changes order/request after quotations exist, supersede old request & invalidate old quotes
    if (existingRequest) {
      const existingQuotes = await TransportQuotation.countDocuments({ requestId: existingRequest._id, status: 'SUBMITTED' });
      if (existingQuotes > 0) {
        existingRequest.status = 'SUPERSEDED';
        existingRequest.cancellationReason = 'Superseded by new request due to order modification.';
        await existingRequest.save();

        // Invalidate all existing quotations for the old request
        await TransportQuotation.updateMany(
          { requestId: existingRequest._id },
          { status: 'SUPERSEDED', isLocked: true }
        );
      }
    }

    let farmerName = 'Farmer Producer';
    if (farmerId) {
      const farmerUser = await User.findById(farmerId);
      if (farmerUser) farmerName = farmerUser.fullName;
    }

    // Prepare items snapshot
    let itemsSnapshot = [];
    let totalWeight = Number(estimatedWeightKg) || 0;
    let totalItemCount = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      itemsSnapshot = items.map((i) => ({
        productId: i.productId || null,
        productName: i.productName || cropName,
        quantity: Number(i.quantity) || 1,
        unit: i.unit || unit || 'KG',
        weightKg: Number(i.weightKg) || Number(i.quantity) || 10,
      }));
      totalItemCount = itemsSnapshot.length;
      if (!totalWeight) {
        totalWeight = itemsSnapshot.reduce((acc, curr) => acc + (curr.weightKg * curr.quantity), 0);
      }
    } else {
      itemsSnapshot = [{
        productName: cropName,
        quantity: Number(quantity) || 1,
        unit: unit || 'KG',
        weightKg: totalWeight || 100,
      }];
      totalItemCount = 1;
      if (!totalWeight) totalWeight = 100;
    }

    const requestNumber = await generateRequestNumber();

    const request = await TransportRequest.create({
      requestNumber,
      orderId: targetOrderId,
      orderGroupId: orderGroupId || '',
      buyerId: req.user._id,
      buyerName: req.user.fullName,
      farmerId: farmerId || req.user._id,
      farmerName,
      itemsSnapshot,
      pickupLocation,
      deliveryLocation,
      deliveryCity: deliveryCity || '',
      deliveryState: deliveryState || '',
      deliveryPincode: deliveryPincode || '',
      cropName,
      quantity: Number(quantity) || 1,
      unit: unit || 'KG',
      totalWeightKg: totalWeight,
      itemCount: totalItemCount,
      requiredVehicleType: requiredVehicleType || 'Any / Light Commercial Vehicle',
      specialRequirements: specialRequirements || 'Standard Produce Handling',
      status: 'OPEN',
      version: existingRequest ? (existingRequest.version + 1) : 1,
    });

    if (targetOrderId) {
      await Order.findByIdAndUpdate(targetOrderId, { transportRequestId: request._id });
    } else if (orderGroupId) {
      await Order.updateMany({ orderGroupId }, { transportRequestId: request._id });
    }

    res.status(201).json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request details with quotations
// @route   GET /api/transport/requests/:id
exports.getRequestById = async (req, res, next) => {
  try {
    const request = await TransportRequest.findById(req.params.id)
      .populate('selectedQuotationId');

    if (!request) throw fail('Transport request not found.', 404);

    const quotations = await TransportQuotation.find({
      requestId: request._id,
      status: { $ne: 'SUPERSEDED' },
    }).sort({ totalQuote: 1 });

    res.json({ success: true, request, quotations });
  } catch (error) {
    next(error);
  }
};

// @desc    Transporter submits a quotation (IMMUTABLE - CANNOT EDIT EXISTING SUBMITTED QUOTE)
// @route   POST /api/transport/requests/:id/quotes
exports.submitQuotation = async (req, res, next) => {
  try {
    const {
      transportCharge,
      loadingCharge,
      unloadingCharge,
      tollCharge,
      handlingCharge,
      otherCharges,
      vehicleType,
      vehicleNumber,
      estimatedPickup,
      estimatedDelivery,
      notes,
    } = req.body;

    const request = await TransportRequest.findById(req.params.id);
    if (!request) throw fail('Transport request not found.', 404);

    if (['SUPERSEDED', 'CANCELLED', 'EXPIRED', 'DELIVERED'].includes(request.status)) {
      throw fail(`This transport request is ${request.status.toLowerCase()} and no longer accepts quotations.`);
    }

    if (request.status === 'QUOTATION_SELECTED' || request.status === 'ASSIGNED') {
      throw fail('A transporter quotation has already been selected for this request.');
    }

    // IMMUTABILITY CHECK (RULE #8): Transporter CANNOT edit a submitted quote
    const existingQuote = await TransportQuotation.findOne({
      requestId: request._id,
      transporterId: req.user._id,
      status: { $in: ['SUBMITTED', 'SELECTED', 'ACCEPTED'] },
    });

    if (existingQuote) {
      throw fail('You have already submitted a quotation for this request. Submitted quotations are locked and cannot be edited directly.');
    }

    const baseCharge = Number(transportCharge);
    if (isNaN(baseCharge) || baseCharge <= 0) throw fail('Valid transport charge is required.');

    const load = Number(loadingCharge || 0);
    const unload = Number(unloadingCharge || 0);
    const toll = Number(tollCharge || 0);
    const handle = Number(handlingCharge || 0);
    const other = Number(otherCharges || 0);

    // Authoritative backend total calculation
    const totalQuote = baseCharge + load + unload + toll + handle + other;

    let transporterProfile = await Transporter.findOne({ userId: req.user._id });
    if (!transporterProfile) {
      transporterProfile = await Transporter.create({
        userId: req.user._id,
        companyName: req.user.fullName + ' Logistics',
        transporterIdCode: `AGR-T-${req.user._id.toString().slice(-5).toUpperCase()}`,
        vehicleType: vehicleType || 'Mini Truck / LCV',
        vehicleNumber: vehicleNumber || 'MH-12-AG-4589',
      });
    }

    const quotation = await TransportQuotation.create({
      requestId: request._id,
      requestNumber: request.requestNumber,
      transporterId: req.user._id,
      transporterName: req.user.fullName,
      transporterCompany: transporterProfile.companyName || req.user.fullName + ' Logistics',
      vehicleType: vehicleType || transporterProfile.vehicleType,
      vehicleNumber: vehicleNumber || transporterProfile.vehicleNumber,
      rating: transporterProfile.rating || 4.8,
      totalDeliveries: transporterProfile.totalDeliveries || 12,
      quotedWeightKg: request.totalWeightKg,
      quotedItemCount: request.itemCount,
      transportCharge: baseCharge,
      loadingCharge: load,
      unloadingCharge: unload,
      tollCharge: toll,
      handlingCharge: handle,
      otherCharges: other,
      totalQuote,
      estimatedPickup: estimatedPickup || 'Tomorrow Morning',
      estimatedDelivery: estimatedDelivery || 'Within 2 Days',
      notes: notes || '',
      status: 'SUBMITTED',
      isLocked: false,
    });

    // Update request status to QUOTES_RECEIVED
    request.status = 'QUOTES_RECEIVED';
    await request.save();

    res.status(201).json({ success: true, quotation });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw quotation (RULE #9 - Original quotation remains in history as WITHDRAWN)
// @route   POST /api/transport/quotes/:quoteId/withdraw
exports.withdrawQuotation = async (req, res, next) => {
  try {
    const quotation = await TransportQuotation.findById(req.params.quoteId);
    if (!quotation) throw fail('Quotation not found.', 404);

    if (quotation.transporterId.toString() !== req.user._id.toString()) {
      throw fail('Unauthorized to withdraw this quotation.', 433);
    }

    if (quotation.status !== 'SUBMITTED') {
      throw fail(`Quotation cannot be withdrawn because it is already ${quotation.status.toLowerCase()}.`);
    }

    quotation.status = 'WITHDRAWN';
    quotation.isLocked = true;
    await quotation.save();

    res.json({ success: true, message: 'Quotation withdrawn successfully. Historical record preserved.', quotation });
  } catch (error) {
    next(error);
  }
};

// @desc    Buyer selects a quotation (LOCKED - RULE #10 & #11)
// @route   POST /api/transport/requests/:id/select-quote
exports.selectQuotation = async (req, res, next) => {
  try {
    const { quotationId } = req.body;
    const request = await TransportRequest.findById(req.params.id);

    if (!request) throw fail('Transport request not found.', 404);

    if (request.buyerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      throw fail('Only the order buyer can select a transport quotation.', 403);
    }

    if (request.status === 'SUPERSEDED' || request.status === 'CANCELLED') {
      throw fail('Cannot select quotation for a superseded or cancelled request.');
    }

    const quotation = await TransportQuotation.findById(quotationId);
    if (!quotation) throw fail('Selected quotation not found.', 404);

    // Snapshot verification (RULE #7)
    if (quotation.requestId.toString() !== request._id.toString()) {
      throw fail('This quotation does not belong to the active transport request snapshot.');
    }

    if (quotation.status !== 'SUBMITTED') {
      throw fail('This quotation is no longer valid or submitted.');
    }

    // Lock chosen quotation
    quotation.status = 'SELECTED';
    quotation.isLocked = true;
    await quotation.save();

    // Reject other submitted quotes for this request
    await TransportQuotation.updateMany(
      { requestId: request._id, _id: { $ne: quotation._id }, status: 'SUBMITTED' },
      { status: 'REJECTED', isLocked: true }
    );

    // Update transport request
    request.status = 'QUOTATION_SELECTED';
    request.selectedQuotationId = quotation._id;
    request.transporterId = quotation.transporterId;
    request.confirmedTransportCharge = quotation.totalQuote;
    await request.save();

    // Link to Order if order exists
    if (request.orderId) {
      await Order.findByIdAndUpdate(request.orderId, {
        transportCharge: quotation.totalQuote,
        transporterId: quotation.transporterId,
        transportRequestId: request._id,
      });
    }

    res.json({
      success: true,
      message: 'Transporter quotation selected and locked.',
      selectedQuotation: quotation,
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Transporter accepts assigned job (RULE #12)
// @route   POST /api/transport/quotes/:quoteId/accept
exports.acceptJob = async (req, res, next) => {
  try {
    const quotation = await TransportQuotation.findById(req.params.quoteId);
    if (!quotation) throw fail('Quotation not found.', 404);

    if (quotation.transporterId.toString() !== req.user._id.toString()) {
      throw fail('Unauthorized. You are not the transporter assigned to this quote.', 403);
    }

    if (quotation.status !== 'SELECTED') {
      throw fail('Quotation must be selected by buyer before accepting job.');
    }

    quotation.status = 'ACCEPTED';
    await quotation.save();

    const request = await TransportRequest.findById(quotation.requestId);
    if (request) {
      request.status = 'ASSIGNED';
      await request.save();

      if (request.orderId) {
        await Order.findByIdAndUpdate(request.orderId, { orderStatus: 'CONFIRMED' });
      }
    }

    res.json({ success: true, message: 'Transport job accepted.', quotation, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Transporter updates shipment status
// @route   PUT /api/transport/requests/:id/shipment-status
exports.updateShipmentStatus = async (req, res, next) => {
  try {
    const { shipmentStatus } = req.body;
    const validStatuses = ['PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

    if (!validStatuses.includes(shipmentStatus)) {
      throw fail('Invalid shipment status.');
    }

    const request = await TransportRequest.findById(req.params.id);
    if (!request) throw fail('Transport request not found.', 404);

    if (request.transporterId?.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      throw fail('Unauthorized to update shipment status.', 403);
    }

    request.status = shipmentStatus;
    await request.save();

    if (request.orderId) {
      let mappedOrderStatus = 'CONFIRMED';
      if (shipmentStatus === 'PICKED_UP' || shipmentStatus === 'IN_TRANSIT') mappedOrderStatus = 'DISPATCHED';
      if (shipmentStatus === 'DELIVERED') mappedOrderStatus = 'DELIVERED';

      await Order.findByIdAndUpdate(request.orderId, { orderStatus: mappedOrderStatus });
    }

    res.json({ success: true, message: `Shipment status updated to ${shipmentStatus}.`, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transporter profile
// @route   GET /api/transport/profile
exports.getTransporterProfile = async (req, res, next) => {
  try {
    let profile = await Transporter.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await Transporter.create({
        userId: req.user._id,
        companyName: req.user.fullName + ' Logistics',
        transporterIdCode: `AGR-T-${req.user._id.toString().slice(-5).toUpperCase()}`,
      });
    }
    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transporter profile
// @route   PUT /api/transport/profile
exports.updateTransporterProfile = async (req, res, next) => {
  try {
    const { companyName, vehicleType, vehicleNumber, operatingStates } = req.body;

    let profile = await Transporter.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new Transporter({ userId: req.user._id });
    }

    if (companyName) profile.companyName = companyName;
    if (vehicleType) profile.vehicleType = vehicleType;
    if (vehicleNumber) profile.vehicleNumber = vehicleNumber;
    if (operatingStates && Array.isArray(operatingStates)) profile.operatingStates = operatingStates;

    await profile.save();
    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transporter shipments & earnings
// @route   GET /api/transport/my-shipments
exports.getTransporterShipments = async (req, res, next) => {
  try {
    const requests = await TransportRequest.find({ transporterId: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('selectedQuotationId');

    const totalEarnings = requests.reduce((acc, curr) => {
      if (curr.status === 'DELIVERED' || curr.status === 'ASSIGNED') {
        return acc + (curr.confirmedTransportCharge || 0);
      }
      return acc;
    }, 0);

    const activeShipments = requests.filter(r => ['ASSIGNED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT'].includes(r.status));
    const completedShipments = requests.filter(r => r.status === 'DELIVERED');

    res.json({
      success: true,
      totalEarnings,
      activeCount: activeShipments.length,
      completedCount: completedShipments.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};
