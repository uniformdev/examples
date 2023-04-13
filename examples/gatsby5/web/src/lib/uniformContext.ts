import {
  Context,
  CookieTransitionDataStore,
  ManifestV2,
  enableContextDevTools,
  enableDebugConsoleLogDrain,
} from "@uniformdev/context";

import manifest from "../../uniform-manifest.json";

export function createUniformContext() {
  const plugins = [
    enableContextDevTools(),
    enableDebugConsoleLogDrain("debug"),
  ];

  const context = new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new CookieTransitionDataStore({}),
    plugins: plugins,
  });

  return context;
}
