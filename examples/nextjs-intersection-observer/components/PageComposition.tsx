import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { CANVAS_PERSONALIZATION_PARAM, CANVAS_PERSONALIZE_SLOT, CANVAS_PERSONALIZE_TYPE, CANVAS_TEST_SLOT, CANVAS_TEST_TYPE, RootComponentInstance, walkNodeTree } from "@uniformdev/canvas";
import { ComponentProps, UniformComposition, UniformSlot, componentStoreResolver, useUniformCurrentComponent, useUniformCurrentComposition } from "@uniformdev/canvas-react";
import Navigation, { NavLink } from "./Navigation";
import Footer from "./Footer";
import { UniformDeployedPreviewBanner } from "@/components/UniformDeployedPreviewBanner";
import { useUniformContext } from "@uniformdev/context-react";

export interface PageCompositionProps {
  data: RootComponentInstance;
  navLinks: Array<NavLink>;
}

export default function PageComposition({
  data: composition,
  navLinks,
}: PageCompositionProps) {
  const { metaTitle } = composition?.parameters || {};

  walkNodeTree(composition, ({ node, type, actions }) => {
    if (type !== 'component') {
      actions.stopProcessingDescendants();
      return;
    }

    if (node.type === CANVAS_PERSONALIZE_TYPE) {
      const slot = node.slots?.[CANVAS_PERSONALIZE_SLOT];

      slot?.forEach(component => {
        component.parameters = {
          ...component.parameters,
          trackingEventName: node.parameters?.['trackingEventName']!,
        }
      });
    } else if (node.type === CANVAS_TEST_TYPE) {
      const slot = node.slots?.[CANVAS_TEST_SLOT];

      slot?.forEach(component => {
        component.parameters = {
          ...component.parameters,
          test: node.parameters?.['test']!,
        }
      });
    }
  });

  return (
    <>
      <Head>
        <title>{metaTitle?.value as string}</title>
      </Head>
      <UniformDeployedPreviewBanner />
      <main className="main">
        <Navigation navLinks={navLinks} />
        <UniformComposition
          data={composition}
          resolveRenderer={c => {
            const resolved = componentStoreResolver(c);
            return createObserverWrapper(resolved);
          }}
        >
          <UniformSlot name="content" />
        </UniformComposition>
        <Footer />
      </main>
    </>
  );
}

if (typeof window !== 'undefined') {
  document.addEventListener('personalization_seen', (e: CustomEvent) => {
    const detail = e.detail as { name: string };
    console.log('personalization_seen', detail.name);
  }, false);

  document.addEventListener('test_seen', (e: CustomEvent) => {
    const detail = e.detail as { name: string };
    console.log('test_seen', detail.name);
  }, false);
}

const createObserverWrapper = (ComponentType: React.ComponentType) => {
  return function ObserverWrapper(props: ComponentProps<unknown>) {
    const {
      component,
    } = props;

    const personalizationName = component.parameters?.['trackingEventName']?.value as string | undefined;
    const testName = component.parameters?.['test']?.value as string | undefined;

    const THRESHOLD = 0.5;

    const wrapperEl = useRef<HTMLDivElement>(null);
    const [observing, setObserving] = useState(false);
    const trackedRef = useRef(false);

    useEffect(() => {
      const isInteresting = typeof personalizationName === 'string' || typeof testName === 'string';

      if (!isInteresting || !wrapperEl.current || observing || trackedRef.current) {
        return;
      }

      const instance = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !trackedRef.current) {
            trackedRef.current = true;

            if (personalizationName) {
              document.dispatchEvent(new CustomEvent("personalization_seen", { detail: { name: personalizationName } }));
            }

            if (testName) {
              document.dispatchEvent(new CustomEvent("test_seen", { detail: { name: testName } }));
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
      <div
        ref={wrapperEl}
        style={{ border: '1px solid red' }}
      >
        <ComponentType {...props as any} />
      </div>
    )
  };
}