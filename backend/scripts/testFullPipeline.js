require('dotenv').config();
const { getOrCreateSession, attachAudioCallback, processAudioPacket, stopSession } = require('../services/voiceSessionManager');
const { synthesizeSpeech } = require('../ai/ttsService');
const { getSTTStatus } = require('../ai/speechService');

console.log('====================================================');
console.log('🌾 AgriVoice End-to-End Pipeline Test');
console.log('====================================================\n');

const testSessionId = `pipeline-test-${Date.now()}`;

let greetingReceived = false;
let responseAudioReceived = false;

// 1. Initialize session
const session = getOrCreateSession(testSessionId, {
  provider: 'TEST_SUITE',
  callerPhone: '+919513886363',
  callSid: 'call_pipeline_001'
});

// 2. Attach Outbound Audio Callback
attachAudioCallback(testSessionId, async (audioBase64) => {
  if (!greetingReceived) {
    greetingReceived = true;
    console.log(`✅ [1/3] Assistant initial greeting audio received!`);
    console.log(`   - Audio base64 length: ${audioBase64.length} chars`);

    // Prepare speech audio for caller
    console.log('\n[2/3] Simulating caller speech audio packets...');
    let audioBuffer;
    const sttStatus = getSTTStatus();

    if (sttStatus.mode === 'google') {
      const speechBase64 = await synthesizeSpeech('Tomato 200 kilo Tiruppur', 'en');
      audioBuffer = Buffer.from(speechBase64, 'base64');
    } else {
      audioBuffer = Buffer.alloc(8000, 0);
    }

    // Stream audio in 1600-byte packets (100ms each)
    const chunkSize = 1600;
    for (let offset = 0; offset < audioBuffer.length; offset += chunkSize) {
      const chunk = audioBuffer.subarray(offset, Math.min(offset + chunkSize, audioBuffer.length));
      processAudioPacket(testSessionId, chunk);
    }

    // Allow stream to process
    setTimeout(() => {
      if (session.sttStream && !session.sttStream.writableEnded) {
        session.sttStream.end();
      }
    }, 1200);

  } else {
    responseAudioReceived = true;
    console.log(`✅ [3/3] Assistant response audio received!`);
    console.log(`   - Response audio base64 length: ${audioBase64.length} chars`);
    console.log('\n====================================================');
    console.log('✅ Full Pipeline Test PASSED successfully!');
    console.log('====================================================');
    stopSession(testSessionId);
    clearTimeout(safetyTimeout);
  }
});

// Timeout safety (allow up to 45s for full real-cloud STT + LLM + TTS network roundtrip)
const safetyTimeout = setTimeout(() => {
  if (!responseAudioReceived) {
    console.error('❌ Pipeline test timed out waiting for audio responses.');
    stopSession(testSessionId);
    process.exit(1);
  }
}, 45000);
