import {
  ContextPlugin,
  PersonalizationEvent,
  TestEvent,
} from "@uniformdev/context";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const enableGtmAnalytics = (): ContextPlugin => {
  const personalizations: Record<string, PersonalizationEvent> = {};
  const tests: Record<string, TestEvent> = {};

  const seenPersonalizations: Record<string, boolean> = {};
  const seenTests: Record<string, boolean> = {};

  let isGtmReady =
    typeof window !== "undefined" && typeof window.dataLayer !== "undefined";

  const emitPersonalization = (name: string) => {
    const result = personalizations[name];

    if (!result) {
      console.warn("Personalization result not found", name);
      return;
    }

    const hasBeenSeen = seenPersonalizations[name];

    if (!hasBeenSeen) {
      return;
    }

    window.dataLayer.push({
      event: "Uniform Personalization",
      name: result.name,
      event_label: result.variantIds.join(", "),
      is_control_group: result.control ? 1 : 0,
    });
  };

  const emitTest = (name: string) => {
    const result = tests[name];

    if (!result) {
      console.warn("Test result not found", name);
      return;
    }

    const hasBeenSeen = seenTests[name];

    if (!hasBeenSeen) {
      return;
    }

    // add window. back here
    window.dataLayer.push({
      event: "Uniform Personalization",
      name: result.name,
      event_category: "Uniform AB Testing",
      event_label: result.variantId ?? "No Variant",
    });
  };

  const onGtmReady = () => {
    console.log("onGtmReady");
    isGtmReady = true;

    Object.keys(seenPersonalizations).forEach((name) => {
      console.log("onGtmReady: emitPersonalization", { name });
      emitPersonalization(name);
    });

    Object.keys(seenTests).forEach((name) => {
      emitTest(name);
    });
  };

  const onPersonalizationResult = (result: PersonalizationEvent) => {
    if (!result.changed) {
      return;
    }

    personalizations[result.name] = result;

    if (isGtmReady) {
      emitPersonalization(result.name);
    }
  };

  const onTestResult = (result: TestEvent) => {
    tests[result.name] = result;

    if (isGtmReady) {
      emitTest(result.name);
    }
  };

  const onPersonalizationSeen = (e: CustomEvent) => {
    console.log("onPersonalizationSeen", { e });
    const detail = e.detail as { name: string };
    seenPersonalizations[detail.name] = true;

    if (isGtmReady) {
      console.log("isGtmReady IS ready", { e });
      emitPersonalization(detail.name);
    } else {
      console.log("!!!! isGtmReady is not ready", { e });
    }
  };

  const onTestSeen = (e: CustomEvent) => {
    const detail = e.detail as { name: string };
    seenTests[detail.name] = true;

    if (isGtmReady) {
      emitTest(detail.name);
    }
  };

  return {
    init(context) {
      if (typeof window === "undefined") {
        return () => {};
      }

      context.events.on("personalizationResult", onPersonalizationResult);
      context.events.on("testResult", onTestResult);

      // this is a custom event, emit this after gtm is ready
      window.addEventListener("gtm_ready", onGtmReady);
      document.addEventListener("personalization_seen", onPersonalizationSeen);
      document.addEventListener("test_seen", onTestSeen);

      return () => {
        context.events.off("personalizationResult", onPersonalizationResult);
        context.events.off("testResult", onTestResult);
        window.removeEventListener("gtm_ready", onGtmReady);
        document.removeEventListener(
          "personalization_seen",
          onPersonalizationSeen
        );
        document.removeEventListener("test_seen", onTestSeen);
      };
    },
  };
};

export default enableGtmAnalytics;
