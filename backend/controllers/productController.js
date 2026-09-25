const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const { translateText, SUPPORTED_LANGUAGES } = require('../services/translationService');

// Product title and description are public marketplace copy. Never pass farmer identity,
// contact details, location, documents, or any account/payment fields to Sarvam.
const localiseProduct = async (product, language) => {
  if (!product || !language || language === 'en-IN' || !SUPPORTED_LANGUAGES.has(language)) return product;
  const localized = product.toObject ? product.toObject() : { ...product };
  await Promise.all(['productName', 'description'].map(async (field) => {
    if (!localized[field]) return;
    try { localized[field] = await translateText({ text: localized[field], targetLanguage: language }); } catch (_) { /* source-text fallback */ }
  }));
  return localized;
};

// @desc    Create product
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user._id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
    }

    const productData = {
      ...req.body,
      farmerId: farmer._id,
      farmerUserId: req.user._id,
      farmerName: farmer.farmName || farmer.fullName,
      farmerVerificationStatus: farmer.verificationStatus,
    };

    // Only verified farmers can publish active products
    if (farmer.verificationStatus !== 'VERIFIED' && req.body.status === 'ACTIVE') {
      productData.status = 'DRAFT';
    }

    const product = await Product.create(productData);

    // Update farmer product count
    await Farmer.findByIdAndUpdate(farmer._id, { $inc: { totalProducts: 1 } });

    res.status(201).json({
      success: true,
      message: product.status === 'DRAFT' && farmer.verificationStatus !== 'VERIFIED'
        ? 'Product saved as draft. Get verified to publish active listings.'
        : 'Product created successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (marketplace)
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category, minPrice, maxPrice, location, search,
      sort, page = 1, limit = 12, status, farmerId
    } = req.query;

    const query = {};

    // Default: only show active products in marketplace
    if (status) {
      query.status = status;
    } else {
      query.status = 'ACTIVE';
    }

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (farmerId) query.farmerId = farmerId;

    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { pricePerUnit: 1 };
    if (sort === 'price_desc') sortOption = { pricePerUnit: -1 };
    if (sort === 'popular') sortOption = { orderCount: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));
    const localizedProducts = await Promise.all(products.map((product) => localiseProduct(product, req.query.language)));

    res.json({
      success: true,
      products: localizedProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    // Get farmer info
    const farmer = await Farmer.findById(product.farmerId);

    const localizedProduct = await localiseProduct(product, req.query.language);
    res.json({
      success: true,
      product: localizedProduct,
      farmer: farmer ? {
        id: farmer._id,
        fullName: farmer.fullName,
        farmName: farmer.farmName,
        farmerType: farmer.farmerType,
        location: farmer.location,
        verificationStatus: farmer.verificationStatus,
        totalProducts: farmer.totalProducts,
      } : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check ownership
    if (product.farmerUserId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product.' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Product updated successfully.', product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.farmerUserId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product.' });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Update farmer product count
    await Farmer.findByIdAndUpdate(product.farmerId, { $inc: { totalProducts: -1 } });

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
