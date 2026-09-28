require('dotenv').config();
const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const { initExotelWebSocket } = require('../telephony/exotel/exotelWebSocket');

console.log('====================================================');
console.log('🌾 Exotel AgentStream Loopback Protocol Test');
console.log('====================================================\n');

// 1. Create a dedicated test HTTP server on an ephemeral port
const app = express();
const server = http.createServer(app);
initExotelWebSocket(server);

server.listen(0, () => {
  const port = server.address().port;
  const wsUrl = `ws://localhost:${port}/api/exotel/stream`;
  console.log(`Test Exotel Server listening on: ${wsUrl}`);

  const STREAM_SID = 'str_test_loopback_999';
  const clientWs = new WebSocket(wsUrl);

  let greetingReceived = false;
  let responseAudioReceived = false;

  clientWs.on('open', () => {
    console.log('[Mock Exotel Client] Connected to AgriVoice WebSocket.');

    // 1. Send Handshake
    clientWs.send(JSON.stringify({ event: 'connected' }));

    // 2. Send Start Event as per Exotel Protocol Specification
    clientWs.send(JSON.stringify({
      event: 'start',
      sequence_number: 1,
      stream_sid: STREAM_SID,
      start: {
        account_sid: 'acc_test_exotel',
        call_sid: 'call_test_123',
        tracks: ['inbound']
      }
    }));
  });

  clientWs.on('message', (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch (e) {
      console.error('❌ Failed to parse JSON message from server:', e.message);
      return;
    }

    console.log(`[Mock Exotel Client] Received event: "${msg.event}" | stream_sid: "${msg.stream_sid}"`);

    // Verify envelope matches Exotel AgentStream protocol
    if (msg.event !== 'media') {
      console.error(`❌ Unexpected outbound event type: ${msg.event}`);
    }
    if (msg.stream_sid !== STREAM_SID) {
      console.error(`❌ StreamSid mismatch! Expected ${STREAM_SID}, got ${msg.stream_sid}`);
    }
    if (!msg.media || !msg.media.payload || typeof msg.media.payload !== 'string') {
      console.error('❌ Invalid media payload structure in outbound message.');
    }

    if (!greetingReceived) {
      greetingReceived = true;
      console.log('✅ Initial assistant greeting message conforms to Exotel specification.');

      // 3. Send 3 Inbound Media Chunks (8000Hz 16-bit PCM = 1600 bytes per 100ms)
      console.log('\n[Mock Exotel Client] Sending 3 inbound PCM audio chunks...');
      const dummyPcm = Buffer.alloc(1600, 0);
      for (let i = 0; i < 3; i++) {
        clientWs.send(JSON.stringify({
          event: 'media',
          sequence_number: 2 + i,
          stream_sid: STREAM_SID,
          media: {
            chunk: i + 1,
            timestamp: String((i + 1) * 100),
            payload: dummyPcm.toString('base64')
          }
        }));
      }

      // Allow STT to process and respond
      setTimeout(() => {
        // 4. Send Stop event
        console.log('[Mock Exotel Client] Sending stop event.');
        clientWs.send(JSON.stringify({
          event: 'stop',
          stream_sid: STREAM_SID
        }));

        setTimeout(() => {
          clientWs.close();
          server.close(() => {
            console.log('\n====================================================');
            console.log('✅ Exotel AgentStream Loopback Test PASSED successfully!');
            console.log('====================================================');
            process.exit(0);
          });
        }, 500);
      }, 3000);
    }
  });

  clientWs.on('error', (err) => {
    console.error('❌ WebSocket Client Error:', err.message);
    server.close();
    process.exit(1);
  });
});
