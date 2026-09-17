const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getMyProducts,
  getSalesStats,
  getDashboard,
  getVerificationStatus,
  sendAadhaarOtp,
  verifyAadhaarOtp,
  verifyFarmerRegistry,
  verifyLandRecord,
  verifyBankAccount,
  verifyPan,
  verifyPmKisan,
} = require('../controllers/farmerController');
const { getFarmerOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('FARMER'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/products', getMyProducts);
router.get('/orders', getFarmerOrders);
router.get('/sales', getSalesStats);
router.get('/dashboard', getDashboard);
router.get('/verification', getVerificationStatus);

// Verification wizard endpoints
router.post('/verify/aadhaar-otp', sendAadhaarOtp);
router.post('/verify/aadhaar-confirm', verifyAadhaarOtp);
router.post('/verify/farmer-id', verifyFarmerRegistry);
router.post('/verify/land-record', verifyLandRecord);
router.post('/verify/bank-account', verifyBankAccount);
router.post('/verify/pan', verifyPan);
router.post('/verify/pm-kisan', verifyPmKisan);

module.exports = router;
