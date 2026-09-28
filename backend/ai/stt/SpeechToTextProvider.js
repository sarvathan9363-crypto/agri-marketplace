/**
 * Abstract / Base class for Speech-To-Text providers.
 * Ensures telephony and orchestration code remains completely provider-neutral.
 */
class SpeechToTextProvider {
  /**
   * Creates a writable audio stream that processes incoming PCM chunks.
   * @param {Object} options
   * @param {Function} options.onTranscript - Callback for final transcripts: (transcript: string) => void
   * @param {Function} [options.onInterimTranscript] - Callback for interim transcripts: (interim: string) => void
   * @param {Function} [options.onError] - Callback for stream errors: (error: Error) => void
   * @returns {import('stream').Writable}
   */
  createStream({ onTranscript, onInterimTranscript, onError }) {
    throw new Error('createStream() must be implemented by SpeechToTextProvider subclass');
  }

  /**
   * Reports provider health and configuration status.
   * @returns {Object}
   */
  getStatus() {
    return { name: 'SpeechToTextProvider', ready: false };
  }
}

module.exports = SpeechToTextProvider;
