import Head from "next/head";
import { Slot } from "@uniformdev/canvas-react";

import Footer from "./Footer";

export default function LayoutCanvas({ title }) {
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Slot name="body" />
      <Footer />
    </div>
  );
}