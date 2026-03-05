import {
  Context,
  type ContextPlugin,
  type ManifestV2,
} from "@uniformdev/context";
import { NextCookieTransitionDataStore } from "@uniformdev/context-next";
import type { NextPageContext } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const manifest = require("./contextManifest.json") as ManifestV2;

export function createUniformContext(serverContext?: NextPageContext): Context {
  const plugins: ContextPlugin[] = [];

  const context = new Context({
    defaultConsent: true,
    manifest,
    transitionStore: new NextCookieTransitionDataStore({
      serverContext,
    }),
    plugins,
  });

  return context;
}
