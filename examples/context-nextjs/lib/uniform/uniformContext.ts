import {
  Context,
  ManifestV2,
  ContextPlugin,
} from "@uniformdev/context";
import { NextCookieTransitionDataStore } from "@uniformdev/context-next";
import { NextPageContext } from "next";
import manifest from "./context-manifest.json";
import { customLogger } from "./plugins/customLogger/customLogger";

export function createUniformContext(serverContext?: NextPageContext) {
  const plugins: ContextPlugin[] = [
    customLogger()
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
