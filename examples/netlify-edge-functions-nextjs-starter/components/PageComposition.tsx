import React, { ComponentType } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { ComponentInstance, RootComponentInstance } from "@uniformdev/canvas";
import {
  ComponentProps,
  UniformComposition,
  DefaultNotImplementedComponent,
  UniformSlot,
} from "@uniformdev/canvas-react";
import Hero from "./Hero";
import Navigation, { NavLink } from "./Navigation";
import Footer from "./Footer";

const PreviewDevPanel = dynamic(
  () => import("lib/uniform/preview/PreviewDevPanel"),
  { ssr: false }
);

// register your new components here
export function componentResolver(
  component: ComponentInstance
): ComponentType<ComponentProps<any>> | null {
  if (component.type == "hero") {
    return Hero;
  }
  return DefaultNotImplementedComponent;
}

export default function PageComposition({
  preview,
  composition,
  navLinks,
}: {
  preview: boolean;
  composition: RootComponentInstance;
  navLinks: Array<NavLink>;
}) {
  const { metaTitle } = composition?.parameters || {};
  const title = metaTitle?.value as string;
  if (!composition) {
    return null;
  }
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <>
        <Navigation navLinks={navLinks} />
        <UniformComposition
          data={composition}
          resolveRenderer={componentResolver}
        >
          <UniformSlot name="content" />
        </UniformComposition>
        <Footer />
      </>
      <PreviewDevPanel preview={preview} compositionId={composition?._id} />
    </>
  );
}
