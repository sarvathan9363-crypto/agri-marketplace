const express = require('express');
const router = express.Router();

/**
 * Helper to construct the active WebSocket stream URL
 */
function resolveWsUrl(req) {
  if (process.env.AGRIVOICE_WS_URL && process.env.AGRIVOICE_WS_URL.startsWith('ws')) {
    return process.env.AGRIVOICE_WS_URL;
  }
  const host = req.headers.host || 'localhost:8080';
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const protocol = isSecure ? 'wss' : 'ws';
  return `${protocol}://${host}/api/exotel/stream`;
}

/**
 * Dynamic Method Handler:
 * GET or POST /api/exotel/connect
 * GET or POST /api/exotel/incoming
 * 
 * When Exotel's Voicebot Applet is configured in "Dynamic Method", Exotel sends an HTTP request
 * here and expects the ws(s) endpoint URL in response.
 */
function handleDynamicEndpoint(req, res) {
  const wsUrl = resolveWsUrl(req);
  console.log(`[AgriVoice][Exotel] Dynamic Voicebot URL requested. Returning: ${wsUrl}`);

  // Return both JSON format and plain text compatibility
  if (req.accepts('json')) {
    return res.status(200).json({
      endpoint: wsUrl,
      url: wsUrl,
      websocket_url: wsUrl,
      stream_url: wsUrl
    });
  }

  // Plain text fallback (Exotel dynamic endpoint often takes plain text string)
  res.type('text/plain').status(200).send(wsUrl);
}

router.get('/connect', handleDynamicEndpoint);
router.post('/connect', handleDynamicEndpoint);
router.get('/incoming', handleDynamicEndpoint);
router.post('/incoming', handleDynamicEndpoint);

/**
 * GET /api/exotel/stream
 * Informational endpoint if /api/exotel/stream is accessed via standard HTTP instead of WebSocket.
 */
router.get('/stream', (req, res) => {
  const wsUrl = resolveWsUrl(req);
  res.status(426).json({
    success: false,
    message: 'Upgrade Required: /api/exotel/stream is a real-time WebSocket endpoint. Connect using wss:// (or ws:// locally).',
    protocol: 'Exotel AgentStream WebSocket (LINEAR16, 8000Hz PCM)',
    wsUrl
  });
});

module.exports = router;
