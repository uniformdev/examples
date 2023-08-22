import { Context, enableContextDevTools, ManifestV2 } from '@uniformdev/context';
import { RemixCookieTransitionDataStore } from '@uniformdev/context-remix';

import uniformContextManifest from './uniformContextManifest.json';

export function createUniformContext(request?: Request) {
  return new Context({
    defaultConsent: true,
    plugins: [enableContextDevTools()],
    transitionStore: new RemixCookieTransitionDataStore({ request }),
    manifest: uniformContextManifest as ManifestV2,
  });
}
