const { resolveGoogleCredentials } = require('./credentialsHelper');
const GoogleSpeechToTextProvider = require('./stt/GoogleSpeechToTextProvider');
const MockSpeechToTextProvider = require('./stt/MockSpeechToTextProvider');

let sttProviderInstance = null;

/**
 * Initializes and returns the configured STT provider singleton.
 * Gracefully falls back to Mock provider when credentials are not yet configured.
 * 
 * @returns {import('./stt/SpeechToTextProvider')}
 */
function getSTTProvider() {
  if (sttProviderInstance) {
    return sttProviderInstance;
  }

  const requestedProvider = (process.env.VOICE_STT_PROVIDER || 'google').toLowerCase();

  if (requestedProvider === 'mock') {
    console.log('[AgriVoice][STT] Provider explicitly set to MOCK mode.');
    sttProviderInstance = new MockSpeechToTextProvider();
    return sttProviderInstance;
  }

  const credCheck = resolveGoogleCredentials();
  if (credCheck.hasCredentials) {
    try {
      sttProviderInstance = new GoogleSpeechToTextProvider({ keyFilename: credCheck.resolvedPath });
      console.log('[AgriVoice][STT] Google Cloud Speech provider initialized successfully.');
      return sttProviderInstance;
    } catch (err) {
      console.warn(`[AgriVoice][STT] Failed to initialize Google Speech provider (${err.message}). Falling back to Mock STT.`);
      sttProviderInstance = new MockSpeechToTextProvider();
      return sttProviderInstance;
    }
  } else {
    console.warn(`[AgriVoice][STT] Notice: ${credCheck.error} Running in Mock STT mode.`);
    sttProviderInstance = new MockSpeechToTextProvider();
    return sttProviderInstance;
  }
}

/**
 * Creates a streaming STT recognizer stream.
 * 
 * @param {Function} onTranscript - Callback when a transcript is finalized
 * @param {Function} [onInterimTranscript] - Callback for interim transcripts
 * @param {Function} [onError] - Callback on stream error
 * @returns {import('stream').Writable}
 */
function createSpeechStream(onTranscript, onInterimTranscript, onError) {
  const provider = getSTTProvider();
  return provider.createStream({ onTranscript, onInterimTranscript, onError });
}

/**
 * Returns current STT status for diagnostics without leaking secrets.
 */
function getSTTStatus() {
  const provider = getSTTProvider();
  return provider.getStatus();
}

module.exports = {
  createSpeechStream,
  getSTTProvider,
  getSTTStatus
};
