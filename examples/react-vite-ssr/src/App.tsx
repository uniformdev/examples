import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition } from "@uniformdev/canvas-react";
import { Context } from "@uniformdev/context";
import { UniformContext } from "@uniformdev/context-react";
import { manifest } from "./uniform/manifest";

import "./components";

import "./App.css";
import { resolveRenderer } from "./components";

declare global {
  interface Window {
    _uniformPreloadedComposition?: RootComponentInstance;
  }
}

// TODO: load the manifest from Uniform
const context = new Context({ manifest: manifest, defaultConsent: true });

function App({ composition }: { composition?: RootComponentInstance } = {}) {
  let data = composition;
  if (typeof window !== "undefined" && window._uniformPreloadedComposition) {
    data = window._uniformPreloadedComposition;
  }

  return (
    <UniformContext context={context}>
      <UniformComposition
        data={data}
        behaviorTracking="onLoad"
        resolveRenderer={resolveRenderer}
      />
    </UniformContext>
  );
}

export default App;
