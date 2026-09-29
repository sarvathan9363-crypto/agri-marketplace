const razorpayRouteService = require('../services/razorpayRouteService');

exports.getPaymentAccountStatus = async (req, res, next) => {
  try {
    const status = await razorpayRouteService.getAccountStatus(req.user._id);
    res.json(status);
  } catch (error) {
    next(error);
  }
};

exports.initiateOnboarding = async (req, res, next) => {
  try {
    const result = await razorpayRouteService.initiateOnboarding(req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.refreshStatus = async (req, res, next) => {
  try {
    const result = await razorpayRouteService.syncAccountStatus(req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.continueSetup = async (req, res, next) => {
  try {
    const result = await razorpayRouteService.initiateOnboarding(req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
