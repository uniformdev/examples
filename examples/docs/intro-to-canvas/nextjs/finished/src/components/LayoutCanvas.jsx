import Head from "next/head";
import { UniformSlot } from "@uniformdev/canvas-react";

import Footer from "./Footer";

export default function LayoutCanvas({ title }) {
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UniformSlot name="body" />
      <Footer />
    </div>
  );
}
