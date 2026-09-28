const { Writable } = require('stream');
const SpeechToTextProvider = require('./SpeechToTextProvider');

class MockSpeechToTextProvider extends SpeechToTextProvider {
  constructor(options = {}) {
    super();
    this.defaultTranscript = options.defaultTranscript || 'Mock transcript: Enkitta 500 kilo tomato irukku. Tiruppur.';
  }

  createStream({ onTranscript, onInterimTranscript, onError }) {
    const transcriptToEmit = this.defaultTranscript;
    let bytesReceived = 0;

    const stream = new Writable({
      write(chunk, encoding, callback) {
        bytesReceived += chunk.length;
        if (onInterimTranscript && bytesReceived > 1600 && bytesReceived < 3200) {
          onInterimTranscript('Enkitta 500 kilo...');
        }
        callback();
      },
      final(callback) {
        if (onTranscript) {
          onTranscript(transcriptToEmit);
        }
        callback();
      }
    });

    return stream;
  }

  getStatus() {
    return { name: 'mock', ready: true, mode: 'mock' };
  }
}

module.exports = MockSpeechToTextProvider;
