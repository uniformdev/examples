import React from "react";
import Head from "next/head";
import getConfig from "next/config";
import { RootComponentInstance } from "@uniformdev/canvas";
import {
  Composition,
  Slot,
  createApiEnhancer,
  useContextualEditing,
} from "@uniformdev/canvas-react";
import { ToggleEmbeddedContextDevTools } from "@uniformdev/context-devtools";
import Navigation, { NavLink } from "./Navigation";
import Footer from "./Footer";

// IMPORTANT: import all canvas components that are expected to be added within slots
import "./canvasComponents";

export default function PageComposition({
  composition: initialCompositionValue,
  navLinks,
}: {
  preview: boolean;
  composition: RootComponentInstance;
  navLinks: Array<NavLink>;
}) {
  const { composition: compositionInstance } = useContextualEditing({
    initialCompositionValue,
    enhance: createApiEnhancer({
      apiUrl: `/api/enhance`,
    }),
  });
  const { serverRuntimeConfig } = getConfig();
  const { projectId, apiKey, apiHost } = serverRuntimeConfig;
  const { metaTitle } = compositionInstance?.parameters || {};
  const title = metaTitle?.value as string;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <>
        <Navigation navLinks={navLinks} />
        <Composition data={compositionInstance}>
          <Slot name="content" />
        </Composition>
        <ToggleEmbeddedContextDevTools
          initialSettings={{
            apiHost: apiHost,
            apiKey: apiKey,
            projectId: projectId,
          }}
        />
        <Footer />
      </>
    </>
  );
}
