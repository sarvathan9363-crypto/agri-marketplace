const { analyzeConversation } = require('../ai/llmService');

// In-memory conversation state for AgriVoice sessions
const activeConversations = new Map();

// Required fields as per Product.js schema
const REQUIRED_PRODUCT_FIELDS = [
  'productName',
  'category',
  'quantity',
  'unit',
  'pricePerUnit',
  'location'
];

/**
 * Initializes a new conversation session state.
 */
function createNewSession(sessionId) {
  const session = {
    sessionId,
    language: 'unknown',
    stage: 'COLLECTING', // COLLECTING, CONFIRMING, DONE
    product: {
      productName: null,
      category: null,
      quantity: null,
      unit: null,
      pricePerUnit: null,
      location: null
    },
    missingFields: [...REQUIRED_PRODUCT_FIELDS],
    confirmed: false,
    startedAt: new Date(),
    lastActivity: new Date()
  };
  activeConversations.set(sessionId, session);
  return session;
}

// Cleanup inactive sessions every 5 minutes
setInterval(() => {
  const now = new Date();
  for (const [sessionId, session] of activeConversations.entries()) {
    // 30 minutes in milliseconds = 30 * 60 * 1000 = 1800000
    if (now - session.lastActivity > 1800000) {
      console.log(`[AgriVoice] Cleaning up inactive session: ${sessionId}`);
      activeConversations.delete(sessionId);
    }
  }
}, 5 * 60 * 1000).unref();

/**
 * Processes a user's text message through the AI pipeline, 
 * merges extracted data into state, and determines the next step.
 * 
 * @param {string} sessionId - Unique ID for the conversation
 * @param {string} message - User's input text (Tamil/Tanglish/English)
 * @returns {Promise<Object>} The updated state, intent, and AI's reply
 */
async function processUserMessage(sessionId, message) {
  // 1. Retrieve or create session
  let session = activeConversations.get(sessionId);
  if (!session) {
    session = createNewSession(sessionId);
  }

  try {
    // Update last activity
    session.lastActivity = new Date();

    // 2. Ask LLM to analyze message against current state
    const aiResult = await analyzeConversation(message, session);
    
    if (aiResult.intent === 'CANCEL') {
      activeConversations.delete(sessionId);
      return {
        success: true,
        sessionId,
        reply: aiResult.reply || 'Okay, this listing has been cancelled. Let me know if you need anything else.',
        state: null,
        intent: 'CANCEL',
        readyForConfirmation: false
      };
    }

    // 3. Update session language if detected
    if (aiResult.detectedLanguage && session.language === 'unknown') {
      session.language = aiResult.detectedLanguage;
    }

    // 4. Merge newly extracted fields into session product state
    if (aiResult.extractedFields) {
      for (const field of REQUIRED_PRODUCT_FIELDS) {
        if (aiResult.extractedFields[field] !== undefined && aiResult.extractedFields[field] !== null) {
          session.product[field] = aiResult.extractedFields[field];
        }
      }
    }

    // 5. Recalculate missing fields
    session.missingFields = REQUIRED_PRODUCT_FIELDS.filter(
      field => session.product[field] === null || session.product[field] === undefined
    );

    // 6. Handle Intent and Stage transitions
    
    // Application strictly controls confirmation
    if (aiResult.intent === 'CONFIRM' && session.missingFields.length === 0 && session.stage === 'CONFIRMING') {
      session.stage = 'DONE';
      session.confirmed = true;
    } else {
      // If no missing fields but not explicitly confirmed yet, we are in CONFIRMING stage
      if (session.missingFields.length === 0) {
        session.stage = 'CONFIRMING';
      } else {
        session.stage = 'COLLECTING';
      }
    }

    // Save updated session
    activeConversations.set(sessionId, session);

    // 7. Return structured response suitable for the frontend or telephony layer
    return {
      success: true,
      sessionId,
      reply: aiResult.reply,
      state: session,
      intent: aiResult.intent,
      readyForConfirmation: session.missingFields.length === 0
    };

  } catch (error) {
    console.error(`[AgriVoice Service Error] Failed to process message for session ${sessionId}:`, error);
    return {
      success: false,
      sessionId,
      reply: "I'm sorry, I'm having trouble processing that right now. Could you repeat?",
      error: error.message
    };
  }
}

/**
 * Clean up session (e.g. when call drops)
 */
function endSession(sessionId) {
  activeConversations.delete(sessionId);
}

module.exports = {
  processUserMessage,
  endSession,
  activeConversations
};
