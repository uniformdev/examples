import React from "react";
import Head from "next/head";
import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition } from "@uniformdev/canvas-react";
import Footer from "./Footer";
import { UniformDeployedPreviewBanner } from "@/components/UniformDeployedPreviewBanner";
import Link from "next/link";

export interface PageCompositionProps {
  data: RootComponentInstance;
}

export default function PageComposition({
  data: composition,
}: PageCompositionProps) {
  const { metaTitle } = composition?.parameters || {};
  return (
    <>
      <Head>
        <title>{metaTitle?.value as string}</title>
      </Head>
      <UniformDeployedPreviewBanner />
      <main className="main">
        <div className="navigation">
          <span key="en-US">
            <Link href="/" locale="en-US">
              English
            </Link>
          </span>
          <span key="de-DE">
            <Link href="/de-DE" locale="de-DE">
              Deutsch
            </Link>
          </span>
        </div>
        <UniformComposition data={composition} />
        <Footer />
      </main>
    </>
  );
}
