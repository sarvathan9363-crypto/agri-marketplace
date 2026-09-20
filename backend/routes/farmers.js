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
  skipStep,
  verifyOrgIdentity,
  verifyOrgPan,
  verifyGstin,
  sendRepOtp,
  verifyRepOtp,
  verifyOrgBank,
  verifyOrgDocuments,
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

// Verification wizard endpoints (Farmer & FPO)
router.post('/verify/aadhaar-otp', sendAadhaarOtp);
router.post('/verify/aadhaar-confirm', verifyAadhaarOtp);
router.post('/verify/farmer-id', verifyFarmerRegistry);
router.post('/verify/land-record', verifyLandRecord);
router.post('/verify/bank-account', verifyBankAccount);
router.post('/verify/pan', verifyPan);
router.post('/verify/pm-kisan', verifyPmKisan);
router.post('/verify/skip-step', skipStep);

// FPO Verification endpoints
router.post('/verify/fpo-org-identity', verifyOrgIdentity);
router.post('/verify/fpo-org-pan', verifyOrgPan);
router.post('/verify/fpo-gstin', verifyGstin);
router.post('/verify/fpo-rep-otp', sendRepOtp);
router.post('/verify/fpo-rep-confirm', verifyRepOtp);
router.post('/verify/fpo-org-bank', verifyOrgBank);
router.post('/verify/fpo-org-docs', verifyOrgDocuments);

module.exports = router;
