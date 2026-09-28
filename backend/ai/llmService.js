const { GoogleGenAI } = require('@google/genai');
const { SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } = require('./prompts/agrivoicePrompt');

const VALID_CATEGORIES = ['FRUITS', 'VEGETABLES', 'GRAINS', 'PULSES', 'SPICES', 'MILLETS', 'DAIRY', 'OTHER'];
const VALID_UNITS = ['KG', 'QUINTAL', 'TON', 'LITRE', 'PIECE'];
const VALID_INTENTS = ['PROVIDE_INFORMATION', 'CONFIRM', 'REJECT', 'EDIT', 'CANCEL', 'UNKNOWN'];

/**
 * Validates the parsed AI output structurally before returning it.
 * This ensures we don't blindly trust the LLM.
 */
function validateAIOutput(output) {
  if (!output || typeof output !== 'object') {
    throw new Error('AI output is not a valid object');
  }

  if (!VALID_INTENTS.includes(output.intent)) {
    output.intent = 'UNKNOWN';
  }

  if (!output.extractedFields) {
    output.extractedFields = {};
  }
  
  // Strict numeric validation for quantity
  if (output.extractedFields.quantity !== null && output.extractedFields.quantity !== undefined) {
    const q = output.extractedFields.quantity;
    if (typeof q !== 'number' || !Number.isFinite(q) || q <= 0) {
      output.extractedFields.quantity = null;
    }
  }
  
  // Strict numeric validation for pricePerUnit
  if (output.extractedFields.pricePerUnit !== null && output.extractedFields.pricePerUnit !== undefined) {
    const p = output.extractedFields.pricePerUnit;
    if (typeof p !== 'number' || !Number.isFinite(p) || p <= 0) {
      output.extractedFields.pricePerUnit = null;
    }
  }

  // Strict enum validation for category
  if (output.extractedFields.category && !VALID_CATEGORIES.includes(output.extractedFields.category)) {
    output.extractedFields.category = null;
  }

  // Strict enum validation for unit
  if (output.extractedFields.unit && !VALID_UNITS.includes(output.extractedFields.unit)) {
    output.extractedFields.unit = null;
  }

  if (!output.reply || typeof output.reply !== 'string') {
    output.reply = 'I am sorry, I did not understand that.';
  }

  return output;
}

/**
 * Calls Gemini to analyze the conversation and extract structured data.
 * @param {string} userMessage - The latest message from the user.
 * @param {Object} currentState - The current conversation state object.
 * @returns {Promise<Object>} The structured output containing intent, extractedFields, and reply.
 */
async function analyzeConversation(userMessage, currentState) {
  if (!process.env.GEMINI_API_KEY) {
    console.error('[AgriVoice Error] GEMINI_API_KEY is missing from environment variables.');
    throw new Error('AI configuration missing');
  }

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const candidateModels = [
    primaryModel,
    'gemini-3.6-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-pro-preview'
  ];
  // Remove duplicates while keeping order
  const modelChain = [...new Set(candidateModels)];

  let lastError = null;

  for (const modelName of modelChain) {
    try {
      const ai = new GoogleGenAI({}); // Automatically picks up GEMINI_API_KEY from process.env

      // Construct the context for the LLM
      const prompt = `
CURRENT STATE:
${JSON.stringify(currentState, null, 2)}

USER MESSAGE:
"${userMessage}"
`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.2, // Low temperature for more deterministic extraction
        }
      });

      const resultText = response.text;
      const resultObj = JSON.parse(resultText);

      // Server-side validation of the LLM output
      return validateAIOutput(resultObj);

    } catch (error) {
      lastError = error;
      console.warn(`[AgriVoice Warning] Gemini model "${modelName}" failed: ${error.message}. Attempting fallback if available...`);
      // Brief pause to allow momentary high-demand spike to clear
      await new Promise(r => setTimeout(r, 800));
    }
  }

  console.error('[AgriVoice Error] All candidate models failed:', lastError?.message);
  throw new Error('AI service unavailable');
}

module.exports = {
  analyzeConversation
};
