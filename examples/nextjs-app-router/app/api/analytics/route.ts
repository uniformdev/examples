import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (!process.env.UNIFORM_INSIGHTS_ENDPOINT || !process.env.UNIFORM_INSIGHTS_KEY) {
    throw Error('Check Uniform Insights connection settings');
  }
  const destination = new URL(process.env.UNIFORM_INSIGHTS_ENDPOINT);
  destination.pathname = '/v0/events';
  destination.searchParams.set('name', 'analytics_events');

  const data = await req.json();
  const response = await fetch(destination.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UNIFORM_INSIGHTS_KEY}`,
    },
    body: JSON.stringify(data),
  });

  const ingestionResponse = await response.json();
  return NextResponse.json(ingestionResponse, { status: response.status });
}
