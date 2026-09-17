const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Notification = require('../models/Notification');
const { generateToken } = require('../middleware/auth');

// @desc    Register Farmer
// @route   POST /api/auth/register/farmer
exports.registerFarmer = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password, farmName, farmerType, location, address } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email or mobile number already exists.',
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      password,
      role: 'FARMER',
    });

    // Create farmer profile
    const farmer = await Farmer.create({
      userId: user._id,
      fullName,
      email,
      mobileNumber,
      farmName,
      farmerType: farmerType || 'FARMER',
      location,
      address: address || '',
      verificationStatus: 'PENDING_VERIFICATION',
    });

    // Create welcome notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to AgriBazaar!',
      message: 'Your farmer account has been created. Please wait for verification to start listing products.',
      type: 'SYSTEM',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Farmer account created successfully. Verification is pending.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
      farmer: {
        id: farmer._id,
        farmName: farmer.farmName,
        farmerType: farmer.farmerType,
        verificationStatus: farmer.verificationStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register Buyer
// @route   POST /api/auth/register/buyer
exports.registerBuyer = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password, buyerType, address, city, state, pincode } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email or mobile number already exists.',
      });
    }

    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      password,
      role: 'BUYER',
    });

    const buyer = await Buyer.create({
      userId: user._id,
      fullName,
      email,
      mobileNumber,
      buyerType: buyerType || 'INDIVIDUAL',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
    });

    await Notification.create({
      userId: user._id,
      title: 'Welcome to AgriBazaar!',
      message: 'Your buyer account is ready. Start exploring fresh produce from verified farmers.',
      type: 'SYSTEM',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Buyer account created successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
      buyer: {
        id: buyer._id,
        buyerType: buyer.buyerType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    // Get role-specific profile
    let profile = null;
    if (user.role === 'FARMER') {
      profile = await Farmer.findOne({ userId: user._id });
    } else if (user.role === 'BUYER') {
      profile = await Buyer.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        profileImage: user.profileImage,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;

    let profile = null;
    if (user.role === 'FARMER') {
      profile = await Farmer.findOne({ userId: user._id });
    } else if (user.role === 'BUYER') {
      profile = await Buyer.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        profileImage: user.profileImage,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};
