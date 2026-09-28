require('dotenv').config();
const { synthesizeSpeech, getTTSStatus } = require('../ai/ttsService');

console.log('====================================================');
console.log('🌾 AgriVoice TTS Provider Test');
console.log('====================================================');

const status = getTTSStatus();
console.log(`TTS Provider Mode: ${status.mode.toUpperCase()}`);

(async () => {
  try {
    // 1. Synthesize Tamil/Tanglish
    console.log('\n1. Synthesizing Tamil greeting: "Vanakkam, AgriVoice-ku varaverkirOm"...');
    const tamilAudioBase64 = await synthesizeSpeech('Vanakkam, AgriVoice-ku varaverkirOm', 'ta');
    console.log(`   - Output Type: Base64 string`);
    console.log(`   - Base64 Length: ${tamilAudioBase64.length} chars`);
    const tamilBuffer = Buffer.from(tamilAudioBase64, 'base64');
    console.log(`   - Decoded PCM Byte Length: ${tamilBuffer.length} bytes`);

    // 2. Synthesize English
    console.log('\n2. Synthesizing English greeting: "Welcome to AgriBazaar marketplace."...');
    const englishAudioBase64 = await synthesizeSpeech('Welcome to AgriBazaar marketplace.', 'en');
    console.log(`   - Output Type: Base64 string`);
    console.log(`   - Base64 Length: ${englishAudioBase64.length} chars`);
    const englishBuffer = Buffer.from(englishAudioBase64, 'base64');
    console.log(`   - Decoded PCM Byte Length: ${englishBuffer.length} bytes`);

    console.log('\n====================================================');
    console.log('✅ TTS Test PASSED successfully.');
    console.log('====================================================');
  } catch (error) {
    console.error('❌ TTS Test Failed:', error);
    process.exit(1);
  }
})();
