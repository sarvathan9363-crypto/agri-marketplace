const blockchainConfig = require('../blockchain/blockchain.config');
const blockchainService = require('../blockchain/blockchain.service');

// @desc    Get blockchain audit contract status and counts
// @route   GET /api/blockchain/audit/info
exports.getAuditInfo = async (req, res, next) => {
  try {
    const paymentCount = await blockchainService.getPaymentEventCount().catch(() => 0);
    const settlementCount = await blockchainService.getSettlementEventCount().catch(() => 0);

    res.json({
      success: true,
      enabled: blockchainConfig.enabled,
      network: blockchainConfig.network,
      chainId: blockchainConfig.chainId,
      contractAddress: blockchainConfig.contractAddress,
      explorerBaseUrl: blockchainConfig.explorerBaseUrl,
      auditStats: {
        paymentEventCount: Number(paymentCount),
        settlementEventCount: Number(settlementCount),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blockchain audit provenance status for an event hash
// @route   GET /api/blockchain/audit/:eventIdHash
exports.getAuditStatus = async (req, res, next) => {
  try {
    const { eventIdHash } = req.params;

    const event = await blockchainService.getPaymentEvent(eventIdHash).catch(() => null);

    if (!event || !event.eventIdHash || event.eventIdHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return res.json({
        success: true,
        verified: false,
        status: 'UNRECORDED',
        message: 'No on-chain audit record found for this hash.',
        network: blockchainConfig.network,
        chainId: blockchainConfig.chainId,
        contractAddress: blockchainConfig.contractAddress,
      });
    }

    res.json({
      success: true,
      verified: true,
      status: 'CONFIRMED',
      event: {
        eventIdHash: event.eventIdHash,
        paymentIdHash: event.paymentIdHash,
        orderIdHash: event.orderIdHash,
        buyerIdHash: event.buyerIdHash,
        sellerIdHashes: Array.from(event.sellerSplits || []).map(s => s.sellerIdHash),
        sellerSplits: Array.from(event.sellerSplits || []).map(s => ({
          sellerIdHash: s.sellerIdHash,
          sellerAmountRupees: s.sellerAmountRupees ? Number(s.sellerAmountRupees).toFixed(2) : (Number(s.sellerAmountPaise || 0) / 100).toFixed(2),
          sellerAmountPaise: Number(s.sellerAmountPaise || 0),
          sellerItemsSummary: s.sellerItemsSummary || '',
        })),
        itemsSummary: event.itemsSummary || 'Agricultural Produce',
        amountRupees: event.amountRupees ? Number(event.amountRupees).toFixed(2) : (Number(event.amountPaise) / 100).toFixed(2),
        amountPaise: Number(event.amountPaise),
        status: Number(event.status),
        recordedAt: new Date(Number(event.recordedAt) * 1000).toISOString(),
      },
      network: blockchainConfig.network,
      chainId: blockchainConfig.chainId,
      contractAddress: blockchainConfig.contractAddress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blockchain audit events directly from smart contract
// @route   GET /api/blockchain/events
exports.getAllAuditEvents = async (req, res, next) => {
  try {
    const paymentEvents = await blockchainService.getAllPaymentEvents();
    const settlementEvents = await blockchainService.getAllSettlementEvents();

    res.json({
      success: true,
      network: blockchainConfig.network,
      chainId: blockchainConfig.chainId,
      contractAddress: blockchainConfig.contractAddress,
      explorerBaseUrl: blockchainConfig.explorerBaseUrl,
      paymentEvents,
      settlementEvents,
      totalPaymentEvents: paymentEvents.length,
      totalSettlementEvents: settlementEvents.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lookup buyer or farmer user details by On-Chain Account Hash
// @route   GET /api/blockchain/account-lookup/:accountHash
exports.lookupAccountByHash = async (req, res, next) => {
  try {
    const { accountHash } = req.params;
    const { hashId } = require('../blockchain/blockchain.utils');
    const User = require('../models/User');
    const Farmer = require('../models/Farmer');
    const Buyer = require('../models/Buyer');

    if (!accountHash || accountHash.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid Account Hash parameter.' });
    }

    const cleanHash = accountHash.trim().toLowerCase();

    // Search Farmers
    const farmers = await Farmer.find().populate('userId', 'fullName email mobileNumber role profileImage active');
    for (const f of farmers) {
      const uId = f.userId?._id?.toString() || f.userId?.toString() || f._id.toString();
      const fHash = hashId(`AGR-F-${uId}`).toLowerCase();
      const fAltHash = hashId(`AGR-F-${f._id.toString()}`).toLowerCase();

      if (cleanHash === fHash || cleanHash === fAltHash) {
        return res.json({
          success: true,
          matched: true,
          accountType: 'FARMER',
          accountHash,
          user: f.userId,
          farmer: {
            id: f._id,
            fullName: f.fullName,
            farmName: f.farmName,
            email: f.email,
            mobileNumber: f.mobileNumber,
            farmerType: f.farmerType,
            location: f.location,
            verificationStatus: f.verificationStatus,
            razorpaySellerStatus: f.razorpaySellerStatus || 'NOT_STARTED',
          },
        });
      }
    }

    // Search Buyers
    const buyers = await Buyer.find().populate('userId', 'fullName email mobileNumber role profileImage active');
    for (const b of buyers) {
      const uId = b.userId?._id?.toString() || b.userId?.toString() || b._id.toString();
      const bHash = hashId(`AGR-B-${uId}`).toLowerCase();
      const bAltHash = hashId(`AGR-B-${b._id.toString()}`).toLowerCase();

      if (cleanHash === bHash || cleanHash === bAltHash) {
        return res.json({
          success: true,
          matched: true,
          accountType: 'BUYER',
          accountHash,
          user: b.userId,
          buyer: {
            id: b._id,
            buyerType: b.buyerType,
            businessName: b.businessName,
            address: b.address,
          },
        });
      }
    }

    // Search all Users directly as fallback
    const users = await User.find();
    for (const u of users) {
      const prefix = u.role === 'FARMER' ? 'AGR-F-' : u.role === 'BUYER' ? 'AGR-B-' : 'AGR-A-';
      const uHash = hashId(`${prefix}${u._id.toString()}`).toLowerCase();
      if (cleanHash === uHash) {
        return res.json({
          success: true,
          matched: true,
          accountType: u.role,
          accountHash,
          user: {
            id: u._id,
            fullName: u.fullName,
            email: u.email,
            mobileNumber: u.mobileNumber,
            role: u.role,
            active: u.active,
          },
        });
      }
    }

    res.json({
      success: true,
      matched: false,
      message: 'No registered user or farmer found matching this account hash.',
      accountHash,
    });
  } catch (error) {
    next(error);
  }
};
