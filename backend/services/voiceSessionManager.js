const { createSpeechStream } = require('../ai/speechService');
const { synthesizeSpeech } = require('../ai/ttsService');
const { processUserMessage, endSession: endConversationSession } = require('./conversationService');
const { authenticateFarmerByPhone } = require('./farmerAuthService');
const { createProductFromAgriVoice } = require('./agriVoiceProductService');

// In-memory store for active telephony voice sessions
const activeSessions = new Map();

const GREETING_TEXT = "வணக்கம்! அக்ரிபஜார் உங்களை வரவேற்கிறது. நீங்கள் என்ன விளைபொருளை விற்பனை செய்ய விரும்புகிறீர்கள்?";
let cachedGreetingAudioBase64 = null;

// Pre-synthesize welcome greeting on startup so callers hear it instantaneously
synthesizeSpeech(GREETING_TEXT, 'ta')
  .then((audio) => {
    cachedGreetingAudioBase64 = audio;
    console.log('[AgriVoice] Welcome greeting audio pre-cached for instant playback.');
  })
  .catch((err) => {
    console.warn('[AgriVoice] Failed to pre-cache greeting audio:', err.message);
  });

// 30 minute TTL in milliseconds
const SESSION_TTL_MS = 30 * 60 * 1000;

// Periodic cleanup of stale sessions
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastActivity > SESSION_TTL_MS) {
      console.log(`[AgriVoice] Cleaning up stale session: ${sessionId}`);
      stopSession(sessionId);
    }
  }
}, 5 * 60 * 1000).unref();

/**
 * Creates or retrieves a voice session.
 * 
 * @param {string} sessionId - StreamSid or unique session identifier
 * @param {Object} metadata - Optional call metadata (callerPhone, callSid, provider)
 * @returns {Object} The voice session object
 */
function getOrCreateSession(sessionId, metadata = {}) {
  if (!activeSessions.has(sessionId)) {
    const session = {
      sessionId,
      startedAt: Date.now(),
      lastActivity: Date.now(),
      mediaPacketCount: 0,
      status: 'ACTIVE',
      callerPhone: metadata.callerPhone || null,
      callSid: metadata.callSid || null,
      provider: metadata.provider || 'EXOTEL',
      farmerInfo: null,
      sendAudioCallback: null,
      sttStream: null,
      isGreetingPlayed: false
    };

    activeSessions.set(sessionId, session);

    // Initialize Phone-based Farmer Authentication asynchronously
    if (session.callerPhone) {
      authenticateFarmerByPhone(session.callerPhone)
        .then((authResult) => {
          if (authResult.authenticated) {
            session.farmerInfo = authResult.farmer;
            console.log(`[AgriVoice] Identified caller: ${authResult.farmer.farmerName} (${authResult.farmer.mobileNumber})`);
          } else {
            console.log(`[AgriVoice] Caller unauthenticated (${authResult.reason})`);
          }
        })
        .catch((err) => {
          console.warn('[AgriVoice] Farmer auth lookup error:', err.message);
        });
    }

    // Initialize STT Stream
    initializeSTTStream(session);
  }

  const session = activeSessions.get(sessionId);
  session.lastActivity = Date.now();
  return session;
}

/**
 * Initializes or re-initializes the STT stream for a session.
 */
function initializeSTTStream(session) {
  try {
    session.sttStream = createSpeechStream(
      // onFinalTranscript
      async (transcript) => {
        await handleFinalTranscript(session, transcript);
      },
      // onInterimTranscript (optional UX logging)
      (interim) => {
        // Only log length/preview to avoid console flooding
        // console.log(`[AgriVoice][STT Interim] "${interim}"`);
      },
      // onError
      (error) => {
        console.warn(`[AgriVoice][STT Stream Error] Session ${session.sessionId}: ${error.message}`);
      }
    );
  } catch (err) {
    console.error(`[AgriVoice][STT Error] Failed to create speech stream for session ${session.sessionId}:`, err.message);
  }
}

/**
 * Handles a completed speech transcript from STT through Gemini and TTS.
 */
