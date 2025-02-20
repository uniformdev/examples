import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition } from "@uniformdev/canvas-react";
import { Context } from "@uniformdev/context";
import { UniformContext } from "@uniformdev/context-react";
import { manifest } from "./uniform/manifest";

import "./components";

import "./App.css";

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
    <div>
      <UniformContext context={context}>
        <UniformComposition data={data} behaviorTracking="onLoad" />
      </UniformContext>

      {/* We store the composition loaded on the server to use it during rehydration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window._uniformPreloadedComposition = ${JSON.stringify(data)};`,
        }}
      />
    </div>
  );
}

export default App;
