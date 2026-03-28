import React from "react";
import Head from "next/head";
import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition } from "@uniformdev/canvas-react";

export interface PageCompositionProps {
  data: RootComponentInstance;
}

export default function PageComposition({
  data,
}: PageCompositionProps) {
  const { metaTitle } = data?.parameters || {};
  return (
    <>
      <Head>
        <title>{metaTitle?.value as string}</title>
      </Head>
      <main className="main">
        <UniformComposition data={data} />
      </main>
    </>
  );
}
