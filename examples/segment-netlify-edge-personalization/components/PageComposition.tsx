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
import "../lib/uniform/components";

export default function PageComposition({
  composition,
  navLinks,
}: {
  preview: boolean;
  composition: RootComponentInstance;
  navLinks: Array<NavLink>;
}) {
  const contextualEditingEnhancer = createUniformApiEnhancer({
    apiUrl: "/api/preview",
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
      <Navigation navLinks={navLinks} />
      {!composition ? null : (
        <UniformComposition
          data={composition}
          contextualEditingEnhancer={contextualEditingEnhancer}
        >
          <UniformSlot name="content" />
        </UniformComposition>
      )}
      <Footer />
    </>
  );
}
