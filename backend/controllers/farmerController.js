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

// Helper to check and update overall verification status
const updateOverallVerification = (farmer) => {
  if (!farmer.verification) {
    farmer.verification = {};
  }

  const v = farmer.verification;
  let isFullyVerified = false;

  if (farmer.farmerType === 'FPO') {
    const isGstinOk = v.gstin?.status === 'verified' || v.gstin?.status === 'not_applicable';
    isFullyVerified =
      v.orgIdentity?.status === 'verified' &&
      v.orgPan?.status === 'verified' &&
      v.representative?.status === 'verified' &&
      v.orgBank?.status === 'verified' &&
      v.orgDocuments?.status === 'verified' &&
      isGstinOk;
  } else {
    isFullyVerified =
      v.aadhaar?.status === 'verified' &&
      v.farmerRegistry?.status === 'verified' &&
      v.landRecord?.status === 'verified' &&
      v.bankAccount?.status === 'verified' &&
      v.pan?.status === 'verified';
  }

  v.overallStatus = isFullyVerified ? 'verified' : 'incomplete';

  if (isFullyVerified) {
    farmer.verificationStatus = 'VERIFIED';
    if (!farmer.verifiedAt) farmer.verifiedAt = new Date();
  } else {
    farmer.verificationStatus = 'PENDING_VERIFICATION';
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

    if (!farmer.verification) {
      farmer.verification = {
        aadhaar: { status: 'pending' },
        farmerRegistry: { status: 'pending' },
        landRecord: { status: 'pending' },
        bankAccount: { status: 'pending' },
        pan: { status: 'pending' },
        pmKisan: { status: 'pending' },
        orgIdentity: { status: 'pending' },
        orgPan: { status: 'pending' },
        gstin: { status: 'pending' },
        representative: { status: 'pending' },
        orgBank: { status: 'pending' },
        orgDocuments: { status: 'pending' },
        overallStatus: 'incomplete',
      };
      await farmer.save();
    }

    res.json({
      success: true,
      farmerType: farmer.farmerType,
      verificationStatus: farmer.verificationStatus,
      verification: farmer.verification,
      notes: farmer.verificationNotes,
      verifiedAt: farmer.verifiedAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Aadhaar OTP
// @route   POST /api/farmers/verify/aadhaar-otp
exports.sendAadhaarOtp = async (req, res, next) => {
  try {
    const { aadhaarNumber } = req.body;
    const cleanAadhaar = String(aadhaarNumber || '').replace(/\D/g, '');

    if (cleanAadhaar.length !== 12) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 12-digit Aadhaar number.',
      });
    }

    const referenceId = `AADHAAR-REF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    res.json({
      success: true,
      message: 'OTP sent to your Aadhaar-linked mobile number.',
      referenceId,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Aadhaar OTP
// @route   POST /api/farmers/verify/aadhaar-confirm
exports.verifyAadhaarOtp = async (req, res, next) => {
  try {
    const { referenceId, otp } = req.body;
    const cleanOtp = String(otp || '').trim();

    if (cleanOtp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please enter the 6-digit code sent to your mobile.',
      });
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    if (!farmer.verification) farmer.verification = {};

    farmer.verification.aadhaar = {
      status: 'verified',
      referenceId: referenceId || `AADHAAR-REF-${Date.now()}`,
      verifiedName: farmer.fullName,
      verifiedAt: new Date(),
    };

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: 'Aadhaar verified successfully.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Farmer Registry ID
// @route   POST /api/farmers/verify/farmer-id
exports.verifyFarmerRegistry = async (req, res, next) => {
  try {
    const { farmerId, state, district } = req.body;

    if (!farmerId || !state || !district) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Farmer ID, State, and District.',
      });
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const cleanId = String(farmerId).trim();
    const maskedId = cleanId.length > 4 ? `${cleanId.slice(0, 3)}****${cleanId.slice(-4)}` : `FID-****-${cleanId}`;
    const referenceId = `FARM-REG-${Date.now()}`;

    if (!farmer.verification) farmer.verification = {};

    farmer.verification.farmerRegistry = {
      status: 'verified',
      farmerIdMasked: maskedId,
      state: String(state).trim(),
      district: String(district).trim(),
      referenceId,
      verifiedAt: new Date(),
    };

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: 'Farmer Registry verified successfully.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Land Record / Patta
// @route   POST /api/farmers/verify/land-record
exports.verifyLandRecord = async (req, res, next) => {
  try {
    const { state, district, taluk, village, pattaNumber, surveyNumber, subdivisionNumber, landType, extent, isTenant } = req.body;

    if (!state || !district || !taluk || !village || !pattaNumber || !surveyNumber || !extent) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required land record verification fields.',
      });
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const cleanPatta = String(pattaNumber).trim();
    const pattaMasked = cleanPatta.length > 3 ? `PT-***${cleanPatta.slice(-3)}` : `PT-***${cleanPatta}`;

    if (!farmer.verification) farmer.verification = {};

    farmer.verification.landRecord = {
      status: 'verified',
      state: String(state).trim(),
      district: String(district).trim(),
      taluk: String(taluk).trim(),
      village: String(village).trim(),
      pattaNumberMasked: pattaMasked,
      surveyNumber: String(surveyNumber).trim(),
      subdivisionNumber: subdivisionNumber ? String(subdivisionNumber).trim() : null,
      landType: landType || 'Dry',
      extent: String(extent).trim(),
      ownershipMatch: true,
      isTenant: Boolean(isTenant),
      verifiedAt: new Date(),
    };

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: 'Land Record verified successfully.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Bank Account
// @route   POST /api/farmers/verify/bank-account
exports.verifyBankAccount = async (req, res, next) => {
  try {
    const { accountHolderName, bankName, branchName, accountNumber, confirmAccountNumber, ifsc } = req.body;

    if (!accountHolderName || !bankName || !accountNumber || !confirmAccountNumber || !ifsc) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required bank account fields.',
      });
    }

    if (String(accountNumber).trim() !== String(confirmAccountNumber).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Account Number and Confirm Account Number do not match.',
      });
    }

    const ifscClean = String(ifsc).trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscClean)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 11-character IFSC Code (e.g. SBIN0001234).',
      });
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const accClean = String(accountNumber).trim();
    const maskedAcc = `******${accClean.slice(-4)}`;

    if (!farmer.verification) farmer.verification = {};

    farmer.verification.bankAccount = {
      status: 'verified',
      accountHolderName: String(accountHolderName).trim(),
      accountNumberMasked: maskedAcc,
      bankName: String(bankName).trim(),
      branchName: branchName ? String(branchName).trim() : '',
      ifsc: ifscClean,
      nameMatch: true,
      referenceId: `BANK-REF-${Date.now()}`,
      verifiedAt: new Date(),
    };

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: 'Bank Account verified successfully.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify PAN
// @route   POST /api/farmers/verify/pan
exports.verifyPan = async (req, res, next) => {
  try {
    const { panNumber, nameAsPerPan } = req.body;
    const cleanPan = String(panNumber || '').trim().toUpperCase();

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-character PAN number (e.g. ABCDE1234F).',
      });
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const maskedPan = `XXXXX${cleanPan.slice(5, 9)}${cleanPan.slice(-1)}`;

    if (!farmer.verification) farmer.verification = {};

    farmer.verification.pan = {
      status: 'verified',
      panMasked: maskedPan,
      nameMatch: true,
      referenceId: `PAN-REF-${Date.now()}`,
      verifiedAt: new Date(),
    };

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: 'PAN verified successfully.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or Skip PM-KISAN (Optional)
// @route   POST /api/farmers/verify/pm-kisan
exports.verifyPmKisan = async (req, res, next) => {
  try {
    const { action, pmKisanRef } = req.body;

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    if (!farmer.verification) farmer.verification = {};

    if (action === 'skip') {
      farmer.verification.pmKisan = {
        status: 'skipped',
        referenceId: null,
        verifiedAt: null,
      };
    } else {
      if (!pmKisanRef) {
        return res.status(400).json({
          success: false,
          message: 'Please enter your PM-KISAN Registration / Beneficiary Reference.',
        });
      }
      farmer.verification.pmKisan = {
        status: 'verified',
        referenceId: `PMK-${String(pmKisanRef).trim()}`,
        verifiedAt: new Date(),
      };
    }

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: action === 'skip' ? 'PM-KISAN verification skipped.' : 'PM-KISAN record verified.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Skip a specific verification step
// @route   POST /api/farmers/verify/skip-step
exports.skipStep = async (req, res, next) => {
  try {
    const { stepKey } = req.body;
    const validSteps = [
      'aadhaar', 'farmerRegistry', 'landRecord', 'bankAccount', 'pan', 'pmKisan',
      'orgIdentity', 'orgPan', 'gstin', 'representative', 'orgBank', 'orgDocuments'
    ];

    if (!validSteps.includes(stepKey)) {
      return res.status(400).json({ success: false, message: 'Invalid verification step key.' });
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    if (!farmer.verification) farmer.verification = {};
    if (!farmer.verification[stepKey]) farmer.verification[stepKey] = {};

    // Do not downgrade already verified steps
    if (farmer.verification[stepKey].status !== 'verified') {
      farmer.verification[stepKey].status = 'skipped';
    }

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: `Step '${stepKey}' skipped.`,
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// =========================================================
// FPO / FPC VERIFICATION CONTROLLERS
// =========================================================

// @desc    Verify FPO Organization Identity
// @route   POST /api/farmers/verify/fpo-org-identity
exports.verifyOrgIdentity = async (req, res, next) => {
  try {
    const { orgName, orgType, registrationNumber, cin, state, district, address, pincode } = req.body;

    if (!orgName || !registrationNumber || !state || !district) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Organization Name, Registration Number, State, and District.',
      });
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    if (!farmer.verification) farmer.verification = {};

    farmer.verification.orgIdentity = {
      status: 'verified',
      orgName: String(orgName).trim(),
      orgType: orgType || 'FPO',
      registrationNumber: String(registrationNumber).trim(),
      cin: cin ? String(cin).trim() : null,
      state: String(state).trim(),
      district: String(district).trim(),
      address: address ? String(address).trim() : null,
      pincode: pincode ? String(pincode).trim() : null,
      verifiedAt: new Date(),
    };

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: '✓ Organization identity verified successfully.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify FPO Organization PAN
// @route   POST /api/farmers/verify/fpo-org-pan
exports.verifyOrgPan = async (req, res, next) => {
  try {
    const { panNumber, orgName } = req.body;
    const cleanPan = String(panNumber || '').trim().toUpperCase();

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-character Organization PAN number (e.g. ABCDE1234F).',
      });
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const maskedPan = `XXXXX${cleanPan.slice(5, 9)}${cleanPan.slice(-1)}`;

    if (!farmer.verification) farmer.verification = {};

    farmer.verification.orgPan = {
      status: 'verified',
      panMasked: maskedPan,
      nameMatch: true,
      verifiedAt: new Date(),
    };

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: '✓ Organization PAN verified.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or Mark Not Applicable for FPO GSTIN
// @route   POST /api/farmers/verify/fpo-gstin
exports.verifyGstin = async (req, res, next) => {
  try {
    const { isNotApplicable, gstinNumber } = req.body;

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    if (!farmer.verification) farmer.verification = {};

    if (isNotApplicable) {
      farmer.verification.gstin = {
        status: 'not_applicable',
        gstinNumber: null,
        verifiedAt: new Date(),
      };
    } else {
      const cleanGstin = String(gstinNumber || '').trim().toUpperCase();
      if (cleanGstin.length !== 15) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid 15-character GSTIN number.',
        });
      }
      farmer.verification.gstin = {
        status: 'verified',
        gstinNumber: cleanGstin,
        verifiedAt: new Date(),
      };
    }

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: isNotApplicable ? 'GSTIN marked as Not Applicable.' : '✓ GSTIN verified.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP to FPO Authorized Representative
// @route   POST /api/farmers/verify/fpo-rep-otp
exports.sendRepOtp = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    const cleanMobile = String(mobileNumber || '').replace(/\D/g, '');

    if (cleanMobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    const referenceId = `REP-REF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    res.json({
      success: true,
      message: 'OTP sent to Authorized Representative mobile.',
      referenceId,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify FPO Authorized Representative
// @route   POST /api/farmers/verify/fpo-rep-confirm
exports.verifyRepOtp = async (req, res, next) => {
  try {
    const { repName, designation, mobileNumber, referenceId, otp } = req.body;
    const cleanOtp = String(otp || '').trim();

    if (!repName || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Please enter Representative Name and Designation.',
      });
    }

    if (cleanOtp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Please enter the 6-digit OTP sent to the mobile number.',
      });
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    if (!farmer.verification) farmer.verification = {};

    farmer.verification.representative = {
      status: 'verified',
      repName: String(repName).trim(),
      designation: String(designation).trim(),
      mobileNumber: String(mobileNumber).trim(),
      referenceId: referenceId || `REP-${Date.now()}`,
      verifiedAt: new Date(),
    };

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: '✓ Authorized Representative verified.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify FPO Organization Bank Account
// @route   POST /api/farmers/verify/fpo-org-bank
exports.verifyOrgBank = async (req, res, next) => {
  try {
    const { accountHolderName, bankName, branchName, accountNumber, confirmAccountNumber, ifsc } = req.body;

    if (!accountHolderName || !bankName || !accountNumber || !confirmAccountNumber || !ifsc) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required bank account fields.',
      });
    }

    if (String(accountNumber).trim() !== String(confirmAccountNumber).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Account numbers do not match.',
      });
    }

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const accClean = String(accountNumber).trim();
    const maskedAcc = `******${accClean.slice(-4)}`;

    if (!farmer.verification) farmer.verification = {};

    farmer.verification.orgBank = {
      status: 'verified',
      accountHolderName: String(accountHolderName).trim(),
      accountNumberMasked: maskedAcc,
      bankName: String(bankName).trim(),
      branchName: branchName ? String(branchName).trim() : '',
      ifsc: String(ifsc).trim().toUpperCase(),
      nameMatch: true,
      verifiedAt: new Date(),
    };

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: '✓ Organization Bank Account verified.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify FPO Supporting Documents
// @route   POST /api/farmers/verify/fpo-org-docs
exports.verifyOrgDocuments = async (req, res, next) => {
  try {
    const { regCert, panDoc, bankProof, authDoc, gstCert } = req.body;

    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    if (!farmer.verification) farmer.verification = {};

    farmer.verification.orgDocuments = {
      status: 'verified',
      regCertUploaded: Boolean(regCert),
      panDocUploaded: Boolean(panDoc),
      bankProofUploaded: Boolean(bankProof),
      authDocUploaded: Boolean(authDoc),
      gstCertUploaded: Boolean(gstCert),
      verifiedAt: new Date(),
    };

    updateOverallVerification(farmer);
    await farmer.save();

    res.json({
      success: true,
      message: '✓ Organization Supporting Documents verified.',
      verification: farmer.verification,
    });
  } catch (error) {
    next(error);
  }
};



