const TextToSpeechProvider = require('./TextToSpeechProvider');

class MockTextToSpeechProvider extends TextToSpeechProvider {
  /**
   * Generates a 200ms silent PCM buffer (3200 bytes at 8000Hz 16-bit mono) base64 encoded.
   */
  async synthesize(text, language = 'ta') {
    // 8000 Hz, 16-bit mono = 16000 bytes/sec. 200ms = 3200 bytes.
    const silentPcm = Buffer.alloc(3200, 0);
    return silentPcm.toString('base64');
  }

  getStatus() {
    return { name: 'mock', ready: true, mode: 'mock' };
  }
}

module.exports = MockTextToSpeechProvider;
