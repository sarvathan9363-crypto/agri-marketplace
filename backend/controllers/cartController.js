const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get cart
// @route   GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ buyerId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ buyerId: req.user._id, items: [], totalAmount: 0 });
    }
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.status !== 'ACTIVE') {
      return res.status(400).json({ success: false, message: 'This product is not available.' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} ${product.unit} available.`,
      });
    }

    let cart = await Cart.findOne({ buyerId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ buyerId: req.user._id, items: [], totalAmount: 0 });
    }

    // Check if product already in cart
    const existingIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = quantity;
      cart.items[existingIndex].subtotal = quantity * product.pricePerUnit;
    } else {
      cart.items.push({
        productId: product._id,
        productName: product.productName,
        productImage: product.images?.[0] || '',
        farmerId: product.farmerUserId,
        farmerName: product.farmerName,
        quantity,
        unit: product.unit,
        pricePerUnit: product.pricePerUnit,
        subtotal: quantity * product.pricePerUnit,
      });
    }

    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    await cart.save();

    res.json({ success: true, message: 'Product added to cart.', cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ buyerId: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    // Validate stock
    const product = await Product.findById(item.productId);
    if (product && product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} ${product.unit} available.`,
      });
    }

    item.quantity = quantity;
    item.subtotal = quantity * item.pricePerUnit;
    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
    await cart.save();

    res.json({ success: true, message: 'Cart updated.', cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ buyerId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    await cart.save();

    res.json({ success: true, message: 'Item removed from cart.', cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { buyerId: req.user._id },
      { items: [], totalAmount: 0 }
    );
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};
