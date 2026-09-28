/**
 * Abstract / Base class for Text-To-Speech providers.
 * Ensures telephony and orchestration code remains completely provider-neutral.
 */
class TextToSpeechProvider {
  /**
   * Synthesizes text into base64-encoded PCM audio suitable for Exotel AgentStream (8000Hz LINEAR16 mono).
   * @param {string} text - Text to synthesize
   * @param {string} [language='ta'] - Language code ('ta', 'en', 'tanglish')
   * @returns {Promise<string>} Base64 encoded raw PCM audio
   */
  async synthesize(text, language = 'ta') {
    throw new Error('synthesize() must be implemented by TextToSpeechProvider subclass');
  }

  /**
   * Reports provider health and configuration status.
   * @returns {Object}
   */
  getStatus() {
    return { name: 'TextToSpeechProvider', ready: false };
  }
}

module.exports = TextToSpeechProvider;
