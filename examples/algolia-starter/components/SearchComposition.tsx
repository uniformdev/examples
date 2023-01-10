import React from "react";
import Head from "next/head";
import { RootComponentInstance } from "@uniformdev/canvas";
import { Composition, Slot } from "@uniformdev/canvas-react";
import Footer from "./Footer";
import componentResolver from "@/components/componentResolver";

export default function SearchComposition({
  composition,
}: {
  composition: RootComponentInstance;
}) {
  const { metaTitle } = composition.parameters || {};
  const title = metaTitle?.value as string;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <>
        <div className="title">
          <p>{title}</p>
        </div>
        <Composition data={composition} resolveRenderer={componentResolver}>
          <Slot name="providers" />
        </Composition>
        <Footer />
      </>
    </>
  );
}
