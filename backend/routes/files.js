const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  uploadMiddleware,
  uploadFile,
  getUserFiles,
  getFileById,
  deleteFile,
} = require('../controllers/fileController');

// All file routes are protected with JWT auth
router.use(protect);

router.post('/upload', uploadMiddleware.single('file'), uploadFile);
router.get('/', getUserFiles);
router.get('/:id', getFileById);
router.delete('/:id', deleteFile);

module.exports = router;
