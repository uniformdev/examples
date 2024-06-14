import {
  Context,
  ManifestV2,
  enableContextDevTools,
  ContextPlugin,
  enableDebugConsoleLogDrain,
  CookieTransitionDataStore,
  // UNIFORM_DEFAULT_COOKIE_NAME,
} from "@uniformdev/context";
import manifest from "./context-manifest.json";

export function createUniformContext() {
  const plugins: ContextPlugin[] = [
    enableContextDevTools(),
    enableDebugConsoleLogDrain("debug"),
  ];

  // TODO: for SSR, get the uniform cookie value from server-side
  // const serverCookieValue = request
  // ? parse(request.headers.get("cookie") ?? "")[UNIFORM_DEFAULT_COOKIE_NAME]
  // : undefined;

  const context = new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new CookieTransitionDataStore({
      serverCookieValue: "",
    }),
    plugins: plugins,
  });

  return context;
}
