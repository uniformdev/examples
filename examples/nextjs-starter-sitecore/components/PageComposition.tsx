import React from "react";
import Head from "next/head";
import { RootComponentInstance } from "@uniformdev/canvas";
import {
  UniformComposition,
  UniformSlot,
  createUniformApiEnhancer,
} from "@uniformdev/canvas-react";
import Navigation, { NavLink } from "./Navigation";
import Footer from "./Footer";

// IMPORTANT: import all canvas components that are expected to be added within slots
import "./canvasComponents";

export default function PageComposition({
  data: composition,
  navLinks,
}: {
  preview: boolean;
  data: RootComponentInstance;
  navLinks: Array<NavLink>;
}) {
  const enhancer = createUniformApiEnhancer({
    apiUrl: `/api/preview`,
  });
  const { metaTitle } = composition?.parameters || {};
  const title = metaTitle?.value as string;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <>
        <Navigation navLinks={navLinks} />
        <UniformComposition
          data={composition}
          contextualEditingEnhancer={enhancer}
        >
          <UniformSlot name="content" />
        </UniformComposition>
        <Footer />
      </>
    </>
  );
}
