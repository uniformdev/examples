import { NextRequest } from 'next/server';
import { createBackendInsightsProxyHandler } from '@uniformdev/insights/proxy';

export async function POST(req: NextRequest) {
  const handler = createBackendInsightsProxyHandler({
    apiHost: process.env.UNIFORM_INSIGHTS_ENDPOINT!,
    apiKey: process.env.UNIFORM_INSIGHTS_KEY!,
  });
  return handler.handleRequest(await req.text());
}
