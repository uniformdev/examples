import {
  Context,
  ManifestV2,
  enableContextDevTools,
  ContextPlugin,
  enableDebugConsoleLogDrain,
} from "@uniformdev/context";
import { NextCookieTransitionDataStore } from "@uniformdev/context-next";
import { NextPageContext } from "next";
import { enableGoogleGtagAnalytics } from "@uniformdev/context-gtag";

import manifest from "./contextManifest.json";

export function createUniformContext(serverContext?: NextPageContext) {
  const gaPlugin = enableGoogleGtagAnalytics({ emitAll: true });

  const plugins: ContextPlugin[] = [
    gaPlugin,
    enableContextDevTools(),
    enableDebugConsoleLogDrain("debug"),
  ];

  const context = new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new NextCookieTransitionDataStore({
      serverContext,
    }),
    plugins: plugins,
  });

  return context;
}
