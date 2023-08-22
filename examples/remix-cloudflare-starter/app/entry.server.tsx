import type { EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { RemixUniformContextProvider } from '@uniformdev/context-remix';
import { parse } from 'cookie';
import { renderToString } from 'react-dom/server';

import { createUniformContext } from './services/uniformContext';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const serverContext = createUniformContext(request);

  // BEGIN UNIFORM CONTEXT SSR
  serverContext.update({
    url: new URL(request.url),
    cookies: parse(request.headers.get('cookie') ?? '') ?? undefined,
  });
  // END UNIFORM CONTEXT SSR

  const markup = renderToString(
    <RemixUniformContextProvider value={serverContext}>
      <RemixServer context={remixContext} url={request.url} />
    </RemixUniformContextProvider>
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
