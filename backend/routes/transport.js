const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/requests', protect, authorize('BUYER', 'TRANSPORTER', 'ADMIN'), transportController.getRequests);
router.post('/requests', protect, authorize('BUYER'), transportController.createRequest);
router.get('/requests/:id', protect, authorize('BUYER', 'TRANSPORTER', 'ADMIN'), transportController.getRequestById);
router.post('/requests/:id/quotes', protect, authorize('TRANSPORTER'), transportController.submitQuotation);
router.post('/quotes/:quoteId/withdraw', protect, authorize('TRANSPORTER'), transportController.withdrawQuotation);
router.post('/requests/:id/select-quote', protect, authorize('BUYER', 'ADMIN'), transportController.selectQuotation);
router.post('/quotes/:quoteId/accept', protect, authorize('TRANSPORTER'), transportController.acceptJob || transportController.acceptQuotationJob);
router.put('/requests/:id/shipment-status', protect, authorize('TRANSPORTER', 'ADMIN'), transportController.updateShipmentStatus);

router.get('/profile', protect, authorize('TRANSPORTER'), transportController.getTransporterProfile);
router.put('/profile', protect, authorize('TRANSPORTER'), transportController.updateTransporterProfile);
router.get('/my-shipments', protect, authorize('TRANSPORTER'), transportController.getTransporterShipments);

// Transporter Verification routes
router.get('/verification', protect, authorize('TRANSPORTER'), transportController.getVerificationStatus);
router.post('/verification/basic-details', protect, authorize('TRANSPORTER'), transportController.saveBasicDetails);
router.post('/verification/identity', protect, authorize('TRANSPORTER'), transportController.saveIdentity);
router.post('/verification/business-registration', protect, authorize('TRANSPORTER'), transportController.saveBusinessRegistration);
router.post('/verification/bank-account', protect, authorize('TRANSPORTER'), transportController.saveBankAccount);
router.post('/verification/vehicles', protect, authorize('TRANSPORTER'), transportController.saveVehicle);
router.delete('/verification/vehicles/:vehicleId', protect, authorize('TRANSPORTER'), transportController.deleteVehicle);
router.post('/verification/drivers', protect, authorize('TRANSPORTER'), transportController.saveDriver);
router.delete('/verification/drivers/:driverId', protect, authorize('TRANSPORTER'), transportController.deleteDriver);
router.post('/verification/submit', protect, authorize('TRANSPORTER'), transportController.submitVerification);
router.post('/verification/skip-step', protect, authorize('TRANSPORTER'), transportController.skipStep);

module.exports = router;
