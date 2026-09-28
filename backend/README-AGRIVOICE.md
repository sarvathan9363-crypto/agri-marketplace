# 🌾 AgriVoice: Conversational AI Voice Assistant for AgriBazaar

AgriVoice enables Indian farmers to list agricultural produce directly onto the AgriBazaar marketplace over a standard phone call using Tamil, English, or mixed (Tanglish) speech.

---

## 1. System Architecture

```text
Farmer Phone (+91...)
      ↓
Exotel Indian Virtual Number
      ↓
Exotel AgentStream (Bidirectional WebSocket)
      ↓ (LINEAR16 PCM, 8000 Hz, mono)
Exotel WebSocket Adapter (backend/telephony/exotel/exotelWebSocket.js)
      ↓ (Decoded raw PCM buffers)
Voice Session Manager (backend/services/voiceSessionManager.js)
      ↓ (Streaming PCM audio)
Google Cloud Speech-to-Text (Streaming STT: ta-IN + en-IN)
      ↓ (Final validated text transcript)
Conversational AI Core (backend/services/conversationService.js)
      ↓ (Prompt + Current state + Schema)
Gemini LLM (Gemini 3.5 Flash Lite with automatic model fallback)
      ↓ (Strict JSON Structured Output: intent, extractedFields, reply)
Server-Side Product Enum & Numeric Validation
      ↓ (Natural conversational response)
Google Cloud Text-to-Speech (ta-IN / en-IN, LINEAR16 8000Hz, stripped WAV header)
      ↓ (Base64 raw PCM audio payload)
Exotel Outbound AgentStream Message
      ↓
Farmer hears assistant response in real-time

[After Explicit Farmer Confirmation ONLY]
      ↓
Product Service Boundary (backend/services/agriVoiceProductService.js)
      ↓ (VOICE_PRODUCT_CREATION_ENABLED check + Authenticated Farmer mapping)
MongoDB Product Model (Persisted to AgriBazaar Marketplace)
```

---

## 2. Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Backend HTTP & WebSocket server port | `8080` |
| `PUBLIC_BASE_URL` | Public HTTPS URL (e.g. from ngrok) | `https://xxxx.ngrok-free.app` |
| `AGRIVOICE_WS_URL` | Full public WebSocket URL for Exotel AgentStream | `wss://xxxx.ngrok-free.app/api/exotel/stream` |
| `GEMINI_API_KEY` | Google Gemini API Key | `your_gemini_api_key` |
| `GEMINI_MODEL` | Gemini Model (has auto-fallback to 3.5/3.1) | `gemini-3.5-flash-lite` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Google Service Account JSON | `./secrets/google-cloud-key.json` |
| `VOICE_STT_PROVIDER` | STT provider mode (`google` or `mock`) | `google` |
| `VOICE_TTS_PROVIDER` | TTS provider mode (`google` or `mock`) | `google` |
| `VOICE_PRODUCT_CREATION_ENABLED` | Safety switch for MongoDB writes | `false` (default) |
| `EXOTEL_API_KEY` | Exotel API Key | Provided by Exotel console |
| `EXOTEL_API_TOKEN` | Exotel API Token | Provided by Exotel console |
| `EXOTEL_ACCOUNT_SID` | Exotel Account SID | Provided by Exotel console |
| `EXOTEL_PHONE_NUMBER` | Your Indian virtual ExoPhone number | `+919513886363` |

---

## 3. Google Cloud Setup & Required APIs

To connect real Google Cloud STT and TTS:

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your Google Cloud project.
3. Enable the two required APIs:
   - **Cloud Speech-to-Text API** (`speech.googleapis.com`)
   - **Cloud Text-to-Speech API** (`texttospeech.googleapis.com`)

---

## 4. Least-Privilege IAM Roles

Follow Google Cloud security best practices. **Do NOT assign Owner or Editor roles.**

Create a dedicated Service Account (e.g., `agrivoice-agent@<project-id>.iam.gserviceaccount.com`) and grant only the least-privilege client roles:

- **Cloud Speech Client** (`roles/speech.client`) — Allows streaming audio recognition.
- **Cloud Text-to-Speech User** (`roles/texttospeech.user`) — Allows audio synthesis.

---

## 5. Service-Account JSON Key Placement

1. In the Google Cloud Console, navigate to:
   **IAM & Admin** → **Service Accounts** → select your `agrivoice-agent` account.
2. Under the **Keys** tab, click **Add Key** → **Create new key** → choose **JSON**.
3. Download the JSON file to your computer.
4. Place the downloaded JSON file into the backend's gitignored secrets directory:
   ```text
   backend/secrets/google-cloud-key.json
   ```
5. Ensure your `backend/.env` contains:
   ```properties
   GOOGLE_APPLICATION_CREDENTIALS=./secrets/google-cloud-key.json
   ```
   *(The path is automatically resolved safely across Windows and Linux).*

---

## 6. Mock Mode & Graceful Fallback

If `GOOGLE_APPLICATION_CREDENTIALS` is missing, points to a nonexistent file, or `VOICE_STT_PROVIDER=mock`:
- The backend starts without crashing.
- STT runs with `MockSpeechToTextProvider`.
- TTS runs with `MockTextToSpeechProvider` (generating valid silent PCM buffers so WebSocket clients never crash).
- Clear startup diagnostics notify you that mock mode is active.

---

## 7. Local Testing Suite

All tests can be executed locally without live phone calls or external telephony expenses:

