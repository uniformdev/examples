import {
  PersonalizationEvent,
  TestEvent,
  ContextPlugin,
} from "@uniformdev/context";

export const enableSegmentAnalytics = (options?: {
  /** If true, disables reflecting events passed to gtag into Uniform Context as event signals */
  disableEventSignals?: boolean;
  /** Override the window object that will have the gtag property added to it */
  theWindow?: { analytics?: any };
  /** Whether to emit every personalize and test that occurs, or only if something has actually changed
   * false (default): only emit events when a test assigns a variant the first time, or a personalization chooses different variants than before
   * true: emit an event every time a personalization or test is evaluated (e.g. for vDOM frameworks, each time a re-render occurs)
   */
  emitAll?: boolean;
}): ContextPlugin => {
  const { emitAll } = options || {};

  const isSegmentConfigured = (): boolean => {
    const configured = global.analytics !== undefined;
    return configured;
  };

  return {
    init: (context) => {
      // Handle emitting personalization results to Segment
      const onPersonalizationResult = (result: PersonalizationEvent) => {
        if (!isSegmentConfigured()) {
          context.log("warn", 700);
          return;
        }

        // only emit analytics events when the placement actually changes
        // (e.g. not every re-render)
        if (!emitAll && !result.changed) {
          return;
        }

        global.analytics.track("UniformPersonalization", {
          name: result.name,
          label: result.variantIds.join(", "),
          is_control_group: result.control ? 1 : 0,
        });
      };

      // Handle emitting test results to GA4
      const onTestResult = (result: TestEvent) => {
        if (!isSegmentConfigured()) {
          context.log("warn", 700);
          return;
        }

        // only emit analytics events when the placement actually changes
        // (e.g. not every re-render)
        if (!emitAll && !result.variantAssigned) {
          return;
        }

        global.analytics.track("UniformABTesting", {
          name: result.name,
          label: result.variantId ?? "No Variant",
        });
      };

      context.events.on("personalizationResult", onPersonalizationResult);
      context.events.on("testResult", onTestResult);

      return () => {
        context.events.off("personalizationResult", onPersonalizationResult);
        context.events.off("testResult", onTestResult);
      };
    },
  };
};
