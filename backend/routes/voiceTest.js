const express = require('express');
const router = express.Router();
const { processUserMessage } = require('../services/conversationService');

/**
 * POST /api/voice/test/message
 * 
 * DEVELOPMENT ONLY ENDPOINT
 * Simulates a voice turn by sending text to the AgriVoice conversation engine.
 * Does NOT create a real product or write to MongoDB.
 */
router.post('/message', async (req, res) => {
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
    console.error('[AgriVoice Test Route Error]', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
