const router = require('express').Router();
const { translate } = require('../controllers/translationController');

// Public text only. Product endpoints selectively invoke the same service.
router.post('/', translate);
module.exports = router;
