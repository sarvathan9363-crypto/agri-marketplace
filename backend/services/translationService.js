const crypto = require('crypto');

const SUPPORTED_LANGUAGES = new Set(['en-IN', 'ta-IN', 'hi-IN', 'te-IN', 'kn-IN', 'ml-IN']);
const SOURCE_LANGUAGE = 'en-IN';
const MAX_CHUNK_LENGTH = 2000;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const cache = new Map();

const normalise = (text) => text.replace(/\s+/g, ' ').trim();
const keyFor = (text, targetLanguage) => crypto.createHash('sha256')
  .update(`${SOURCE_LANGUAGE}:${targetLanguage}:${normalise(text)}`)
  .digest('hex');

// Prefer sentence/word boundaries, while still guaranteeing Sarvam's 2,000-char limit.
const chunkText = (text) => {
  const chunks = [];
  let remaining = text;
  while (remaining.length > MAX_CHUNK_LENGTH) {
    let splitAt = Math.max(remaining.lastIndexOf('. ', MAX_CHUNK_LENGTH), remaining.lastIndexOf(' ', MAX_CHUNK_LENGTH));
    if (splitAt < 1) splitAt = MAX_CHUNK_LENGTH;
    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
};

const getCached = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  if (item.expiresAt < Date.now()) { cache.delete(key); return null; }
  return item.value;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestTranslation = async (input, targetLanguage, attempt = 0) => {
  if (!process.env.SARVAM_API_KEY) {
    const error = new Error('Translation service is not configured');
    error.code = 'TRANSLATION_UNAVAILABLE';
    throw error;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(process.env.SARVAM_TRANSLATE_URL || 'https://api.sarvam.ai/translate', {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', 'api-subscription-key': process.env.SARVAM_API_KEY },
      body: JSON.stringify({ input, source_language_code: SOURCE_LANGUAGE, target_language_code: targetLanguage }),
    });
    if (!response.ok) {
      const error = new Error(`Sarvam request failed (${response.status})`);
      error.code = response.status === 400 || response.status === 422 ? 'INVALID_TRANSLATION_TEXT'
        : response.status === 402 ? 'TRANSLATION_CREDITS_EXHAUSTED'
          : response.status === 403 ? 'TRANSLATION_AUTH_FAILED'
            : response.status === 429 ? 'TRANSLATION_RATE_LIMITED' : 'TRANSLATION_UNAVAILABLE';
      error.retryable = response.status === 429 || response.status >= 500;
      throw error;
    }
    const payload = await response.json();
    const translated = payload.translated_text || payload.translation || payload.output;
    if (typeof translated !== 'string') throw Object.assign(new Error('Unexpected translation response'), { code: 'TRANSLATION_UNAVAILABLE' });
    return translated;
  } catch (error) {
    // Only transient rate-limit/server/network failures are retried. Authentication,
    // invalid input, and credit errors must be returned immediately.
    const retryable = error.retryable || error.name === 'TypeError' || error.name === 'AbortError';
    if (retryable && attempt < 2) {
      await delay(250 * (2 ** attempt));
      return requestTranslation(input, targetLanguage, attempt + 1);
    }
    throw error;
  } finally { clearTimeout(timeout); }
};

async function translateText({ text, sourceLanguage = SOURCE_LANGUAGE, targetLanguage }) {
  if (typeof text !== 'string' || !normalise(text)) return text;
  if (sourceLanguage !== SOURCE_LANGUAGE || !SUPPORTED_LANGUAGES.has(targetLanguage)) {
    throw Object.assign(new Error('Unsupported translation language'), { code: 'INVALID_LANGUAGE' });
  }
  if (targetLanguage === SOURCE_LANGUAGE) return text;
  const key = keyFor(text, targetLanguage);
  const cached = getCached(key);
  if (cached) return cached;
  try {
    const translated = (await Promise.all(chunkText(text).map((chunk) => requestTranslation(chunk, targetLanguage)))).join(' ');
    cache.set(key, { value: translated, expiresAt: Date.now() + CACHE_TTL_MS });
    return translated;
  } catch (error) {
    // No source text, API key, or response body is logged. Consumers receive a safe code only.
    console.warn(`[translation] ${error.code || 'TRANSLATION_UNAVAILABLE'}`);
    throw error;
  }
}

module.exports = { translateText, SUPPORTED_LANGUAGES, SOURCE_LANGUAGE };
