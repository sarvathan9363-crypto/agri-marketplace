const express = require('express');
const router = express.Router();
const { getSTTStatus } = require('../ai/speechService');
const { getTTSStatus } = require('../ai/ttsService');
const { processUserMessage } = require('../services/conversationService');

/**
 * GET /api/voice/health
 * Safe diagnostic endpoint. Never exposes secrets, keys, or paths containing sensitive info.
 */
router.get('/health', (req, res) => {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  const exotelConfigured = Boolean(
    process.env.EXOTEL_API_KEY &&
    process.env.EXOTEL_ACCOUNT_SID &&
    process.env.EXOTEL_PHONE_NUMBER
  );

  const sttStatus = getSTTStatus();
  const ttsStatus = getTTSStatus();

  const isProductCreationEnabled = (process.env.VOICE_PRODUCT_CREATION_ENABLED || 'false').toLowerCase() === 'true';

  res.json({
    success: true,
    voice: 'configured',
    stt: sttStatus.mode === 'google' ? 'configured' : 'mock',
    tts: ttsStatus.mode === 'google' ? 'configured' : 'mock',
    gemini: geminiConfigured ? 'configured' : 'not-configured',
    exotel: exotelConfigured ? 'configured' : 'not-configured',
    productCreationEnabled: isProductCreationEnabled,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/voice/test/message
 * Simulated text-based voice turn for development and verification.
 */
router.post('/test/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'sessionId and message are required.'
      });
    }

    const result = await processUserMessage(sessionId, message);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('[AgriVoice Test Error]', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
