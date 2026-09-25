const express = require('express');
const router = express.Router();
const { getAuditInfo, getAuditStatus, getAllAuditEvents, lookupAccountByHash } = require('../controllers/blockchainController');

// Read-only endpoint to get audit contract info
router.get('/info', getAuditInfo);

// Read-only endpoint to fetch all blockchain events directly from smart contract
router.get('/events', getAllAuditEvents);
router.get('/audit/events', getAllAuditEvents);

// Read-only endpoint to get audit status for an event hash
router.get('/audit/:eventIdHash', getAuditStatus);

// Read-only endpoint to lookup buyer or farmer identity by account hash
router.get('/account-lookup/:accountHash', lookupAccountByHash);

module.exports = router;
