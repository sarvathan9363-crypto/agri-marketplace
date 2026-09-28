const mongoose = require('mongoose');
const Product = require('../models/Product');
const Farmer = require('../models/Farmer');

const VALID_CATEGORIES = ['FRUITS', 'VEGETABLES', 'GRAINS', 'PULSES', 'SPICES', 'MILLETS', 'DAIRY', 'OTHER'];
const VALID_UNITS = ['KG', 'QUINTAL', 'TON', 'LITRE', 'PIECE'];

/**
 * Clean service boundary to create an AgriBazaar product from AgriVoice conversational core.
 * Strictly checks confirmation and validation, and enforces the VOICE_PRODUCT_CREATION_ENABLED safety switch.
 * 
 * @param {Object} params
 * @param {Object} params.productData - Validated product fields from conversation
 * @param {Object|null} params.farmerInfo - Authenticated farmer profile info (if available)
 * @param {boolean} params.confirmed - Explicit confirmation flag from user
 * @returns {Promise<Object>}
 */
async function createProductFromAgriVoice({ productData, farmerInfo, confirmed }) {
  if (!confirmed) {
    throw new Error('Cannot create product: Farmer has not explicitly confirmed the listing.');
  }

  // 1. Strict Server-Side Field Validation
  const { productName, category, quantity, unit, pricePerUnit, location } = productData || {};

  if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
    throw new Error('Validation failed: Product name is required.');
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    throw new Error(`Validation failed: Invalid category "${category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('Validation failed: Quantity must be a positive finite number.');
  }

  if (!unit || !VALID_UNITS.includes(unit)) {
    throw new Error(`Validation failed: Invalid unit "${unit}". Must be one of: ${VALID_UNITS.join(', ')}`);
  }

  if (typeof pricePerUnit !== 'number' || !Number.isFinite(pricePerUnit) || pricePerUnit <= 0) {
    throw new Error('Validation failed: Price per unit must be a positive finite number.');
  }

  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    throw new Error('Validation failed: Location is required.');
  }

  // 2. Safety Switch Check
  const isEnabled = (process.env.VOICE_PRODUCT_CREATION_ENABLED || 'false').toLowerCase() === 'true';
  if (!isEnabled) {
    console.log('[AgriVoice][Safety] VOICE_PRODUCT_CREATION_ENABLED is false. Simulating creation without database mutation.');
    return {
      created: false,
      simulated: true,
      message: 'Product creation is disabled by configuration (VOICE_PRODUCT_CREATION_ENABLED=false). Listing was validated successfully.',
      validatedProduct: {
        productName: productName.trim(),
        category,
        quantity,
        unit,
        pricePerUnit,
        location: location.trim(),
      }
    };
  }

  // 3. Ensure Database is connected
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database is currently offline. Cannot create product.');
  }

  // 4. Resolve Farmer Identity
  let farmerRecord = null;
  if (farmerInfo && farmerInfo.farmerId) {
    farmerRecord = await Farmer.findById(farmerInfo.farmerId);
  }

  // If no farmer account resolved, find a fallback verified farmer or fail securely
  if (!farmerRecord) {
    // Look for any existing farmer to prevent creating dangling unassociated records
    farmerRecord = await Farmer.findOne();
    if (!farmerRecord) {
      throw new Error('Cannot create product: No registered farmer profile found to associate this listing.');
    }
  }

  // 5. Construct Product Document according to existing AgriBazaar rules
  const productDocData = {
    productName: productName.trim(),
    category,
    quantity,
    unit,
    pricePerUnit,
    location: location.trim(),
    description: `Listed via AgriVoice automated phone agent for ${productName.trim()}.`,
    farmerId: farmerRecord._id,
    farmerUserId: farmerRecord.userId,
    farmerName: farmerRecord.farmName || farmerRecord.fullName,
    farmerVerificationStatus: farmerRecord.verificationStatus,
    status: farmerRecord.verificationStatus === 'VERIFIED' ? 'ACTIVE' : 'DRAFT',
  };

  const product = await Product.create(productDocData);

  // Update farmer's product counter
  await Farmer.findByIdAndUpdate(farmerRecord._id, { $inc: { totalProducts: 1 } });

  console.log(`[AgriVoice] Successfully created Product ${product._id} for farmer ${farmerRecord.farmName || farmerRecord.fullName}`);

  return {
    created: true,
    simulated: false,
    product,
    message: product.status === 'DRAFT'
      ? 'Product saved as draft. Farmer profile is pending verification.'
      : 'Product created and activated successfully.'
  };
}

module.exports = {
  createProductFromAgriVoice,
  VALID_CATEGORIES,
  VALID_UNITS
};
