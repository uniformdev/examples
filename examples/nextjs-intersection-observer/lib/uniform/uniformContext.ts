import {
  Context,
  ManifestV2,
  ContextPlugin,
  enableDebugConsoleLogDrain,
  enableContextDevTools,
  TestEvent,
  PersonalizationEvent,
} from "@uniformdev/context";
import { NextCookieTransitionDataStore } from "@uniformdev/context-next";
import { NextPageContext } from "next";
import manifest from "./contextManifest.json";

export default function createUniformContext(
  serverContext?: NextPageContext
): Context {
  // 30 minutes
  const sessionExpirationInSeconds = 1800;
  const secondsInDay = 60 * 60 * 24;
  const expires = sessionExpirationInSeconds / secondsInDay;
  const plugins: ContextPlugin[] = [
    enableContextDevTools(),
    enableDebugConsoleLogDrain("debug"),
    enableGtmAnalytics(),
  ];
  const context = new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new NextCookieTransitionDataStore({
      serverContext,
      cookieAttributes: {
        expires,
      },
    }),
    plugins: plugins,
    visitLifespan: sessionExpirationInSeconds * 1000,
  });
  return context;
}

const dataLayer = {
  push: (data: any) => {
    console.log('dataLayer.push', data);
  }
}

const enableGtmAnalytics = (): ContextPlugin => {
  const personalizations: Record<string, PersonalizationEvent> = {};
  const tests: Record<string, TestEvent> = {};

  const seenPersonalizations: Record<string, boolean> = {};
  const seenTests: Record<string, boolean> = {};

  let isGtmReady = false;

  const emitPersonalization = (name: string) => {
    const result = personalizations[name];

    if (!result) {
      console.warn('Personalization result not found', name);
      return;
    }

    const hasBeenSeen = seenPersonalizations[name];

    if (!hasBeenSeen) {
      return;
    }

    // add window. back here
    dataLayer.push({
      'event': 'Uniform Personalization',
      name: result.name,
      event_label: result.variantIds.join(', '),
      is_control_group: result.control ? 1 : 0,
    });
  }

  const emitTest = (name: string) => {
    const result = tests[name];

    if (!result) {
      console.warn('Test result not found', name);
      return;
    }

    const hasBeenSeen = seenTests[name];

    if (!hasBeenSeen) {
      return;
    }

    // add window. back here
    dataLayer.push({
      'event': 'Uniform Personalization',
      name: result.name,
      event_category: 'Uniform AB Testing',
      event_label: result.variantId ?? 'No Variant',
    });
  }

  const onGtmReady = () => {
    isGtmReady = true;

    Object.keys(seenPersonalizations).forEach((name) => {
      emitPersonalization(name);
    });

    Object.keys(seenTests).forEach((name) => {
      emitTest(name);
    });
  }

  const onPersonalizationResult = (result: PersonalizationEvent) => {
    if (!result.changed) {
      return;
    }

    personalizations[result.name] = result;

    if (isGtmReady) {
      emitPersonalization(result.name);
    }
  }

  const onTestResult = (result: TestEvent) => {
    tests[result.name] = result;

    if (isGtmReady) {
      emitTest(result.name);
    }
  }

  const onPersonalizationSeen = (e: CustomEvent) => {
    const detail = e.detail as { name: string };
    seenPersonalizations[detail.name] = true;

    if (isGtmReady) {
      emitPersonalization(detail.name);
    }
  }

  const onTestSeen = (e: CustomEvent) => {
    const detail = e.detail as { name: string };
    seenTests[detail.name] = true;

    if (isGtmReady) {
      emitTest(detail.name);
    }
  }

  return {
    init(context) {
      if (typeof window === 'undefined') {
        return () => { };
      }

      context.events.on('personalizationResult', onPersonalizationResult);
      context.events.on('testResult', onTestResult);

      // this is a custom event, emit this after gtm is ready
      window.addEventListener('gtm_ready', onGtmReady);
      document.addEventListener('personalization_seen', onPersonalizationSeen);
      document.addEventListener('test_seen', onTestSeen);

      return () => {
        context.events.off('personalizationResult', onPersonalizationResult);
        context.events.off('testResult', onTestResult);
        window.removeEventListener('gtm_ready', onGtmReady);
        document.removeEventListener('personalization_seen', onPersonalizationSeen);
        document.removeEventListener('test_seen', onTestSeen);
      }
    },
  }
}