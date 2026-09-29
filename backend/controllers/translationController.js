const { translateText, SUPPORTED_LANGUAGES, SOURCE_LANGUAGE } = require('../services/translationService');

exports.translate = async (req, res) => {
  const { text, sourceLanguage = SOURCE_LANGUAGE, targetLanguage } = req.body || {};
  if (typeof text !== 'string' || !text.trim()) return res.status(400).json({ success: false, code: 'INVALID_TRANSLATION_TEXT' });
  if (sourceLanguage !== SOURCE_LANGUAGE || !SUPPORTED_LANGUAGES.has(targetLanguage)) return res.status(400).json({ success: false, code: 'INVALID_LANGUAGE' });
  try {
    const translation = await translateText({ text, sourceLanguage, targetLanguage });
    return res.json({ success: true, translation });
  } catch (error) {
    const status = error.code === 'INVALID_TRANSLATION_TEXT' ? 400
      : error.code === 'TRANSLATION_AUTH_FAILED' ? 503
        : error.code === 'TRANSLATION_CREDITS_EXHAUSTED' ? 402 : error.code === 'TRANSLATION_RATE_LIMITED' ? 429 : 503;
    return res.status(status).json({ success: false, code: error.code || 'TRANSLATION_UNAVAILABLE' });
  }
};
