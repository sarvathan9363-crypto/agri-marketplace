const textToSpeech = require('@google-cloud/text-to-speech');
const TextToSpeechProvider = require('./TextToSpeechProvider');

class GoogleTextToSpeechProvider extends TextToSpeechProvider {
  /**
   * @param {Object} [options]
   * @param {string} [options.keyFilename] - Path to service account JSON key
   */
  constructor(options = {}) {
    super();
    this.keyFilename = options.keyFilename;
    const clientConfig = {};
    if (this.keyFilename) {
      clientConfig.keyFilename = this.keyFilename;
    }
    this.client = new textToSpeech.TextToSpeechClient(clientConfig);
  }

  async synthesize(text, language = 'ta') {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return Buffer.alloc(1600, 0).toString('base64');
    }

    let languageCode = 'ta-IN';
    let voiceName = 'ta-IN-Standard-A';

    if (language === 'en') {
      languageCode = 'en-IN';
      voiceName = 'en-IN-Standard-A';
    } else if (language === 'tanglish' || language === 'ta') {
      languageCode = 'ta-IN';
      voiceName = 'ta-IN-Standard-A';
    }

    const request = {
      input: { text: text },
      voice: {
        languageCode,
        name: voiceName,
      },
      audioConfig: {
        audioEncoding: 'LINEAR16',
        sampleRateHertz: 8000, // Matches Exotel PCM standard
      },
    };

    const [response] = await this.client.synthesizeSpeech(request);

    if (!response.audioContent || response.audioContent.length === 0) {
      throw new Error('Google TTS returned empty audio content');
    }

    // Google Cloud TTS LINEAR16 output includes a standard 44-byte WAV header.
    // Exotel AgentStream requires pure raw PCM (slin 16-bit 8000Hz).
    // Therefore, strip the first 44 bytes if present.
    let rawPcm = response.audioContent;
    if (rawPcm.length > 44 && rawPcm.toString('ascii', 0, 4) === 'RIFF') {
      rawPcm = rawPcm.subarray(44);
    }

    return rawPcm.toString('base64');
  }

  getStatus() {
    return { name: 'google', ready: true, mode: 'google', keyFilename: this.keyFilename ? 'provided' : 'default_credentials' };
  }
}

module.exports = GoogleTextToSpeechProvider;
