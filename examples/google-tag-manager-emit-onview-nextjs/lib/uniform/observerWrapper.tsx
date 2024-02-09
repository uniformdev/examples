import { ComponentProps } from "@uniformdev/canvas-react";
import { useEffect, useRef, useState } from "react";

export const createObserverWrapper = (ComponentType: React.ComponentType) => {
  return function ObserverWrapper(props: ComponentProps<unknown>) {
    const { component } = props;

    const personalizationName = component.parameters?.["trackingEventName"]
      ?.value as string | undefined;
    const testName = component.parameters?.["test"]?.value as
      | string
      | undefined;

    // Note: you can tweak this setting
    const THRESHOLD = 0.5;

    const wrapperEl = useRef<HTMLDivElement>(null);
    const [observing, setObserving] = useState(false);
    const trackedRef = useRef(false);

    useEffect(() => {
      const isInteresting =
        typeof personalizationName === "string" || typeof testName === "string";

      if (
        !isInteresting ||
        !wrapperEl.current ||
        observing ||
        trackedRef.current
      ) {
        return;
      }

      const instance = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !trackedRef.current) {
            trackedRef.current = true;

            if (personalizationName) {
              console.log("dispatchEvent!!", { personalizationName });

              document.dispatchEvent(
                new CustomEvent("personalization_seen", {
                  detail: { name: personalizationName },
                })
              );
            }

            if (testName) {
              document.dispatchEvent(
                new CustomEvent("test_seen", { detail: { name: testName } })
              );
            }
          }
        },
        {
          threshold: THRESHOLD,
        }
      );

      if (wrapperEl.current) {
        instance.observe(wrapperEl.current);
        setObserving(true);
      }
    }, [observing, personalizationName]);

    return (
      <div ref={wrapperEl} style={{ border: "1px solid red" }}>
        <ComponentType {...(props as any)} />
      </div>
    );
  };
};
