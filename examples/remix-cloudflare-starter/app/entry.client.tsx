import { RemixBrowser } from '@remix-run/react';
import { RemixUniformContextProvider } from '@uniformdev/context-remix';
import { parse } from 'cookie';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { createUniformContext } from './services/uniformContext';

const clientContext = createUniformContext();

clientContext.update({
  url: new URL(window.location.href),
  cookies: parse(document.cookie ?? ''),
});

hydrateRoot(
  document,
  <StrictMode>
    <RemixUniformContextProvider value={clientContext}>
      <RemixBrowser />
    </RemixUniformContextProvider>
  </StrictMode>
);