```bash
# Test 1: Configuration & credential path detection
npm run test:voice:config

# Test 2: Speech-to-Text adapter (Google if key present, else mock)
npm run test:voice:stt

# Test 3: Text-to-Speech synthesis (Tamil and English LINEAR16 PCM)
npm run test:voice:tts

# Test 4: Comprehensive conversation scenarios (Tamil, English, Tanglish, Edit, Cancel, Confirm)
npm run test:voice:conversation

# Test 5: End-to-end audio pipeline (Audio -> STT -> Gemini -> TTS -> Outbound audio)
npm run test:voice:pipeline

# Test 6: Exotel AgentStream WebSocket protocol verification
npm run test:voice:exotel

# Run all automated tests sequentially:
npm run test:voice:all
```

---

## 8. Exotel AgentStream Telephony Setup

1. Log into your [Exotel Dashboard](https://my.exotel.com/).
2. Navigate to **App Bazaar** → **Create App**.
3. Add a **Voicebot / Stream Applet**.
4. Configure the WebSocket Stream URL:
   ```text
   wss://<YOUR_NGROK_DOMAIN>/api/exotel/stream
   ```
5. Set Stream Parameters:
   - **Stream Type**: Bidirectional
   - **Audio Format**: PCM 16-bit, 8000 Hz (`slin` / `LINEAR16`)
6. Assign your virtual ExoPhone number (e.g. `+919513886363`) to this Voicebot App.

---

## 9. ngrok / Local Development

When testing locally with real incoming calls:

1. Start your local backend:
   ```bash
   cd backend
   npm run dev
   ```
2. Start ngrok tunnel on port 8080:
   ```bash
   ngrok http 8080
   ```
3. Copy the forwarding URL (e.g. `https://xxxx.ngrok-free.app`).
4. Update `PUBLIC_BASE_URL` in `backend/.env`.
5. Update your Exotel Voicebot Stream URL in the Exotel Dashboard to:
   ```text
   wss://xxxx.ngrok-free.app/api/exotel/stream
   ```

---

## 10. Live Call Flow & Conversation Lifecycle

1. **Farmer calls ExoPhone**: Exotel establishes a bidirectional WebSocket connection to `/api/exotel/stream`.
2. **Greeting**: The assistant greets the farmer:
   *"வணக்கம்! அக்ரிபஜார் உங்களை வரவேற்கிறது. நீங்கள் என்ன விளைபொருளை விற்பனை செய்ய விரும்புகிறீர்கள்?"*
3. **Information Collection**:
   - The farmer speaks naturally in Tamil, English, or Tanglish (e.g., *"Enkitta 200 kg tomato irukku, kilo 35 rupees"*).
   - Gemini extracts available fields and prompts for any missing fields (product, quantity, unit, price, location).
4. **Summary & Confirmation**:
   - The assistant summarizes: *"You want to sell 200 KG of Tomato at ₹35 per KG in Pollachi. Is that correct?"*
   - Farmer confirms: *"Yes"* / *"ஆமாம்"* / *"சரி"*.
5. **Product Creation**:
   - When `VOICE_PRODUCT_CREATION_ENABLED=true`, the verified listing is saved into MongoDB under the identified farmer profile.

---

## 11. Product Creation Safety Switch

To ensure test calls never corrupt your production marketplace:
- **Default**: `VOICE_PRODUCT_CREATION_ENABLED=false`
  In this mode, complete listings pass full server-side validation and confirmation, but are logged as dry-run simulations.
- **Production**: Set `VOICE_PRODUCT_CREATION_ENABLED=true` in `backend/.env` only when you are ready to allow verified phone listings into MongoDB.

---

## 12. Caller ID & Farmer Authentication

When an Exotel call connects, the caller's phone number is extracted from `req.url` query parameters or metadata (`start.from`).
- `normalizePhoneNumber()` converts the phone number into standard 10-digit format.
- `authenticateFarmerByPhone()` looks up registered farmers in MongoDB (`Farmer.findOne({ mobileNumber })`).
- If matched, the session is linked to their `farmerId`, `farmerUserId`, and `farmName`.
- If unmatched, the caller is treated as an unauthenticated guest, and the listing is stored as a draft.

---

## 13. Health & Diagnostic Endpoint

Verify system health without exposing any secrets:

```bash
curl http://localhost:8080/api/voice/health
```

Example response:
```json
{
  "success": true,
  "voice": "configured",
  "stt": "mock",
  "tts": "mock",
  "gemini": "configured",
  "exotel": "configured",
  "productCreationEnabled": false,
  "timestamp": "2026-09-28T10:30:00.000Z"
}
```

---

## 14. Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `STT running in Mock mode` | `google-cloud-key.json` not placed in `backend/secrets/` | Download service account JSON key to `backend/secrets/google-cloud-key.json`. |
| `Gemini model 503 high demand` | Google GenAI spike in demand | AgriVoice automatically cascades through `gemini-3.5-flash-lite`, `gemini-3.5-flash`, and `gemini-3.1-flash-lite`. |
| `No sound heard on Exotel call` | Header mismatch in PCM audio | AgriVoice automatically strips the 44-byte WAV container header from Google TTS output to provide pure raw LINEAR16 PCM. |
| `Product not saved in MongoDB` | Safety switch is active | Check `VOICE_PRODUCT_CREATION_ENABLED` in `.env`. Must be set to `true` to persist listings. |
