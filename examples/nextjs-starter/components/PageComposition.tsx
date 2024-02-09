import React from "react";
import Head from "next/head";
import { RootComponentInstance } from "@uniformdev/canvas";
import {
  UniformComposition,
  UniformSlot,
  componentStoreResolver,
} from "@uniformdev/canvas-react";
import Navigation, { NavLink } from "./Navigation";
import Footer from "./Footer";
import { UniformDeployedPreviewBanner } from "@/components/UniformDeployedPreviewBanner";
import { createObserverWrapper } from "@/lib/uniform/observerWrapper";

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
        <UniformComposition
          data={composition}
          resolveRenderer={(c) => {
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

// For debugging purposes:
// if (typeof window !== "undefined") {
//   document.addEventListener(
//     "personalization_seen",
//     (e: CustomEvent) => {
//       const detail = e.detail as { name: string };
//       console.log("personalization_seen", detail.name);
//     },
//     false
//   );

//   document.addEventListener(
//     "test_seen",
//     (e: CustomEvent) => {
//       const detail = e.detail as { name: string };
//       console.log("test_seen", detail.name);
//     },
//     false
//   );
// }
