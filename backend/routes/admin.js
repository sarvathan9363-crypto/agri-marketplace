const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const disputeController = require('../controllers/disputeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.get('/farmers', adminController.getFarmers);
router.get('/farmers/settlements', adminController.getFarmerSettlements);
router.put('/farmers/:id/verify', adminController.verifyFarmer);
router.get('/products', adminController.getProducts);
router.put('/products/:id/status', adminController.updateProductStatus);
router.get('/orders', adminController.getOrders);
router.get('/payments', adminController.getPayments);
router.get('/analytics', adminController.getAnalytics);
router.get('/disputes', disputeController.getAllDisputes);
router.put('/disputes/:id', disputeController.updateDispute);

module.exports = router;
