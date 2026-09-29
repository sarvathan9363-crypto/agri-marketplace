# Razorpay test-mode setup

Set the three placeholder variables in `.env` from `.env.example`; do not commit that file. The key ID is returned only by `POST /api/payments/create-order`; the API and webhook secrets never leave the backend.

Configure a Razorpay Dashboard webhook at `https://YOUR_API_HOST/api/payments/webhook`, with the same `RAZORPAY_WEBHOOK_SECRET`. Subscribe to `payment.captured`, `payment.failed`, and relevant `order.*` events. The endpoint verifies the raw-body HMAC before handling an event and records delivery IDs to make retries idempotent.

For local testing, expose port 8080 through a HTTPS tunnel and use its HTTPS URL in the Dashboard. Before live mode, replace all three test values with live values, update the webhook secret, deploy HTTPS, and run the payment/security cases listed in the implementation brief.
