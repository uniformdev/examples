import React from "react";
import Head from "next/head";
import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition } from "@uniformdev/canvas-react";
import Navigation, { NavLink } from "./Navigation";
import Footer from "./Footer";
import { UniformDeployedPreviewBanner } from "@/components/UniformDeployedPreviewBanner";
import { useSetViewportQuirk } from "@/hooks/useSetViewportQuirk";

export interface PageCompositionProps {
  data: RootComponentInstance;
  navLinks: Array<NavLink>;
}

export default function PageComposition({
  data: composition,
  navLinks,
}: PageCompositionProps) {
  const { metaTitle } = composition?.parameters || {};
  // set initial viewport quirk
  useSetViewportQuirk();
  return (
    <>
      <Head>
        <title>{metaTitle?.value as string}</title>
      </Head>
      <UniformDeployedPreviewBanner />
      <main className="main">
        <Navigation navLinks={navLinks} />
        <UniformComposition data={composition} />
        <Footer />
      </main>
    </>
  );
}
