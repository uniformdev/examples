import {
  Context,
  ManifestV2,
  ContextPlugin,
  enableDebugConsoleLogDrain,
  enableContextDevTools,
  enableUniformInsights,
} from "@uniformdev/context";
import { NextCookieTransitionDataStore } from "@uniformdev/context-next";
import { NextPageContext } from "next";
import manifest from "./contextManifest.json";

export default function createUniformContext(
  serverContext?: NextPageContext
): Context {
  // 30 minutes
  const sessionExpirationInSeconds = 1800;
  const secondsInDay = 60 * 60 * 24;
  const expires = sessionExpirationInSeconds / secondsInDay;
  const plugins: ContextPlugin[] = [
    enableContextDevTools(),
    enableDebugConsoleLogDrain("debug"),
  ];

  if (typeof window !== "undefined" && window.document) {
    plugins.push(
      enableUniformInsights({
        endpoint: {
          apiKey: "",
          type: "api",
          host: window.location.protocol + "//" + window.location.host,
        },
      })
    );
  }

  const context = new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new NextCookieTransitionDataStore({
      serverContext,
      cookieAttributes: {
        expires,
      },
    }),
    plugins: plugins,
    visitLifespan: sessionExpirationInSeconds * 1000,
  });
  return context;
}
