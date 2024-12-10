import {
  Context,
  type ContextPlugin,
  enableContextDevTools,
  type ManifestV2,
  enableDebugConsoleLogDrain,
  type PersonalizationEvent
} from '@uniformdev/context';

import { NextCookieTransitionDataStore } from '@uniformdev/context-next';
import type { NextPageContext } from 'next';
import { enableGoogleGtagAnalytics } from '@uniformdev/context-gtag';
import manifest from './context-manifest.json';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function onPersonalization(e: PersonalizationEvent): void {
  if (typeof window === 'undefined' || !window?.gtag) return;
  const { name, variantIds, control } = e;
  variantIds.forEach((variant) => {
    const data = {
      event_category: 'Uniform Personalization',
      event_label: variant.id,
      is_control_group: control ?? variant.control ? 1 : 0,
      hostname: window.location.hostname ?? ''
    };
    if (window.gtag) {
      window.gtag('event', name, data);
    }
  });
}
/* For A/B testing */
// function onTest(e: any): void {
//   if (typeof window === 'undefined' || !window?.gtag) return;
//   const { name, variantId } = e;
//   window.gtag('event', name, {
//     event_category: 'Uniform Test',
//     event_label: variantId ?? ''
//   });
// }

export function enableCustomGoogleGtagAnalytics(): ContextPlugin {
  return {
    init: (context: Context) => {
      context.events.on('personalizationResult', onPersonalization);
      // context.events.on('testResult', onTest);
      return () => {
        context.events.off('personalizationResult', onPersonalization);
        // context.events.off('testResult', onTest);
      };
    }
  };
}

export function createUniformContext(serverContext?: NextPageContext): Context {
  const plugins: ContextPlugin[] = [];

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development') {
    plugins.push(enableContextDevTools(), enableDebugConsoleLogDrain('debug'));
  }

  /*
    Add GTM during feature development
  */
  const gaPlugin = enableGoogleGtagAnalytics({ emitAll: true });
  const customPlugin = enableCustomGoogleGtagAnalytics();
  plugins.push(enableContextDevTools(), gaPlugin, customPlugin);
  console.info(
    'GTM ID is set, activating the enableGoogleGtagAnalytics plugin with Uniform Tracker.'
  );

  return new Context({
    defaultConsent: false,
    requireConsentForPersonalization: true,
    manifest: manifest as ManifestV2,
    transitionStore: new NextCookieTransitionDataStore({
      serverContext
    }),
    plugins
  });
}
