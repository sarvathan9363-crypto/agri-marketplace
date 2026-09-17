const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getMyProducts, getSalesStats, getDashboard, getVerificationStatus } = require('../controllers/farmerController');
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

module.exports = router;
