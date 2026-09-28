const speech = require('@google-cloud/speech');
const SpeechToTextProvider = require('./SpeechToTextProvider');

class GoogleSpeechToTextProvider extends SpeechToTextProvider {
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
    this.client = new speech.SpeechClient(clientConfig);
  }

  createStream({ onTranscript, onInterimTranscript, onError }) {
    const request = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 8000,
        languageCode: 'ta-IN', // Primary language
        alternativeLanguageCodes: ['en-IN'], // Secondary language for Tamil-English mixed speech
        enableAutomaticPunctuation: true,
      },
      interimResults: Boolean(onInterimTranscript),
    };

    let recognizeStream = null;

    try {
      recognizeStream = this.client.streamingRecognize(request);
    } catch (err) {
      console.error('[AgriVoice][STT] Failed to create Google Speech stream:', err.message);
      if (onError) onError(err);
      throw err;
    }

    recognizeStream.on('error', (error) => {
      console.error('[AgriVoice][STT] Google Speech stream error:', error.message);
      if (onError) {
        onError(error);
      }
    });

    recognizeStream.on('data', (data) => {
      if (!data.results || data.results.length === 0) return;
      const result = data.results[0];
      if (!result.alternatives || result.alternatives.length === 0) return;

      const transcript = result.alternatives[0].transcript;
      if (!transcript || transcript.trim().length === 0) return;

      if (result.isFinal) {
        console.log(`[AgriVoice][STT] Final transcript: "${transcript.trim()}"`);
        if (onTranscript) {
          onTranscript(transcript.trim());
        }
      } else if (onInterimTranscript) {
        onInterimTranscript(transcript.trim());
      }
    });

    return recognizeStream;
  }

  getStatus() {
    return { name: 'google', ready: true, mode: 'google', keyFilename: this.keyFilename ? 'provided' : 'default_credentials' };
  }
}

module.exports = GoogleSpeechToTextProvider;
