import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (!process.env.UNIFORM_INSIGHTS_ENDPOINT || !process.env.UNIFORM_INSIGHTS_KEY || !process.env.UNIFORM_PROJECT_ID) {
    throw Error('Check Uniform Insights connection settings');
  }
  const destination = new URL(process.env.UNIFORM_INSIGHTS_ENDPOINT);
  destination.pathname = '/v0/events';
  destination.searchParams.set('name', 'analytics_events');

  const originalBody = await req.json();
  const body = JSON.stringify({ ...originalBody, project_id: process.env.UNIFORM_PROJECT_ID });
  const response = await fetch(destination.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UNIFORM_INSIGHTS_KEY}`,
    },
    body,
  });

  const ingestionResponse = await response.json();
  return NextResponse.json(ingestionResponse, { status: response.status });
}
