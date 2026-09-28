# Exotel AgentStream Protocol Verification

Based on official documentation and testing, here are the precise details of the Exotel AgentStream protocol for real-time bidirectional streaming.

## 1. Connection & Lifecycle
When a call connects to an Exotel Voicebot/Stream Applet (or API call), Exotel establishes a WebSocket connection to the provided `wss://` URL (`/api/exotel/stream`).

The lifecycle consists of JSON messages sent over the WebSocket:
1. `connected` (Handshake)
2. `start` (Session Metadata)
3. `media` (Continuous bi-directional audio)
4. `stop` / `clear` / `mark` (Control events)

## 2. Event JSON Structures

### 2.1 The `start` Event
Sent by Exotel immediately after connection. Notice that Exotel uses snake_case (`stream_sid`, `call_sid`) whereas Twilio used camelCase (`streamSid`, `callSid`).
```json
{
  "event": "start",
  "sequence_number": 1,
  "stream_sid": "<stream_sid>",
  "start": {
    "account_sid": "<account_sid>",
    "call_sid": "<call_sid>",
    "tracks": ["inbound"]
  }
}
```

### 2.2 The `media` Event (Inbound - from Caller)
Contains the raw audio payload.
```json
{
  "event": "media",
  "sequence_number": 3,
  "stream_sid": "<stream_sid>",
  "media": {
    "chunk": 2,
    "timestamp": "10",
    "payload": "<base64_encoded_pcm_audio>"
  }
}
```

### 2.3 The `media` Event (Outbound - to Caller)
When our backend sends audio back to the caller, it must use the exact same format:
```json
{
  "event": "media",
  "stream_sid": "<stream_sid>",
  "media": {
    "payload": "<base64_encoded_pcm_audio>"
  }
}
```

### 2.4 Control Events
- **`clear`**: Sent by our backend to Exotel to flush the playback buffer (used for interruption/barge-in).
- **`stop`**: Sent by Exotel when the call hangs up.

## 3. Audio Format
This is a critical difference from Twilio (which defaults to µ-law):
- **Codec**: Raw PCM (Linear 16-bit / `LINEAR16`)
- **Endianness**: Little-endian (`slin`)
- **Sample Rate**: 8000 Hz (default)
- **Channels**: 1 (Mono)
- **Encoding in WebSocket**: `base64` encoded strings inside the JSON `"payload"` field.

When passing to Google STT or TTS, we specify:
- `encoding: 'LINEAR16'`
- `sampleRateHertz: 8000`

Google TTS LINEAR16 output contains a 44-byte WAV header which MUST be stripped before sending to Exotel so only raw PCM remains.

## 4. Required Exotel Webhook implementation
Unlike Twilio which requires returning an XML `<Response><Connect><Stream...></Stream></Connect></Response>` document on the inbound HTTP webhook, Exotel initiates the AgentStream dynamically through its App Bazaar (Voicebot Applet) or via a direct API Connect call.

Our backend does NOT need to serve XML/TwiML. If an Exotel HTTP webhook is used for call control (e.g., passthru), it returns HTTP 200 OK or specific JSON. For the AgentStream itself, the WebSocket URL accepts the connection.

## 5. Bidirectional Streaming Support
Exotel supports full bidirectional streaming (`streamtype=bidirectional`). Our backend sends JSON `media` events down the same WebSocket at any time to play audio to the caller.
