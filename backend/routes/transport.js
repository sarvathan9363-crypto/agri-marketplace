const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const { protect } = require('../middleware/auth');

router.get('/requests', protect, transportController.getRequests);
router.post('/requests', protect, transportController.createRequest);
router.get('/requests/:id', protect, transportController.getRequestById);
router.post('/requests/:id/quotes', protect, transportController.submitQuotation);
router.post('/quotes/:quoteId/withdraw', protect, transportController.withdrawQuotation);
router.post('/requests/:id/select-quote', protect, transportController.selectQuotation);
router.post('/quotes/:quoteId/accept', protect, transportController.acceptQuotationJob);
router.put('/requests/:id/shipment-status', protect, transportController.updateShipmentStatus);

router.get('/profile', protect, transportController.getTransporterProfile);
router.put('/profile', protect, transportController.updateTransporterProfile);
router.get('/my-shipments', protect, transportController.getTransporterShipments);

module.exports = router;
