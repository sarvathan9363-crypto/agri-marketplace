const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('FARMER'), createProduct);
router.put('/:id', protect, authorize('FARMER', 'ADMIN'), updateProduct);
router.delete('/:id', protect, authorize('FARMER', 'ADMIN'), deleteProduct);

module.exports = router;
