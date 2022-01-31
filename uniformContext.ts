import { CookieTransitionDataStore, debugConsoleLogDrain, Context, ManifestV2 } from '@uniformdev/context';
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
  });

  // TODO: debug temp
  context.events.on('log', debugConsoleLogDrain);

  return context;
}