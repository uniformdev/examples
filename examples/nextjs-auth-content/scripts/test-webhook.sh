#!/bin/bash

# Test the Uniform webhook endpoint
# Usage: ./scripts/test-webhook.sh [url]
#
# Examples:
#   ./scripts/test-webhook.sh                          # Uses localhost:3000
#   ./scripts/test-webhook.sh http://localhost:3001    # Custom port
#   ./scripts/test-webhook.sh https://your-domain.com  # Production

BASE_URL="${1:-http://localhost:3000}"
WEBHOOK_URL="${BASE_URL}/api/webhooks/uniform"

echo "Testing webhook endpoint: ${WEBHOOK_URL}"
echo ""

curl -X POST "${WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -H "uniform-secret: ${UNIFORM_PREVIEW_SECRET:-hello-world}" \
  -d '{ "eventType": "composition.published", "type": "page", "name": "Manual Init" }' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s

echo ""
