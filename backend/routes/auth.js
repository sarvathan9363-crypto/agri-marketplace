const express = require('express');
const router = express.Router();
const { registerFarmer, registerBuyer, registerTransporter, login, getMe, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register/farmer', registerFarmer);
router.post('/register/buyer', registerBuyer);
router.post('/register/transporter', registerTransporter);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);

module.exports = router;
