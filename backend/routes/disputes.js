const express = require('express');
const router = express.Router();
const { createDispute, getUserDisputes } = require('../controllers/disputeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createDispute);
router.get('/', getUserDisputes);

module.exports = router;
