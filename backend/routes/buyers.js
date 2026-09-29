const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDashboard,
  getVerificationStatus,
  sendMobileOtp,
  verifyMobileOtp,
  verifyIdentity,
  verifyAddress,
  verifyBusiness,
  verifyPan,
  verifyGstin,
  sendRepOtp,
  verifyRepresentative,
  verifyBank,
  verifyUdyam,
  verifyFssai,
  verifyDocuments,
  skipStep,
  completeVerification,
} = require('../controllers/buyerController');
const { getBuyerOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('BUYER'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/orders', getBuyerOrders);
router.get('/dashboard', getDashboard);

// Verification routes
router.get('/verification', getVerificationStatus);
router.post('/verify/mobile-otp', sendMobileOtp);
router.post('/verify/mobile-confirm', verifyMobileOtp);
router.post('/verify/identity', verifyIdentity);
router.post('/verify/address', verifyAddress);
router.post('/verify/business', verifyBusiness);
router.post('/verify/pan', verifyPan);
router.post('/verify/gstin', verifyGstin);
router.post('/verify/representative-otp', sendRepOtp);
router.post('/verify/representative', verifyRepresentative);
router.post('/verify/bank', verifyBank);
router.post('/verify/udyam', verifyUdyam);
router.post('/verify/fssai', verifyFssai);
router.post('/verify/documents', verifyDocuments);
router.post('/verify/skip-step', skipStep);
router.post('/verify/complete', completeVerification);

module.exports = router;
