import React, { ComponentType } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import getConfig from "next/config";
import { RootComponentInstance } from "@uniformdev/canvas";
import {
  UniformComposition,
  UniformSlot,
  createUniformApiEnhancer,
} from "@uniformdev/canvas-react";
import { ToggleEmbeddedContextDevTools } from "@uniformdev/context-devtools";
import Navigation, { NavLink } from "./Navigation";
import Footer from "./Footer";

// IMPORTANT: importing all components registered in Canvas
import "./canvasComponents";

const PreviewDevPanel = dynamic(
  () => import("lib/uniform/preview/PreviewDevPanel")
);

const { serverRuntimeConfig } = getConfig();
const { projectId, apiKey, apiHost } = serverRuntimeConfig;

export interface PageCompositionProps {
  preview: boolean;
  composition: RootComponentInstance;
  navLinks: Array<NavLink>;
}

export default function PageComposition({
  preview,
  composition,
  navLinks,
}: PageCompositionProps) {
  const [showPreviewToggle, setShowPreviewToggle] =
    React.useState<boolean>(false);

  const contextualEditingEnhancer = createUniformApiEnhancer({
    apiUrl: "/api/preview",
  });

  React.useEffect(() => {
    // Stackblitz does not support some crypto api inside webcontainers which are required for preview api.
    if (!window.location.host.includes(".webcontainer.io")) {
      setShowPreviewToggle(true);
    }
  }, []);

  const { metaTitle } = composition?.parameters || {};
  return (
    <>
      <Head>
        <title>{metaTitle?.value as string}</title>
      </Head>
      <>
        <Navigation navLinks={navLinks} />
        <UniformComposition
          data={composition}
          contextualEditingEnhancer={contextualEditingEnhancer}
        >
          <UniformSlot name="content" />
        </UniformComposition>
        <ToggleEmbeddedContextDevTools
          initialSettings={{
            apiHost: apiHost,
            apiKey: apiKey,
            projectId: projectId,
          }}
        />
        <Footer />
      </>
      {showPreviewToggle && (
        <PreviewDevPanel preview={preview} compositionId={composition._id} />
      )}
    </>
  );
}
