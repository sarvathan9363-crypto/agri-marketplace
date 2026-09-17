const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPayment, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/:id', getPaymentStatus);

module.exports = router;
