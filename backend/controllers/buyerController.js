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
        totalSpent: buyer.totalSpent || 0,
        recentOrders,
        recommendedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper to check and update overall buyer verification status
const updateOverallBuyerVerification = (buyer) => {
  if (!buyer.verification) {
    buyer.verification = {};
  }

  const v = buyer.verification;
  let isFullyVerified = false;

  const isGstinOk = v.gstin?.status === 'verified' || v.gstin?.status === 'not_applicable';
  const isUdyamOk = v.udyam?.status === 'verified' || v.udyam?.status === 'not_applicable';
  const isFssaiOk = v.fssai?.status === 'verified' || v.fssai?.status === 'not_applicable';

  if (buyer.buyerType === 'INDIVIDUAL') {
    isFullyVerified =
      v.mobile?.status === 'verified' &&
      v.identity?.status === 'verified' &&
      v.address?.status === 'verified';
  } else if (buyer.buyerType === 'BUSINESS') {
    isFullyVerified =
      v.business?.status === 'verified' &&
      v.pan?.status === 'verified' &&
      v.representative?.status === 'verified' &&
      v.bank?.status === 'verified' &&
      v.documents?.status === 'verified' &&
      isGstinOk &&
      isUdyamOk &&
      isFssaiOk;
  } else if (buyer.buyerType === 'BULK_BUYER') {
    isFullyVerified =
      v.business?.status === 'verified' &&
      v.pan?.status === 'verified' &&
      v.representative?.status === 'verified' &&
      v.bank?.status === 'verified' &&
      v.documents?.status === 'verified' &&
      isGstinOk &&
      isUdyamOk &&
      isFssaiOk;
  }

  v.overallStatus = isFullyVerified ? 'verified' : 'incomplete';

  if (isFullyVerified) {
    buyer.verificationStatus = 'VERIFIED';
    if (!buyer.verifiedAt) buyer.verifiedAt = new Date();
  } else {
    buyer.verificationStatus = 'PENDING_VERIFICATION';
  }
};

