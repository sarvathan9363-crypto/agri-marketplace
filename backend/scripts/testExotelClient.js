const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080/api/exotel/stream');

const STREAM_SID = 'str_test_12345';

ws.on('open', () => {
  console.log('Mock Exotel connected');
  
  // 1. Send Handshake
  ws.send(JSON.stringify({ event: 'connected' }));

  // 2. Send Start
  ws.send(JSON.stringify({
    event: 'start',
    sequence_number: 1,
    stream_sid: STREAM_SID,
    start: {
      account_sid: 'acc_test',
      call_sid: 'call_test',
      tracks: ['inbound']
    }
  }));

  // 3. Send 5 media chunks (dummy 100ms PCM audio)
  let seq = 2;
  const interval = setInterval(() => {
    // 8000 Hz, 16-bit = 16000 bytes/sec. 100ms = 1600 bytes of zeros
    const dummyPcm = Buffer.alloc(1600, 0); 
    
    ws.send(JSON.stringify({
      event: 'media',
      sequence_number: seq++,
      stream_sid: STREAM_SID,
      media: {
        chunk: seq,
        timestamp: String(seq * 100),
        payload: dummyPcm.toString('base64')
      }
    }));

    if (seq > 6) {
      clearInterval(interval);
      // 4. Stop
      ws.send(JSON.stringify({
        event: 'stop',
        stream_sid: STREAM_SID
      }));
      ws.close();
    }
  }, 100);
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.event === 'media') {
    console.log(`Received loopback/TTS media from backend, base64 length: ${msg.media.payload.length}`);
  }
});
