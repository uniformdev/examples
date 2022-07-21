import {
  Context,
  enableContextDevTools,
  enableDebugConsoleLogDrain,
} from "@uniformdev/context"
import manifest from "./manifest.json"

export function createUniformContext(serverContext) {
  const plugins = [enableContextDevTools(), enableDebugConsoleLogDrain("debug")]

  const context = new Context({
    defaultConsent: true,
    manifest: manifest,
    // transitionStore: new NextCookieTransitionDataStore({
    //   serverContext,
    // }),
    plugins: plugins,
  })

  return context
}