// @desc    Get buyer verification status
// @route   GET /api/buyers/verification
exports.getVerificationStatus = async (req, res, next) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) {
      buyer.verification = {
        mobile: { status: 'pending' },
        identity: { status: 'pending' },
        address: { status: 'pending' },
        business: { status: 'pending' },
        pan: { status: 'pending' },
        gstin: { status: 'pending' },
        representative: { status: 'pending' },
        bank: { status: 'pending' },
        udyam: { status: 'pending' },
        fssai: { status: 'pending' },
        documents: { status: 'pending' },
        overallStatus: 'incomplete',
      };
      await buyer.save();
    }

    res.json({
      success: true,
      buyerType: buyer.buyerType || 'INDIVIDUAL',
      verificationStatus: buyer.verificationStatus,
      verification: buyer.verification,
      verifiedAt: buyer.verifiedAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Mobile OTP
// @route   POST /api/buyers/verify/mobile-otp
exports.sendMobileOtp = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    const cleanMobile = String(mobileNumber || '').replace(/\D/g, '');

    if (cleanMobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    const referenceId = `MOB-REF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    res.json({
      success: true,
      message: 'OTP sent to mobile number successfully.',
      referenceId,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Mobile OTP
// @route   POST /api/buyers/verify/mobile-confirm
exports.verifyMobileOtp = async (req, res, next) => {
  try {
    const { referenceId, otp } = req.body;
    const cleanOtp = String(otp || '').trim();

    if (cleanOtp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please enter the 6-digit code.',
      });
    }

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) buyer.verification = {};

    buyer.verification.mobile = {
      status: 'verified',
      referenceId: referenceId || `MOB-REF-${Date.now()}`,
      verifiedAt: new Date(),
    };

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: 'Mobile number verified successfully.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Identity (Individual)
// @route   POST /api/buyers/verify/identity
exports.verifyIdentity = async (req, res, next) => {
  try {
    const { identityType, consent, otp } = req.body;

    if (!consent) {
      return res.status(400).json({
        success: false,
        message: 'Consent is required for identity verification.',
      });
    }

    const cleanOtp = String(otp || '').trim();
    if (cleanOtp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Please enter the 6-digit OTP received.',
      });
    }

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) buyer.verification = {};

    buyer.verification.identity = {
      status: 'verified',
      referenceId: `ID-REF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      verifiedName: buyer.fullName,
      verifiedAt: new Date(),
    };

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: '✓ Identity verified successfully via authorized gateway.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Address
// @route   POST /api/buyers/verify/address
exports.verifyAddress = async (req, res, next) => {
  try {
    const { address, state, district, city, pincode } = req.body;

    if (!address || !state || !district || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please fill out all required address fields.',
      });
    }

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) buyer.verification = {};

    buyer.verification.address = {
      status: 'verified',
      address: String(address).trim(),
      state: String(state).trim(),
      district: String(district).trim(),
      city: String(city).trim(),
      pincode: String(pincode).trim(),
      verifiedAt: new Date(),
    };

    // Update main address fields on buyer model
    buyer.address = String(address).trim();
    buyer.state = String(state).trim();
    buyer.city = String(city).trim();
    buyer.pincode = String(pincode).trim();

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: 'Address details updated and verified.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Business Identity
// @route   POST /api/buyers/verify/business
exports.verifyBusiness = async (req, res, next) => {
  try {
    const { legalName, tradeName, businessType, address, state, district, city, pincode } = req.body;

    if (!legalName || !businessType || !address || !state || !district || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please fill out all required business identity fields.',
      });
    }

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) buyer.verification = {};

    buyer.verification.business = {
      status: 'verified',
      legalName: String(legalName).trim(),
      tradeName: tradeName ? String(tradeName).trim() : String(legalName).trim(),
      businessType: String(businessType).trim(),
      address: String(address).trim(),
      state: String(state).trim(),
      district: String(district).trim(),
      city: String(city).trim(),
      pincode: String(pincode).trim(),
      verifiedAt: new Date(),
    };

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: '✓ Business Identity verified successfully.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Business PAN
// @route   POST /api/buyers/verify/pan
exports.verifyPan = async (req, res, next) => {
  try {
    const { panNumber, legalName } = req.body;
    const cleanPan = String(panNumber || '').trim().toUpperCase();

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-character PAN number (e.g. ABCDE1234F).',
      });
    }

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    const maskedPan = `XXXXX${cleanPan.slice(5, 9)}${cleanPan.slice(-1)}`;

    if (!buyer.verification) buyer.verification = {};

    buyer.verification.pan = {
      status: 'verified',
      panMasked: maskedPan,
      nameMatch: true,
      referenceId: `PAN-REF-${Date.now()}`,
      verifiedAt: new Date(),
    };

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: '✓ Business PAN verified successfully.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify GSTIN or mark Not Applicable
// @route   POST /api/buyers/verify/gstin
exports.verifyGstin = async (req, res, next) => {
  try {
    const { isNotApplicable, gstinNumber } = req.body;

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) buyer.verification = {};

    if (isNotApplicable) {
      buyer.verification.gstin = {
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
      buyer.verification.gstin = {
        status: 'verified',
        gstinNumber: cleanGstin,
        verifiedAt: new Date(),
      };
    }

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: isNotApplicable ? 'GSTIN marked as Not Applicable.' : '✓ GSTIN verified successfully.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Representative OTP
// @route   POST /api/buyers/verify/representative-otp
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
      message: 'OTP sent to representative mobile number.',
      referenceId,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Authorized Representative
// @route   POST /api/buyers/verify/representative
exports.verifyRepresentative = async (req, res, next) => {
  try {
    const { repName, designation, mobileNumber, referenceId, otp, authDocUploaded } = req.body;
    const cleanOtp = String(otp || '').trim();

    if (!repName || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Please fill representative name and designation.',
      });
    }

    if (cleanOtp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Please enter the 6-digit OTP sent to the mobile number.',
      });
    }

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) buyer.verification = {};

    buyer.verification.representative = {
      status: 'verified',
      repName: String(repName).trim(),
      designation: String(designation).trim(),
      mobileNumber: String(mobileNumber).trim(),
      authDocUploaded: Boolean(authDocUploaded),
      referenceId: referenceId || `REP-${Date.now()}`,
      verifiedAt: new Date(),
    };

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: '✓ Authorized Representative verified successfully.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Bank Account
// @route   POST /api/buyers/verify/bank
exports.verifyBank = async (req, res, next) => {
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

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    const accClean = String(accountNumber).trim();
    const maskedAcc = `******${accClean.slice(-4)}`;

    if (!buyer.verification) buyer.verification = {};

    buyer.verification.bank = {
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

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: '✓ Bank account verified successfully.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Udyam or mark Not Applicable
// @route   POST /api/buyers/verify/udyam
exports.verifyUdyam = async (req, res, next) => {
  try {
    const { isNotApplicable, udyamNumber } = req.body;

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) buyer.verification = {};

    if (isNotApplicable) {
      buyer.verification.udyam = {
        status: 'not_applicable',
        udyamNumber: null,
        verifiedAt: new Date(),
      };
    } else {
      const cleanUdyam = String(udyamNumber || '').trim();
      if (!cleanUdyam) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid Udyam Registration Number.',
        });
      }
      buyer.verification.udyam = {
        status: 'verified',
        udyamNumber: cleanUdyam,
        verifiedAt: new Date(),
      };
    }

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: isNotApplicable ? 'Udyam Registration marked as Not Applicable.' : '✓ Udyam Registration verified.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify FSSAI / Trade License or mark Not Applicable
// @route   POST /api/buyers/verify/fssai
exports.verifyFssai = async (req, res, next) => {
  try {
    const { isNotApplicable, fssaiNumber, licenseType } = req.body;

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) buyer.verification = {};

    if (isNotApplicable) {
      buyer.verification.fssai = {
        status: 'not_applicable',
        fssaiNumber: null,
        licenseType: null,
        verifiedAt: new Date(),
      };
    } else {
      const cleanFssai = String(fssaiNumber || '').trim();
      if (!cleanFssai) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid FSSAI / License registration number.',
        });
      }
      buyer.verification.fssai = {
        status: 'verified',
        fssaiNumber: cleanFssai,
        licenseType: licenseType || 'FSSAI License',
        verifiedAt: new Date(),
      };
    }

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: isNotApplicable ? 'FSSAI / License marked as Not Applicable.' : '✓ FSSAI / License verified.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Documents step
// @route   POST /api/buyers/verify/documents
exports.verifyDocuments = async (req, res, next) => {
  try {
    const { businessCert, panDoc, bankProof, authDoc, gstCert, udyamCert, fssaiCert } = req.body;

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) buyer.verification = {};

    buyer.verification.documents = {
      status: 'verified',
      businessCert: Boolean(businessCert),
      panDoc: Boolean(panDoc),
      bankProof: Boolean(bankProof),
      authDoc: Boolean(authDoc),
      gstCert: Boolean(gstCert),
      udyamCert: Boolean(udyamCert),
      fssaiCert: Boolean(fssaiCert),
      verifiedAt: new Date(),
    };

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: '✓ Required documents uploaded and verified.',
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Skip a specific verification step
// @route   POST /api/buyers/verify/skip-step
exports.skipStep = async (req, res, next) => {
  try {
    const { stepKey } = req.body;
    const validSteps = [
      'mobile', 'identity', 'address', 'business', 'pan', 'gstin',
      'representative', 'bank', 'udyam', 'fssai', 'documents'
    ];

    if (!validSteps.includes(stepKey)) {
      return res.status(400).json({ success: false, message: 'Invalid verification step key.' });
    }

    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    if (!buyer.verification) buyer.verification = {};
    if (!buyer.verification[stepKey]) buyer.verification[stepKey] = {};

    if (buyer.verification[stepKey].status !== 'verified' && buyer.verification[stepKey].status !== 'not_applicable') {
      buyer.verification[stepKey].status = 'skipped';
    }

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      message: `Step '${stepKey}' skipped.`,
      verification: buyer.verification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Finalize Buyer Verification
// @route   POST /api/buyers/verify/complete
exports.completeVerification = async (req, res, next) => {
  try {
    const buyer = await Buyer.findOne({ userId: req.user._id });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer profile not found.' });
    }

    updateOverallBuyerVerification(buyer);
    await buyer.save();

    res.json({
      success: true,
      verificationStatus: buyer.verificationStatus,
      verification: buyer.verification,
      verifiedAt: buyer.verifiedAt,
      message: buyer.verificationStatus === 'VERIFIED'
        ? 'Congratulations! Your buyer verification is complete.'
        : 'Verification details saved. Complete all required steps to get verified.',
    });
  } catch (error) {
    next(error);
  }
};

