require('dotenv').config();
const path = require('path');
const { resolveGoogleCredentials } = require('../ai/credentialsHelper');
const { getSTTStatus } = require('../ai/speechService');
const { getTTSStatus } = require('../ai/ttsService');

console.log('====================================================');
console.log('🌾 AgriVoice Configuration & Diagnostic Test');
console.log('====================================================\n');

// 1. Gemini Configuration
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
console.log('1. Gemini AI:');
console.log(`   - API Key Configured: ${hasGeminiKey ? 'YES (Key detected)' : 'NO (Missing GEMINI_API_KEY)'}`);
console.log(`   - Target Model: ${geminiModel}`);

// 2. Google Cloud Service Account
const credCheck = resolveGoogleCredentials();
console.log('\n2. Google Cloud Credentials:');
console.log(`   - Environment Var: ${process.env.GOOGLE_APPLICATION_CREDENTIALS || '(not set)'}`);
if (credCheck.hasCredentials) {
  console.log(`   - Credential File: FOUND at ${path.basename(credCheck.resolvedPath)}`);
} else {
  console.log(`   - Credential File: NOT FOUND (${credCheck.error})`);
  console.log('   - Notice: Voice system will run in MOCK mode until JSON key is placed.');
}

// 3. STT / TTS Providers
console.log('\n3. Voice Providers:');
console.log(`   - STT Provider: ${getSTTStatus().mode.toUpperCase()} (mode: ${getSTTStatus().name})`);
console.log(`   - TTS Provider: ${getTTSStatus().mode.toUpperCase()} (mode: ${getTTSStatus().name})`);

// 4. Exotel Telephony Configuration
const hasExotelKey = Boolean(process.env.EXOTEL_API_KEY);
const hasExotelToken = Boolean(process.env.EXOTEL_API_TOKEN);
const hasExotelSid = Boolean(process.env.EXOTEL_ACCOUNT_SID);
const exotelPhone = process.env.EXOTEL_PHONE_NUMBER;
console.log('\n4. Exotel Telephony:');
console.log(`   - API Key Configured: ${hasExotelKey ? 'YES' : 'NO'}`);
console.log(`   - API Token Configured: ${hasExotelToken ? 'YES' : 'NO'}`);
console.log(`   - Account SID Configured: ${hasExotelSid ? 'YES' : 'NO'}`);
console.log(`   - Virtual Phone Number: ${exotelPhone || 'NOT SET'}`);
console.log(`   - Public Base URL: ${process.env.PUBLIC_BASE_URL || 'NOT SET'}`);

// 5. Product Safety Switch
const isCreationEnabled = (process.env.VOICE_PRODUCT_CREATION_ENABLED || 'false').toLowerCase() === 'true';
console.log('\n5. Safety Switch:');
console.log(`   - VOICE_PRODUCT_CREATION_ENABLED: ${isCreationEnabled ? 'TRUE (Active DB persistence)' : 'FALSE (Safe Dry-Run Mode)'}`);

console.log('\n====================================================');
console.log('✅ Configuration test completed safely.');
console.log('====================================================');
