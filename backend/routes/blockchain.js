const express = require('express');
const router = express.Router();
const { getAuditInfo, getAuditStatus } = require('../controllers/blockchainController');

// Read-only endpoint to get audit contract info
router.get('/info', getAuditInfo);

// Read-only endpoint to get audit status for an event hash
router.get('/audit/:eventIdHash', getAuditStatus);

module.exports = router;
