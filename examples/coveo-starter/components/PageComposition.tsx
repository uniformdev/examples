import React from "react";
import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition, UniformSlot } from "@uniformdev/canvas-react";
import Footer from "./Footer";
import componentResolver from "@/components/componentResolver";

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
        resolveRenderer={componentResolver}
      >
        <UniformSlot name="search-content" />
      </UniformComposition>
      <Footer />
    </main>
  );
}
