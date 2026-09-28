require('dotenv').config();
const { createSpeechStream, getSTTStatus } = require('../ai/speechService');
const { synthesizeSpeech } = require('../ai/ttsService');

console.log('====================================================');
console.log('🌾 AgriVoice STT Provider Test');
console.log('====================================================');

const status = getSTTStatus();
console.log(`STT Provider Mode: ${status.mode.toUpperCase()}`);

(async () => {
  let audioBuffer;

  if (status.mode === 'google') {
    console.log('Synthesizing speech sample to test Google STT recognition...');
    const base64Audio = await synthesizeSpeech('Tomato 200 kilo', 'en');
    audioBuffer = Buffer.from(base64Audio, 'base64');
  } else {
    // 500ms of dummy PCM for mock provider
    audioBuffer = Buffer.alloc(8000, 0);
  }

  let transcriptReceived = false;

  const stream = createSpeechStream(
    (finalTranscript) => {
      transcriptReceived = true;
      console.log(`\n✅ STT Final Transcript Received: "${finalTranscript}"`);
      console.log('====================================================');
      console.log('✅ STT Test PASSED successfully.');
      console.log('====================================================');
      process.exit(0);
    },
    (interim) => {
      console.log(`STT Interim: "${interim}"`);
    },
    (error) => {
      console.error('STT Error:', error.message);
    }
  );

  // Stream in 1600-byte packets (100ms each at 8000Hz LINEAR16) with interval
  const chunkSize = 1600;
  let offset = 0;

  const interval = setInterval(() => {
    if (offset < audioBuffer.length) {
      const chunk = audioBuffer.subarray(offset, Math.min(offset + chunkSize, audioBuffer.length));
      stream.write(chunk);
      offset += chunkSize;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        if (!stream.writableEnded) {
          stream.end();
        }
      }, 1500);
    }
  }, 60);

  // Safety timeout
  setTimeout(() => {
    if (!transcriptReceived) {
      console.error('❌ STT Test timed out waiting for transcript.');
      process.exit(1);
    }
  }, 25000);
})();
