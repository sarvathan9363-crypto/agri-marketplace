const WebSocket = require('ws');
const url = require('url');
const { getOrCreateSession, stopSession, processAudioPacket, attachAudioCallback } = require('../../services/voiceSessionManager');

/**
 * Initializes the WebSocket server for Exotel AgentStream.
 * Follows the verified Exotel AgentStream protocol.
 * 
 * @param {import('http').Server} server - The existing Express HTTP server
 */
function initExotelWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/api/exotel/stream' });

  wss.on('connection', (ws, req) => {
    // Parse any query parameters from connection URL (e.g. /api/exotel/stream?From=+919876543210&CallSid=...)
    let queryParams = {};
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      for (const [key, value] of parsedUrl.searchParams.entries()) {
        queryParams[key] = value;
      }
    } catch {}

    console.log('[AgriVoice][Exotel] New AgentStream WebSocket connection established.');

    let currentStreamSid = null;

    ws.on('message', (message) => {
      let data;
      try {
        data = JSON.parse(message);
      } catch (err) {
        console.error('[AgriVoice][Exotel] Received malformed JSON from WebSocket:', err.message);
        return;
      }

      switch (data.event) {
        case 'connected':
          console.log('[AgriVoice][Exotel] Handshake event received');
          break;

        case 'start': {
          currentStreamSid = data.stream_sid || data.streamSid || data.start?.stream_sid || data.start?.streamSid || 'default_stream';
          const startMeta = data.start || {};
          const callSid = startMeta.call_sid || startMeta.callSid || queryParams.CallSid || queryParams.call_sid;
          const callerPhone = startMeta.from || startMeta.From || queryParams.From || queryParams.from || null;

          console.log(`[AgriVoice][Exotel] Call session started`);
          console.log(`  StreamSid: ${currentStreamSid}`);
          if (callSid) console.log(`  CallSid: ${callSid}`);
          if (callerPhone) {
            const masked = callerPhone.length > 5 ? callerPhone.substring(0, 3) + '*'.repeat(callerPhone.length - 5) + callerPhone.slice(-2) : '***';
            console.log(`  Caller: ${masked}`);
          }

          // Initialize provider-independent session
          getOrCreateSession(currentStreamSid, {
            provider: 'EXOTEL',
            callSid,
            callerPhone
          });

          // Attach callback for transmitting assistant audio back to Exotel
          let outboundSeq = 1;
          attachAudioCallback(currentStreamSid, (audioBase64) => {
            if (ws.readyState !== WebSocket.OPEN) return;

            const pcmBuffer = Buffer.from(audioBase64, 'base64');
            const CHUNK_SIZE = 1600; // 100ms of 8000Hz 16-bit mono PCM

            const streamSid = currentStreamSid;

            // Clear any previous streaming interval on new playback
            if (ws.activeStreamInterval) {
              clearInterval(ws.activeStreamInterval);
              ws.activeStreamInterval = null;
            }

            if (pcmBuffer.length <= CHUNK_SIZE) {
              ws.send(JSON.stringify({
                event: 'media',
                stream_sid: streamSid,
                streamSid: streamSid,
                media: { payload: audioBase64 }
              }));
              return;
            }

            // Stream 100ms chunks at real-time 100ms cadence matching 8000Hz LINEAR16
            let offset = 0;
            ws.activeStreamInterval = setInterval(() => {
              if (ws.readyState !== WebSocket.OPEN || offset >= pcmBuffer.length) {
                clearInterval(ws.activeStreamInterval);
                ws.activeStreamInterval = null;
                return;
              }

              const chunk = pcmBuffer.subarray(offset, Math.min(offset + CHUNK_SIZE, pcmBuffer.length));
              ws.send(JSON.stringify({
                event: 'media',
                stream_sid: streamSid,
                streamSid: streamSid,
                media: {
                  payload: chunk.toString('base64')
                }
              }));
              offset += CHUNK_SIZE;
            }, 100);
          });
          break;
        }

        case 'media': {
          if (currentStreamSid && data.media && data.media.payload) {
            // Decode base64 PCM chunk (Exotel transmits LINEAR16 8000Hz mono)
            const audioBuffer = Buffer.from(data.media.payload, 'base64');
            processAudioPacket(currentStreamSid, audioBuffer);
          }
          break;
        }

        case 'clear': {
          // Exotel sends clear or client sends clear for barge-in
          console.log(`[AgriVoice][Exotel] Clear buffer event (Stream: ${currentStreamSid})`);
          if (ws.activeStreamInterval) {
            clearInterval(ws.activeStreamInterval);
            ws.activeStreamInterval = null;
          }
          break;
        }

        case 'stop': {
          console.log(`[AgriVoice][Exotel] Stream stop event received for: ${currentStreamSid}`);
          if (ws.activeStreamInterval) {
            clearInterval(ws.activeStreamInterval);
            ws.activeStreamInterval = null;
          }
          if (currentStreamSid) {
            stopSession(currentStreamSid);
            currentStreamSid = null;
          }
          break;
        }

        case 'mark':
        case 'dtmf':
          // Log control events without noisy payloads
          console.log(`[AgriVoice][Exotel] Control event: ${data.event}`);
          break;

        default:
          console.log(`[AgriVoice][Exotel] Unhandled event: ${data.event}`);
      }
    });

    ws.on('error', (err) => {
      console.error(`[AgriVoice][Exotel] WebSocket error (Stream: ${currentStreamSid}):`, err.message);
    });

    ws.on('close', () => {
      console.log(`[AgriVoice][Exotel] WebSocket closed (Stream: ${currentStreamSid || 'unknown'})`);
      if (currentStreamSid) {
        stopSession(currentStreamSid);
      }
    });
  });

  console.log('[AgriVoice] Exotel WebSocket server listening on /api/exotel/stream');
}

module.exports = {
  initExotelWebSocket
};
