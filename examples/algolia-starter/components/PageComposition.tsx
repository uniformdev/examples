import React, { ComponentType } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import getConfig from "next/config";
import { RootComponentInstance } from "@uniformdev/canvas";
import {
  Composition,
  Slot,
  useContextualEditing,
  createApiEnhancer,
} from "@uniformdev/canvas-react";

import Footer from "./Footer";

import "./components";

export default function PageComposition({
  composition,
}: {
  preview: boolean;
  composition: RootComponentInstance;
}) {
  const { composition: compositionInstance } = useContextualEditing({
    initialCompositionValue: composition,
    enhance: createApiEnhancer({
      apiUrl: "/api/preview",
    }),
  });

  if (!compositionInstance) {
    return null;
  }

  const { metaTitle } = composition.parameters || {};
  const title = metaTitle?.value as string;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <>
        <Composition data={compositionInstance}>
          <Slot name="content" />
        </Composition>

        <Footer />
      </>
    </>
  );
}
