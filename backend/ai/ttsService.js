const { resolveGoogleCredentials } = require('./credentialsHelper');
const GoogleTextToSpeechProvider = require('./tts/GoogleTextToSpeechProvider');
const MockTextToSpeechProvider = require('./tts/MockTextToSpeechProvider');

let ttsProviderInstance = null;

/**
 * Initializes and returns the configured TTS provider singleton.
 * Gracefully falls back to Mock provider when credentials are not yet configured.
 * 
 * @returns {import('./tts/TextToSpeechProvider')}
 */
function getTTSProvider() {
  if (ttsProviderInstance) {
    return ttsProviderInstance;
  }

  const requestedProvider = (process.env.VOICE_TTS_PROVIDER || 'google').toLowerCase();

  if (requestedProvider === 'mock') {
    console.log('[AgriVoice][TTS] Provider explicitly set to MOCK mode.');
    ttsProviderInstance = new MockTextToSpeechProvider();
    return ttsProviderInstance;
  }

  const credCheck = resolveGoogleCredentials();
  if (credCheck.hasCredentials) {
    try {
      ttsProviderInstance = new GoogleTextToSpeechProvider({ keyFilename: credCheck.resolvedPath });
      console.log('[AgriVoice][TTS] Google Cloud TTS provider initialized successfully.');
      return ttsProviderInstance;
    } catch (err) {
      console.warn(`[AgriVoice][TTS] Failed to initialize Google TTS provider (${err.message}). Falling back to Mock TTS.`);
      ttsProviderInstance = new MockTextToSpeechProvider();
      return ttsProviderInstance;
    }
  } else {
    console.warn(`[AgriVoice][TTS] Notice: ${credCheck.error} Running in Mock TTS mode.`);
    ttsProviderInstance = new MockTextToSpeechProvider();
    return ttsProviderInstance;
  }
}

/**
 * Converts text into base64 encoded LINEAR16 8000Hz raw PCM audio for Exotel AgentStream.
 * 
 * @param {string} text - The text to synthesize
 * @param {string} [language='ta'] - Detected language ('ta', 'en', 'tanglish')
 * @returns {Promise<string>} Base64 encoded raw PCM audio payload
 */
async function synthesizeSpeech(text, language = 'ta') {
  const provider = getTTSProvider();
  return provider.synthesize(text, language);
}

/**
 * Returns current TTS status for diagnostics without leaking secrets.
 */
function getTTSStatus() {
  const provider = getTTSProvider();
  return provider.getStatus();
}

module.exports = {
  synthesizeSpeech,
  getTTSProvider,
  getTTSStatus
};
