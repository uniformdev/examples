import React from "react";
import Head from "next/head";
import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition, UniformSlot } from "@uniformdev/canvas-react";
import Navigation, { NavLink } from "./Navigation";
import Footer from "./Footer";
import { UniformDeployedPreviewBanner } from "@/components/UniformDeployedPreviewBanner";

export interface PageCompositionProps {
  data: RootComponentInstance;
  navLinks: Array<NavLink>;
}

export default function PageComposition({
  data: composition,
  navLinks,
}: PageCompositionProps) {
  const { metaTitle } = composition?.parameters || {};
  return (
    <>
      <Head>
        <title>{metaTitle?.value as string}</title>
      </Head>
      <UniformDeployedPreviewBanner />
      <main className="main">
        <Navigation navLinks={navLinks} />
        <UniformComposition data={composition}>
          <UniformSlot name="content" />
        </UniformComposition>
        <Footer />
      </main>
    </>
  );
}
