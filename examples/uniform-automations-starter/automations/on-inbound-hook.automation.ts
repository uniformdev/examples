import { defineAutomation } from '@uniformdev/automations-sdk';
import * as z from 'zod/mini';

// you can validate incoming payloads with any validator you like, zod is just an example
const ExampleIncomingWebhookSchema = z.object({ id: z.string(), action: z.string() });

/**
 * Incoming-webhook automation example.
 *
 * How to configure / call it
 * --------------------------
 *  Webhook URL: https://uniform.app/api/v1/automation-webhooks?projectId=<PROJECT_ID>&publicId=on-inbound-hook
 *
 *  curl -X POST "$WEBHOOK_URL" \
 *    -H "Content-Type: application/json" \
 *    -d '{"id":"abc","action":"sync"}'
 *
 *  The handler receives `input.method`, `input.headers`, `input.query`, and `input.rawBody`.
 * 
 *  The deployed `publicId` is the filename without extension: `on-inbound-hook`.
 */
export default defineAutomation({
  metadata: {
    name: 'On inbound webhook',
    triggers: [{ type: 'incomingWebhook' }],
  },
  handler: async ({ input, log }) => {
    // Verify source authenticity here over input.rawBody (e.g. HMAC +
    // constant-time compare against a signature header) and
    // `return { outcome: 'unauthorized' }` on failure.
    if (!fauxValidation(input.rawBody)) {
      return { outcome: 'unauthorized' };
    }

    const body = ExampleIncomingWebhookSchema.safeParse(JSON.parse(input.rawBody));
    if (!body.success) {
      log.error(`Invalid body:\n${z.prettifyError(body.error)}`);
      return { outcome: 'rejected' };
    }

    log.info(`Handling ${body.data.action} for ${body.data.id}`);
    // returning void = implicit success
  },
});

function fauxValidation(rawBody: string): boolean {
  return !rawBody.includes('unauthorized');
}
