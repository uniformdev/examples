import {
  Context,
  ManifestV2,
  enableContextDevTools,
  enableDebugConsoleLogDrain,
} from "@uniformdev/context";
import { NextCookieTransitionDataStore } from "@uniformdev/context-next";
import { NextPageContext } from "next";
import manifest from "./context-manifest.json";

export function createUniformContext(serverContext?: NextPageContext) {
  return new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new NextCookieTransitionDataStore({
      serverContext,
    }),
    plugins: [enableContextDevTools(), enableDebugConsoleLogDrain("debug")],
  });
}