async function handleFinalTranscript(session, transcript) {
  if (!transcript || transcript.trim().length === 0) return;

  session.lastActivity = Date.now();
  console.log(`[AgriVoice] Session ${session.sessionId} Transcript: "${transcript}"`);

  try {
    // 1. Send utterance to Conversational AI Core
    const aiResult = await processUserMessage(session.sessionId, transcript);
    console.log(`[AgriVoice] Session ${session.sessionId} Intent: ${aiResult.intent} | Reply: "${aiResult.reply}"`);

    // 2. If the user explicitly confirmed a complete listing, trigger the Product Service boundary
    if (aiResult.state && aiResult.state.confirmed && aiResult.state.product) {
      try {
        const creationResult = await createProductFromAgriVoice({
          productData: aiResult.state.product,
          farmerInfo: session.farmerInfo,
          confirmed: true
        });

        if (creationResult.created) {
          console.log(`[AgriVoice] Product listing committed to database: ID ${creationResult.product._id}`);
        } else if (creationResult.simulated) {
          console.log(`[AgriVoice] Safety check: Product creation simulated (not persisted): ${creationResult.message}`);
        }
      } catch (prodErr) {
        console.error('[AgriVoice] Product creation boundary error:', prodErr.message);
      }
    }

    // 3. Synthesize assistant response via TTS
    if (aiResult.reply && session.sendAudioCallback) {
      const language = aiResult.state?.language || 'ta';
      const audioBase64 = await synthesizeSpeech(aiResult.reply, language);

      if (audioBase64 && session.status === 'ACTIVE') {
        session.sendAudioCallback(audioBase64);
      }
    }

  } catch (error) {
    console.error(`[AgriVoice] Pipeline error for session ${session.sessionId}:`, error.message);
    
    // Provide a friendly error audio response
    if (session.sendAudioCallback && session.status === 'ACTIVE') {
      try {
        const fallbackMsg = "மன்னிக்கவும், ஒரு சிறிய தொழில்நுட்ப கோளாறு ஏற்பட்டுள்ளது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் அழைக்கவும்.";
        const fallbackAudio = await synthesizeSpeech(fallbackMsg, 'ta');
        session.sendAudioCallback(fallbackAudio);
      } catch {
        // Ignore secondary fallback errors
      }
    }
  }
}

/**
 * Attaches the WebSocket send callback and plays an initial greeting if not yet played.
 */
function attachAudioCallback(sessionId, callback) {
  const session = activeSessions.get(sessionId);
  if (!session) return;

  session.sendAudioCallback = callback;

  // Send initial welcome greeting immediately without network latency
  if (!session.isGreetingPlayed) {
    session.isGreetingPlayed = true;

    if (cachedGreetingAudioBase64 && session.status === 'ACTIVE') {
      console.log(`[AgriVoice] Playing instant pre-cached greeting for session: ${sessionId}`);
      session.sendAudioCallback(cachedGreetingAudioBase64);
    } else {
      synthesizeSpeech(GREETING_TEXT, 'ta')
        .then((audioBase64) => {
          cachedGreetingAudioBase64 = audioBase64;
          if (session.status === 'ACTIVE' && session.sendAudioCallback) {
            console.log(`[AgriVoice] Playing initial greeting for session: ${sessionId}`);
            session.sendAudioCallback(audioBase64);
          }
        })
        .catch((err) => {
          console.warn('[AgriVoice] Failed to synthesize initial greeting:', err.message);
        });
    }
  }
}

/**
 * Processes an incoming raw PCM audio packet from the Exotel adapter.
 */
function processAudioPacket(sessionId, audioBuffer) {
  const session = activeSessions.get(sessionId);
  if (!session || session.status !== 'ACTIVE') return;

  session.mediaPacketCount += 1;
  session.lastActivity = Date.now();

  // Pipe raw PCM buffer into the active STT Stream
  if (session.sttStream && !session.sttStream.writableEnded) {
    try {
      session.sttStream.write(audioBuffer);
    } catch (err) {
      console.warn(`[AgriVoice] Error writing to STT stream: ${err.message}`);
    }
  }
}

/**
 * Gracefully terminates and cleans up a voice session.
 */
function stopSession(sessionId) {
  if (activeSessions.has(sessionId)) {
    const session = activeSessions.get(sessionId);
    session.status = 'STOPPED';

    if (session.sttStream && !session.sttStream.writableEnded) {
      try {
        session.sttStream.end();
      } catch {}
    }

    // Clean up conversation state
    endConversationSession(sessionId);

    // Remove from in-memory session map
    activeSessions.delete(sessionId);
    console.log(`[AgriVoice] Session stopped and cleaned up: ${sessionId}`);
  }
}

module.exports = {
  activeSessions,
  getOrCreateSession,
  attachAudioCallback,
  processAudioPacket,
  stopSession,
  handleFinalTranscript
};
