const express = require('express');
const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001';

// Helper validator for malicious or invalid inputs
const validateStringField = (val, fieldName) => {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  const lower = str.toLowerCase();
  if (['nan', 'infinity', '-infinity', 'null', 'undefined'].includes(lower)) {
    throw new Error(`Invalid value for ${fieldName}.`);
  }
  return str;
};

const validateHorizon = (horizon) => {
  const h = Number(horizon);
  if (isNaN(h) || !Number.isInteger(h) || h < 1 || h > 30) {
    throw new Error('horizonDays must be an integer between 1 and 30.');
  }
  return h;
};

/**
 * @route   POST /api/ml/price/predict
 * @desc    Predict future modal price for an agricultural commodity
 * @access  Public / Protected
 */
router.post('/price/predict', async (req, res) => {
  try {
    const { commodity, state, district, market, horizonDays = 7 } = req.body;

    if (!commodity || !String(commodity).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Commodity name is required.',
      });
    }

    const cleanCommodity = validateStringField(commodity, 'commodity');
    const cleanState = validateStringField(state, 'state');
    const cleanDistrict = validateStringField(district, 'district');
    const cleanMarket = validateStringField(market, 'market');
    const cleanHorizon = validateHorizon(horizonDays);

    const mlResponse = await fetch(`${ML_SERVICE_URL}/predict/price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commodity: cleanCommodity,
        state: cleanState,
        district: cleanDistrict,
        market: cleanMarket,
        horizonDays: cleanHorizon,
      }),
    });

    if (!mlResponse.ok) {
      const errData = await mlResponse.json().catch(() => ({}));
      return res.status(mlResponse.status).json({
        success: false,
        message: errData.detail || 'Price prediction service error.',
      });
    }

    const result = await mlResponse.json();

    // Conform exactly to requested response format
    return res.json({
      success: true,
      commodity: result.commodity,
      location: result.location || result.district || result.state || 'All-India',
      state: result.state,
      district: result.district,
      market: result.market,
      horizonDays: result.horizonDays,
      currentPrice: result.currentPrice,
      predictedPrice: result.predictedPrice,
      currency: result.currency || 'INR',
      unit: result.unit || 'QUINTAL',
      model: result.model || 'xgboost',
      forecastDate: result.forecastDate,
      historicalSeries: result.historicalSeries || [],
      forecastSeries: result.forecastSeries || [],
    });
  } catch (error) {
    if (error.message && (error.message.includes('horizonDays') || error.message.includes('Invalid value'))) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error('[ML Proxy Error - Price]:', error.message);
    return res.status(503).json({
      success: false,
      message: 'ML inference service is currently unavailable. Please verify Python FastAPI service is running.',
    });
  }
});

/**
 * @route   POST /api/ml/demand/forecast
 * @desc    Forecast agricultural demand volume in KG
 * @access  Public / Protected
 */
router.post('/demand/forecast', async (req, res) => {
  try {
    const { product, location, horizonDays = 7 } = req.body;

    if (!product || !String(product).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required.',
      });
    }

    const cleanProduct = validateStringField(product, 'product');
    const cleanLocation = validateStringField(location, 'location') || 'Coimbatore';
    const cleanHorizon = validateHorizon(horizonDays);

    const mlResponse = await fetch(`${ML_SERVICE_URL}/forecast/demand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: cleanProduct,
        location: cleanLocation,
        horizonDays: cleanHorizon,
      }),
    });

    if (!mlResponse.ok) {
      const errData = await mlResponse.json().catch(() => ({}));
      return res.status(mlResponse.status).json({
        success: false,
        message: errData.detail || 'Demand forecasting service error.',
      });
    }

    const result = await mlResponse.json();

    // Conform exactly to requested response format
    return res.json({
      success: true,
      product: result.product,
      location: result.location,
      horizonDays: result.horizonDays,
      currentDemand: result.currentDemand,
      predictedDemand: result.predictedDemand,
      demandLevel: result.demandLevel,
      unit: result.unit || 'KG',
      model: result.model || 'xgboost',
      dataSource: result.dataSource || 'AgriBazaar Orders',
      isBootstrap: Boolean(result.isBootstrap),
      forecastDate: result.forecastDate,
      historicalSeries: result.historicalSeries || [],
      forecastSeries: result.forecastSeries || [],
    });
  } catch (error) {
    if (error.message && (error.message.includes('horizonDays') || error.message.includes('Invalid value'))) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error('[ML Proxy Error - Demand]:', error.message);
    return res.status(503).json({
      success: false,
      message: 'ML inference service is currently unavailable. Please verify Python FastAPI service is running.',
    });
  }
});

/**
 * @route   GET /api/ml/options
 * @desc    Provides available commodities, locations, and markets for frontend dropdowns
 */
router.get('/options', async (req, res) => {
  try {
    const [priceMetaRes, demandMetaRes] = await Promise.all([
      fetch(`${ML_SERVICE_URL}/meta/price`).then((r) => r.json()).catch(() => ({})),
      fetch(`${ML_SERVICE_URL}/meta/demand`).then((r) => r.json()).catch(() => ({})),
    ]);

    const priceMeta = priceMetaRes.metadata || {};
    const demandMeta = demandMetaRes.metadata || {};

    return res.json({
      success: true,
      commodities: priceMeta.availableCommodities || ['Tomato', 'Onion', 'Potato', 'Paddy', 'Wheat', 'Banana', 'Brinjal'],
      states: priceMeta.availableStates || ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Punjab', 'Gujarat', 'Uttar Pradesh'],
      markets: priceMeta.availableMarkets || ['Mettupalayam', 'Coimbatore', 'Pune', 'Nashik', 'Karnal'],
      products: demandMeta.availableProducts || ['Tomato', 'Onion', 'Potato', 'Paddy', 'Wheat', 'Banana', 'Brinjal', 'Green Chilli'],
      locations: demandMeta.availableLocations || ['Coimbatore', 'Pune', 'Nashik', 'Karnal', 'Bengaluru', 'Indore'],
      priceMetrics: priceMeta.metrics || {},
      demandMetrics: demandMeta.metrics || {},
      priceBaseline: priceMeta.baselineMetrics || {},
      demandBaseline: demandMeta.baselineMetrics || {},
      demandDataSource: demandMeta.dataSource || 'Demo/Bootstrap',
      isBootstrap: Boolean(demandMeta.isBootstrap),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve ML options.',
    });
  }
});

module.exports = router;
