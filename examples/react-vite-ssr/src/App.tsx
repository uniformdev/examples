import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition } from "@uniformdev/canvas-react";
import { Context, enableContextDevTools } from "@uniformdev/context";
import { UniformContext } from "@uniformdev/context-react";
import { manifest } from "./uniform/manifest";
import { jsonRulesPlugin } from "./uniform/jsonRulesPlugin";
import { useLoadVisitorFacts } from "./uniform/factsLoader";

import "./components";

import "./App.css";
import { resolveRenderer } from "./components";

declare global {
  interface Window {
    _uniformPreloadedComposition?: RootComponentInstance;
  }
}

// TODO: load the manifest from Uniform
const context = new Context({
  manifest: manifest,
  defaultConsent: true,
  // enableContextDevTools is what posts the `uniform:context:hello` handshake
  // that activates the Uniform Context Chrome extension. Detection is algorithm-
  // agnostic — the extension only needs this plugin registered to attach.
  plugins: [jsonRulesPlugin, enableContextDevTools()],
});

function AppInner({ composition }: { composition?: RootComponentInstance }) {
  useLoadVisitorFacts();
  return (
    <UniformComposition
      data={composition}
      behaviorTracking="onLoad"
      resolveRenderer={resolveRenderer}
    />
  );
}

function App({ composition }: { composition?: RootComponentInstance } = {}) {
  let data = composition;
  if (typeof window !== "undefined" && window._uniformPreloadedComposition) {
    data = window._uniformPreloadedComposition;
  }

  return (
    <UniformContext context={context}>
      <AppInner composition={data} />
    </UniformContext>
  );
}

export default App;
