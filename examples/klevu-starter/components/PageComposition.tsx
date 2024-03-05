import React from "react";

import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition, UniformSlot } from "@uniformdev/canvas-react";

import Footer from "./Footer";

export interface PageCompositionProps {
  data: RootComponentInstance;
}

export default function PageComposition({
  data: composition,
}: PageCompositionProps) {
  return (
    <main className="main">
      <UniformComposition
        data={composition}
      >
        <UniformSlot name="content" />
      </UniformComposition>
      <Footer />
    </main>
  );
}
