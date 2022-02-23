import { CookieTransitionDataStore, Context, ManifestV2, enableContextDevTools, enableDebugConsoleLogDrain } from '@uniformdev/context';
import { NextPageContext } from 'next';
import manifest from './manifest.json';
import { NextCookieAdapter } from './uniform-next-sdk';

export function createUniformContext(serverContext?: NextPageContext) {
  const cookieAdapter = new NextCookieAdapter(serverContext);

  const context = new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new CookieTransitionDataStore({
      cookieAdapter,
    }),
    plugins: [
      enableContextDevTools(),
      enableDebugConsoleLogDrain('debug')
    ]
  });

  return context;
}