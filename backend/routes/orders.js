const express = require('express');
const router = express.Router();
const { createOrder, getOrder, updateOrderStatus, getBuyerOrders, getFarmerOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('BUYER'), createOrder);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
