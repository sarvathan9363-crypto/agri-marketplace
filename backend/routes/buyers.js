const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getDashboard } = require('../controllers/buyerController');
const { getBuyerOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('BUYER'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/orders', getBuyerOrders);
router.get('/dashboard', getDashboard);

module.exports = router;
