import { Context, type ManifestV2 } from "@uniformdev/context";
import { NextCookieTransitionDataStore } from "@uniformdev/context-next";
import type { NextPageContext } from "next";
import manifest from "./contextManifest.json";

export default function createUniformContext(
  serverContext?: NextPageContext
): Context {
  return new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new NextCookieTransitionDataStore({ serverContext }),
  });
}
