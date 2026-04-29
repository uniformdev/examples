import { NextRequest, NextResponse } from 'next/server';
import { ALLOWED_PAGE_TYPES } from '@/src/lib/auth/auth-settings';
import { processCompositionUpdate } from '@/src/lib/auth/protected-routes-update';
import { waitUntil } from '@vercel/functions';

export const WEBHOOK_SECRET = process.env.UNIFORM_PREVIEW_SECRET;

type UniformWebhookBody = {
  eventType: string;
  type: string;
  id: string;
  name?: string;
  initiator?: {
    is_api_key?: boolean;
  };
  project: {
    id: string;
  };
};
const COMPOSITION_EVENT_TYPES = ['composition.deleted', 'composition.published'];

/**
 * Uniform CMS webhook: validates optional `uniform-secret`, ignores API-key-initiated events,
 * debounces composition publish/delete for types in {@link ALLOWED_PAGE_TYPES} into Edge Config `accessConfig`,
 * and handles entry events via tag revalidation and preview-path revalidation.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body, verifying secret if configured
    let body: UniformWebhookBody;

    if (WEBHOOK_SECRET) {
      const secret = request.headers.get('uniform-secret') ?? '';

      try {
        if (secret !== WEBHOOK_SECRET) {
          throw new Error('Invalid webhook secret');
        }
        body = (await request.json()) as UniformWebhookBody;
      } catch (err) {
        console.error('Webhook validation failed', err);
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
      }
    } else {
      console.warn('No UNIFORM_PREVIEW_SECRET set, this should only be the case for development');
      body = await request.json();
    }

    const { eventType, type: itemType, name, initiator } = body;

    // This ensures updates do not happen on uniform:push which can spam the webhook
    if (initiator?.is_api_key) {
      return NextResponse.json({ message: 'Ignored: Event was triggered by an api key' });
    }

    // Handle composition events
    if (COMPOSITION_EVENT_TYPES.includes(eventType)) {
      if (!ALLOWED_PAGE_TYPES.includes(itemType)) {
        return NextResponse.json({ message: `Ignored: Not an allowed page type: ${itemType}` });
      }

      console.info(`Processing ${eventType} for composition: ${name}`);

      // Respond immediately, process in background
      waitUntil(processCompositionUpdate());

      return NextResponse.json({ message: 'Debounced update scheduled' });
    }

    return NextResponse.json({ message: 'Event type not handled' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
