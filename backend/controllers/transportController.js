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
      const transporter = await Transporter.findOne({ userId: req.user._id }).select('verificationStatus');
      query.$or = transporter?.verificationStatus === 'VERIFIED'
        ? [{ status: { $in: ['OPEN', 'QUOTES_RECEIVED'] } }, { transporterId: req.user._id }]
        : [{ transporterId: req.user._id }];
    } else if (userRole === 'FARMER') {
      query.farmerId = req.user._id;
    }

    const requests = await TransportRequest.find(query)
      .sort({ createdAt: -1 })
      .populate('selectedQuotationId');

    if (userRole === 'TRANSPORTER') {
      const requestIds = requests.map(r => r._id);
      const myQuotes = await TransportQuotation.find({
        requestId: { $in: requestIds },
        transporterId: req.user._id,
        status: { $in: ['SUBMITTED', 'SELECTED', 'ACCEPTED'] },
      });
      const quoteMap = {};
      myQuotes.forEach(q => { quoteMap[q.requestId.toString()] = q; });

      const requestsWithQuotes = requests.map(r => {
        const doc = r.toObject();
        doc.myQuotation = quoteMap[r._id.toString()] || null;
        return doc;
      });
      return res.json({ success: true, requests: requestsWithQuotes });
    }

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

    const pickupLoc = pickupLocation || req.body.pickupAddress || 'Farm Gate Pickup';
    const deliveryLoc = deliveryLocation || req.body.deliveryAddress || 'Buyer Address';
    const crop = cropName || req.body.itemDescription || 'Agricultural Produce';

    if (!pickupLoc || !deliveryLoc || !crop) {
      throw fail('Pickup location, delivery location, and crop name are required.');
    }

    // Check if an active request already exists for this order/orderGroup or buyer checkout
    let targetOrderId = orderId || null;
    let existingRequest = null;
    if (targetOrderId) {
      existingRequest = await TransportRequest.findOne({ orderId: targetOrderId, status: { $in: ['OPEN', 'QUOTES_RECEIVED', 'QUOTATION_SELECTED'] } });
    } else if (orderGroupId) {
      existingRequest = await TransportRequest.findOne({ orderGroupId, status: { $in: ['OPEN', 'QUOTES_RECEIVED', 'QUOTATION_SELECTED'] } });
    } else {
      existingRequest = await TransportRequest.findOne({ buyerId: req.user._id, orderId: null, status: { $in: ['OPEN', 'QUOTES_RECEIVED', 'QUOTATION_SELECTED'] } });
    }

    // Prepare items snapshot
    let itemsSnapshot = [];
    let totalWeight = Number(estimatedWeightKg) || 0;
    let totalItemCount = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      itemsSnapshot = items.map((i) => ({
        productId: i.productId || null,
        productName: i.productName || crop,
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
        productName: crop,
        quantity: Number(quantity) || 1,
        unit: unit || 'KG',
        weightKg: totalWeight || 100,
      }];
      totalItemCount = 1;
      if (!totalWeight) totalWeight = 100;
    }

    // Helper to check if item snapshots match current request items
    const areItemsMatching = (snap, currentItems) => {
      if (!snap || !currentItems || snap.length !== currentItems.length) return false;
      return snap.every((s, idx) => {
        const c = currentItems[idx];
        return (String(s.productId || s.productName) === String(c.productId || c.productName)) && (Number(s.quantity) === Number(c.quantity));
      });
    };

    if (existingRequest && (req.body.forceNew || !areItemsMatching(existingRequest.itemsSnapshot, itemsSnapshot))) {
      existingRequest.status = 'SUPERSEDED';
      await existingRequest.save();
      existingRequest = null;
    }

    if (existingRequest) {
      const existingQuotes = await TransportQuotation.countDocuments({ requestId: existingRequest._id, status: 'SUBMITTED' });
      if (existingQuotes > 0 || existingRequest.status === 'QUOTATION_SELECTED') {
        return res.json({ success: true, request: existingRequest, message: 'Existing active transport request restored.' });
      } else {
        existingRequest.pickupLocation = pickupLoc;
        existingRequest.deliveryLocation = deliveryLoc;
        existingRequest.deliveryCity = deliveryCity || '';
        existingRequest.deliveryState = deliveryState || '';
        existingRequest.deliveryPincode = deliveryPincode || '';
        existingRequest.cropName = crop;
        existingRequest.quantity = Number(quantity) || 1;
        existingRequest.totalWeightKg = totalWeight;
        existingRequest.itemCount = totalItemCount;
        existingRequest.itemsSnapshot = itemsSnapshot;
        await existingRequest.save();
        return res.json({ success: true, request: existingRequest, message: 'Active transport request updated.' });
      }
    }

    let farmerName = 'Farmer Producer';
    if (farmerId) {
      const farmerUser = await User.findById(farmerId);
      if (farmerUser) farmerName = farmerUser.fullName;
    }

    // Build multi-farmer pickup locations array
    const pickupLocationsList = [];
    if (items && Array.isArray(items) && items.length > 0) {
      const uniqueFarmerIds = [...new Set(items.map(i => i.farmerId).filter(Boolean))];
      for (const fId of uniqueFarmerIds) {
        const fUser = await User.findById(fId);
        const fItems = items.filter(i => String(i.farmerId) === String(fId)).map(i => `${i.productName} (${i.quantity} ${i.unit || 'KG'})`);
        pickupLocationsList.push({
          farmerId: fId,
          farmerName: fUser ? fUser.fullName : 'Farmer Producer',
          address: fUser ? (fUser.address || fUser.city || pickupLoc) : pickupLoc,
          items: fItems,
        });
      }
    }
    if (pickupLocationsList.length === 0) {
      pickupLocationsList.push({
        farmerId: farmerId || req.user._id,
        farmerName,
        address: pickupLoc,
        items: [crop],
      });
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
      pickupLocations: pickupLocationsList,
      pickupLocation: pickupLoc,
      deliveryLocation: deliveryLoc,
      deliveryCity: deliveryCity || '',
      deliveryState: deliveryState || '',
      deliveryPincode: deliveryPincode || '',
      cropName: crop,
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

    // Send Notification to all verified Transporters
    try {
      const Notification = require('../models/Notification');
      const transporters = await Transporter.find({ verificationStatus: 'VERIFIED' });
      for (const tr of transporters) {
        if (tr.userId) {
          await Notification.create({
            userId: tr.userId,
            title: 'New Transport Request Posted',
            message: `New transport request #${request.requestNumber} for ${request.cropName} (${request.quantity} ${request.unit}) has been posted by ${request.buyerName}.`,
            type: 'TRANSPORT',
          });
        }
      }
    } catch (notifErr) {
      console.warn('Failed to send transporter notifications:', notifErr.message);
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

    const isAdmin = req.user.role === 'ADMIN';
    const isBuyerOwner = req.user.role === 'BUYER' && String(request.buyerId) === String(req.user._id);
    const transporter = req.user.role === 'TRANSPORTER'
      ? await Transporter.findOne({ userId: req.user._id }).select('verificationStatus')
      : null;
    const isEligibleTransporter = transporter?.verificationStatus === 'VERIFIED'
      && ['OPEN', 'QUOTES_RECEIVED'].includes(request.status);
    const isAssignedTransporter = req.user.role === 'TRANSPORTER' && String(request.transporterId) === String(req.user._id);
    if (!isAdmin && !isBuyerOwner && !isAssignedTransporter && !isEligibleTransporter) {
      throw fail('You do not have access to this transport request.', 403);
    }

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
        verificationStatus: 'NOT_STARTED',
      });
    }

    if (transporterProfile.verificationStatus !== 'VERIFIED') {
      throw fail('Transporter verification approval is required before submitting quotations.', 403);
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

    // Notify Buyer that a quotation was submitted for their transport request
    try {
      const Notification = require('../models/Notification');
      const totalQuotesCount = await TransportQuotation.countDocuments({ requestId: request._id, status: 'SUBMITTED' });
      await Notification.create({
        userId: request.buyerId,
        title: 'New Transport Quotation Received',
        message: `${transporterProfile.companyName || req.user.fullName} submitted a quotation of ₹${totalQuote} for Transport Request #${request.requestNumber} (${totalQuotesCount} quotes received).`,
        type: 'TRANSPORT',
      });
    } catch (notifErr) {
      console.warn('Failed to send buyer notification for transport quotation:', notifErr.message);
    }

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

    if (String(request.buyerId) !== String(req.user._id) && req.user.role !== 'ADMIN') {
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

    // Link to Order / OrderGroup if orders exist
    const quoteAmount = Number(quotation.totalQuote || 0);
    const targetGroupKey = request.orderGroupId || (request.orderId ? (await Order.findById(request.orderId))?.orderGroupId : null);

    if (targetGroupKey) {
      const groupOrders = await Order.find({ orderGroupId: targetGroupKey }).sort({ createdAt: 1 });
      for (let i = 0; i < groupOrders.length; i++) {
        groupOrders[i].transportCharge = i === 0 ? quoteAmount : 0;
        groupOrders[i].transporterId = quotation.transporterId;
        groupOrders[i].transportRequestId = request._id;
        await groupOrders[i].save();
      }
    } else if (request.orderId) {
      await Order.findByIdAndUpdate(request.orderId, {
        transportCharge: quoteAmount,
        transporterId: quotation.transporterId,
        transportRequestId: request._id,
      });
    }

    // Send Notification to Transporter whose quote was selected
    try {
      const Notification = require('../models/Notification');
      await Notification.create({
        userId: quotation.transporterId,
        title: 'Transport Quotation Accepted',
        message: `Your quotation of ₹${quotation.totalQuote} for Transport Request #${request.requestNumber} was selected by ${request.buyerName}.`,
        type: 'TRANSPORT',
      });
    } catch (notifErr) {
      console.warn('Failed to send transporter notification:', notifErr.message);
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

// ==========================================
// TRANSPORTER VERIFICATION ENGINE ENDPOINTS
// ==========================================

// Helper to ensure verification structure initialized
const ensureVerificationInit = (transporter) => {
  if (!transporter.verification) {
    transporter.verification = {
      basicDetails: { status: 'pending' },
      identity: { status: 'pending' },
      businessRegistration: { status: 'pending' },
      bankAccount: { status: 'pending' },
      vehiclesStep: { status: 'pending' },
      driversStep: { status: 'pending' },
      overallStatus: 'NOT_STARTED',
    };
  }
};

// @desc    Get transporter verification status
// @route   GET /api/transport/verification
exports.getVerificationStatus = async (req, res, next) => {
  try {
    let transporter = await Transporter.findOne({ userId: req.user._id });
    const userName = (req.user.fullName && req.user.fullName !== 'undefined') ? req.user.fullName : 'Transporter';
    const defaultCompanyName = `${userName} Logistics`;

    if (!transporter) {
      transporter = await Transporter.create({
        userId: req.user._id,
        companyName: defaultCompanyName,
        transporterIdCode: `AGR-T-${req.user._id.toString().slice(-5).toUpperCase()}`,
        contactPerson: userName,
        email: req.user.email || '',
        mobileNumber: req.user.mobileNumber || '',
      });
    } else if (!transporter.companyName || transporter.companyName.includes('undefined')) {
      transporter.companyName = defaultCompanyName;
      if (!transporter.contactPerson) transporter.contactPerson = userName;
      if (!transporter.email) transporter.email = req.user.email || '';
      if (!transporter.mobileNumber) transporter.mobileNumber = req.user.mobileNumber || '';
      await transporter.save();
    }

    ensureVerificationInit(transporter);

    res.json({
      success: true,
      verificationStatus: transporter.verificationStatus,
      verification: transporter.verification,
      vehicles: transporter.vehicles || [],
      drivers: transporter.drivers || [],
      verificationNotes: transporter.verificationNotes || '',
      verifiedAt: transporter.verifiedAt,
      profileInfo: {
        companyName: transporter.companyName || defaultCompanyName,
        contactPerson: transporter.contactPerson || userName,
        mobileNumber: transporter.mobileNumber || req.user.mobileNumber || '',
        email: transporter.email || req.user.email || '',
        address: transporter.address || '',
        state: transporter.state || 'Maharashtra',
        district: transporter.district || '',
        pincode: transporter.pincode || '',
        serviceAreas: transporter.serviceAreas || [],
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save Step 1: Basic Transporter Details
// @route   POST /api/transport/verification/basic-details
exports.saveBasicDetails = async (req, res, next) => {
  try {
    const {
      transporterType = 'INDIVIDUAL',
      companyName,
      contactPerson,
      mobileNumber,
      email,
      address,
      state,
      district,
      pincode,
      serviceAreas,
    } = req.body;

    let transporter = await Transporter.findOne({ userId: req.user._id });
    if (!transporter) {
      transporter = new Transporter({ userId: req.user._id });
    }

    ensureVerificationInit(transporter);

    const userName = (req.user.fullName && req.user.fullName !== 'undefined') ? req.user.fullName : 'Transporter';
    const fallbackCompany = companyName && !companyName.includes('undefined') ? companyName : `${userName} Logistics`;

    transporter.companyName = fallbackCompany;
    transporter.contactPerson = contactPerson || userName;
    transporter.mobileNumber = mobileNumber || req.user.mobileNumber || '';
    transporter.email = email || req.user.email || '';
    transporter.address = address || transporter.address || '';
    transporter.state = state || transporter.state || 'Maharashtra';
    transporter.district = district || transporter.district || '';
    transporter.pincode = pincode || transporter.pincode || '';
    if (serviceAreas && Array.isArray(serviceAreas)) {
      transporter.serviceAreas = serviceAreas;
    }

    transporter.verification.basicDetails = {
      transporterType,
      companyName: transporter.companyName,
      contactPerson: transporter.contactPerson,
      mobileNumber: transporter.mobileNumber,
      email: transporter.email,
      address: transporter.address,
      state: transporter.state,
      district: transporter.district,
      pincode: transporter.pincode,
      serviceAreas: transporter.serviceAreas,
      status: 'submitted',
    };

    // Saving a draft is not a submission.  Keep the account-level status
    // separate from progress so a partially completed profile can never look
    // approved (or be treated as reviewable) after the next login.
    if (['NOT_STARTED', 'incomplete'].includes(transporter.verification.overallStatus)) {
      transporter.verification.overallStatus = 'PENDING_VERIFICATION';
    }

    await transporter.save();

    res.json({
      success: true,
      message: 'Basic transporter details saved.',
      verification: transporter.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save Step 2: Identity Verification
// @route   POST /api/transport/verification/identity
exports.saveIdentity = async (req, res, next) => {
  try {
    const { aadhaarNumber, panNumber, panDocUrl } = req.body;

    let transporter = await Transporter.findOne({ userId: req.user._id });
    if (!transporter) throw fail('Transporter record not found.', 404);

    ensureVerificationInit(transporter);

    let maskedAadhaar = transporter.verification?.identity?.aadhaarNumberMasked || '';
    if (aadhaarNumber) {
      const clean = String(aadhaarNumber).trim().replace(/\s/g, '');
      if (clean.length >= 4) {
        maskedAadhaar = `•••• •••• ${clean.slice(-4)}`;
      } else if (clean.length > 0) {
        maskedAadhaar = `•••• ${clean}`;
      }
    }

    const cleanPan = panNumber ? String(panNumber).toUpperCase().trim() : (transporter.verification?.identity?.panNumber || '');

    transporter.verification.identity = {
      ...transporter.verification.identity?.toObject?.(),
      aadhaarNumberMasked: maskedAadhaar,
      aadhaarVerified: Boolean(maskedAadhaar),
      panNumber: cleanPan,
      panVerified: Boolean(cleanPan),
      panDocUrl: panDocUrl || transporter.verification?.identity?.panDocUrl || '',
      status: 'submitted',
    };

    await transporter.save();

    res.json({
      success: true,
      message: 'Identity verification info saved.',
      verification: transporter.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save Step 3: Business Registration
// @route   POST /api/transport/verification/business-registration
exports.saveBusinessRegistration = async (req, res, next) => {
  try {
    const { gstin, gstDocUrl, udyamNumber, udyamDocUrl, regCertDocUrl, businessType } = req.body;

    let transporter = await Transporter.findOne({ userId: req.user._id });
    if (!transporter) throw fail('Transporter record not found.', 404);

    ensureVerificationInit(transporter);

    transporter.verification.businessRegistration = {
      ...transporter.verification.businessRegistration?.toObject?.(),
      gstin: gstin ? gstin.toUpperCase() : '',
      gstDocUrl: gstDocUrl || '',
      udyamNumber: udyamNumber || '',
      udyamDocUrl: udyamDocUrl || '',
      regCertDocUrl: regCertDocUrl || '',
      businessType: businessType || 'Proprietorship',
      status: 'submitted',
    };

    await transporter.save();

    res.json({
      success: true,
      message: 'Business registration details saved.',
      verification: transporter.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save Step 4: Bank Account Verification
// @route   POST /api/transport/verification/bank-account
exports.saveBankAccount = async (req, res, next) => {
  try {
    const { accountHolderName, accountNumber, ifsc, bankName, cancelledChequeDocUrl } = req.body;

    let transporter = await Transporter.findOne({ userId: req.user._id });
    if (!transporter) throw fail('Transporter record not found.', 404);

    ensureVerificationInit(transporter);

    let maskedAccount = transporter.verification?.bankAccount?.accountNumberMasked || '';
    if (accountNumber) {
      const clean = String(accountNumber).trim();
      if (clean.length >= 4) {
        maskedAccount = '•'.repeat(Math.max(0, clean.length - 4)) + clean.slice(-4);
      }
    }

    transporter.verification.bankAccount = {
      ...transporter.verification.bankAccount?.toObject?.(),
      accountHolderName: accountHolderName || req.user.fullName,
      accountNumberMasked: maskedAccount,
      ifsc: ifsc ? ifsc.toUpperCase() : '',
      bankName: bankName || 'Verified Bank',
      cancelledChequeDocUrl: cancelledChequeDocUrl || '',
      status: 'submitted',
    };

    await transporter.save();

    res.json({
      success: true,
      message: 'Bank account verification details saved.',
      verification: transporter.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save Step 5: Vehicle Verification (Add / Update Vehicle)
// @route   POST /api/transport/verification/vehicles
exports.saveVehicle = async (req, res, next) => {
  try {
    const {
      _id,
      registrationNumber,
      vehicleType,
      makeModel,
      capacityKg,
      rcDocUrl,
      insuranceDocUrl,
      fitnessDocUrl,
      pucDocUrl,
      permitDocUrl,
    } = req.body;

    if (!registrationNumber || !vehicleType) {
      throw fail('Registration number and vehicle type are required.');
    }

    let transporter = await Transporter.findOne({ userId: req.user._id });
    if (!transporter) throw fail('Transporter record not found.', 404);

    ensureVerificationInit(transporter);

    if (_id) {
      // Update existing vehicle
      const vehicle = transporter.vehicles.id(_id);
      if (vehicle) {
        vehicle.registrationNumber = registrationNumber.toUpperCase();
        vehicle.vehicleType = vehicleType;
        vehicle.makeModel = makeModel || vehicle.makeModel;
        vehicle.capacityKg = Number(capacityKg) || vehicle.capacityKg;
        if (rcDocUrl) vehicle.rcDocUrl = rcDocUrl;
        if (insuranceDocUrl) vehicle.insuranceDocUrl = insuranceDocUrl;
        if (fitnessDocUrl) vehicle.fitnessDocUrl = fitnessDocUrl;
        if (pucDocUrl) vehicle.pucDocUrl = pucDocUrl;
        if (permitDocUrl) vehicle.permitDocUrl = permitDocUrl;
        vehicle.status = 'pending';
      }
    } else {
      // Add new vehicle
      transporter.vehicles.push({
        registrationNumber: registrationNumber.toUpperCase(),
        vehicleType,
        makeModel: makeModel || '',
        capacityKg: Number(capacityKg) || 1000,
        rcDocUrl: rcDocUrl || '',
        insuranceDocUrl: insuranceDocUrl || '',
        fitnessDocUrl: fitnessDocUrl || '',
        pucDocUrl: pucDocUrl || '',
        permitDocUrl: permitDocUrl || '',
        status: 'pending',
      });
    }

    transporter.verification.vehiclesStep = { status: 'submitted', count: transporter.vehicles.length };
    await transporter.save();

    res.json({
      success: true,
      message: 'Vehicle information saved.',
      vehicles: transporter.vehicles,
      verification: transporter.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Vehicle
// @route   DELETE /api/transport/verification/vehicles/:vehicleId
exports.deleteVehicle = async (req, res, next) => {
  try {
    let transporter = await Transporter.findOne({ userId: req.user._id });
    if (!transporter) throw fail('Transporter record not found.', 404);

    transporter.vehicles = transporter.vehicles.filter(v => v._id.toString() !== req.params.vehicleId);
    await transporter.save();

    res.json({
      success: true,
      message: 'Vehicle removed successfully.',
      vehicles: transporter.vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save Step 6: Driver Verification (Add / Update Driver)
// @route   POST /api/transport/verification/drivers
exports.saveDriver = async (req, res, next) => {
  try {
    const {
      _id,
      driverName,
      mobileNumber,
      licenseNumber,
      licenseExpiry,
      licenseDocUrl,
      assignedVehicleNumber,
    } = req.body;

    if (!driverName || !licenseNumber) {
      throw fail('Driver name and license number are required.');
    }

    let transporter = await Transporter.findOne({ userId: req.user._id });
    if (!transporter) throw fail('Transporter record not found.', 404);

    ensureVerificationInit(transporter);

    if (_id) {
      const driver = transporter.drivers.id(_id);
      if (driver) {
        driver.driverName = driverName;
        driver.mobileNumber = mobileNumber || driver.mobileNumber;
        driver.licenseNumber = licenseNumber.toUpperCase();
        driver.licenseExpiry = licenseExpiry || driver.licenseExpiry;
        if (licenseDocUrl) driver.licenseDocUrl = licenseDocUrl;
        if (assignedVehicleNumber) driver.assignedVehicleReg = assignedVehicleNumber;
        driver.status = 'pending';
      }
    } else {
      transporter.drivers.push({
        driverName,
        mobileNumber: mobileNumber || '',
        licenseNumber: licenseNumber.toUpperCase(),
        licenseExpiry: licenseExpiry || '',
        licenseDocUrl: licenseDocUrl || '',
        assignedVehicleReg: assignedVehicleNumber || '',
        status: 'pending',
      });
    }

    transporter.verification.driversStep = { status: 'submitted', count: transporter.drivers.length };
    await transporter.save();

    res.json({
      success: true,
      message: 'Driver information saved.',
      drivers: transporter.drivers,
      verification: transporter.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Driver
// @route   DELETE /api/transport/verification/drivers/:driverId
exports.deleteDriver = async (req, res, next) => {
  try {
    let transporter = await Transporter.findOne({ userId: req.user._id });
    if (!transporter) throw fail('Transporter record not found.', 404);

    transporter.drivers = transporter.drivers.filter(d => d._id.toString() !== req.params.driverId);
    await transporter.save();

    res.json({
      success: true,
      message: 'Driver removed successfully.',
      drivers: transporter.drivers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Complete Verification Wizard for Admin Review
// @route   POST /api/transport/verification/submit
exports.submitVerification = async (req, res, next) => {
  try {
    let transporter = await Transporter.findOne({ userId: req.user._id });
    if (!transporter) throw fail('Transporter record not found.', 404);

    ensureVerificationInit(transporter);

    const v = transporter.verification || {};
    const isBasicOk = ['submitted', 'verified'].includes(v.basicDetails?.status);
    const isIdentityOk = ['submitted', 'verified'].includes(v.identity?.status) && Boolean(v.identity?.panNumber);
    const isBankOk = ['submitted', 'verified'].includes(v.bankAccount?.status) && Boolean(v.bankAccount?.accountNumberMasked);
    const isVehicleOk = transporter.vehicles?.length > 0;

    const missingRequirements = [];
    if (!isBasicOk) missingRequirements.push('basic transporter details');
    if (!isIdentityOk) missingRequirements.push('PAN identity details');
    if (!isBankOk) missingRequirements.push('bank account details');
    if (!isVehicleOk) missingRequirements.push('at least one vehicle');

    // This is the authoritative completeness gate.  The wizard may show
    // progress, but it must not be able to advance an incomplete application
    // to admin review by calling this endpoint directly.
    if (missingRequirements.length) {
      throw fail(`Complete ${missingRequirements.join(', ')} before submitting verification.`, 400);
    }

    transporter.verificationStatus = 'UNDER_REVIEW';
    transporter.verification.overallStatus = 'UNDER_REVIEW';

    transporter.verification.submittedAt = new Date();
    await transporter.save();

    res.json({
      success: true,
      message: transporter.verificationStatus === 'VERIFIED'
        ? 'Your transporter verification application has been submitted and verified successfully!'
        : 'Your transporter verification application has been submitted for review.',
      verificationStatus: transporter.verificationStatus,
      verification: transporter.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Skip a specific verification step
// @route   POST /api/transport/verification/skip-step
exports.skipStep = async (req, res, next) => {
  try {
    const { stepKey } = req.body;
    let transporter = await Transporter.findOne({ userId: req.user._id });
    if (!transporter) throw fail('Transporter record not found.', 404);

    ensureVerificationInit(transporter);

    if (stepKey !== 'businessRegistration' || !transporter.verification[stepKey]) {
      throw fail('Only optional business registration can be skipped.');
    }

    if (transporter.verification[stepKey]) {
      transporter.verification[stepKey].status = 'skipped';
      await transporter.save();
    }

    res.json({
      success: true,
      message: `Step ${stepKey} skipped.`,
      verification: transporter.verification,
    });
  } catch (error) {
    next(error);
  }
};
