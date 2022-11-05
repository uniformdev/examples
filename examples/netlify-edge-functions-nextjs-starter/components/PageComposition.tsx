import React, { ComponentType } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { ComponentInstance, RootComponentInstance } from "@uniformdev/canvas";
import {
  ComponentProps,
  Composition,
  DefaultNotImplementedComponent,
  Slot,
  createApiEnhancer,
  useCompositionInstance,
} from "@uniformdev/canvas-react";
import { ToggleEmbeddedContextDevTools } from "@uniformdev/context-devtools";

import Hero from "./Hero";
import Navigation, { NavLink } from "./Navigation";
import Footer from "./Footer";

// register your new components here
export function componentResolver(
  component: ComponentInstance
): ComponentType<ComponentProps<any>> | null {
  if (component.type == "hero") {
    return Hero;
  }
  return DefaultNotImplementedComponent;
}

export default function PageComposition({
  composition,
  navLinks,
}: {
  preview: boolean;
  composition: RootComponentInstance;
  navLinks: Array<NavLink>;
}) {
  const { composition: compositionInstance } = useCompositionInstance({
    composition,
    enhance: createApiEnhancer({
      apiUrl: "/api/preview",
    }),
  });
  const { metaTitle } = composition?.parameters || {};
  const title = metaTitle?.value as string;
  if (!composition) {
    return null;
  }
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <>
        <Navigation navLinks={navLinks} />
        {compositionInstance && (
          <Composition
            data={compositionInstance}
            resolveRenderer={componentResolver}
          >
            <Slot name="content" />
          </Composition>
        )}
        <Footer />
      </>
      <ToggleEmbeddedContextDevTools />
    </>
  );
}
