import { ComponentInstance, RootComponentInstance } from "@uniformdev/canvas";
import { DefaultNotImplementedComponent, UniformComposition } from "@uniformdev/canvas-react";
import { Context } from "@uniformdev/context";
import { UniformContext } from "@uniformdev/context-react";
import { manifest } from "./uniform/manifest";

import "./components";

import "./App.css";
import { Component } from "react";
import Page from "./components/Page";
import Hero from "./components/Hero";

declare global {
  interface Window {
    _uniformPreloadedComposition?: RootComponentInstance;
  }
}

// TODO: load the manifest from Uniform
const context = new Context({ manifest: manifest, defaultConsent: true });


function resolveRenderer1(component: ComponentInstance) {
  switch (component.type) {
    case 'page':
      return Page;
    default:
      return DefaultNotImplementedComponent;
  }
}

function resolveRenderer2(component: ComponentInstance) {
  switch (component.type) {
    case 'hero':
      return Hero;
    default:
      return DefaultNotImplementedComponent;
  }
}

function App({ composition }: { composition?: RootComponentInstance } = {}) {
  let data = composition;
  if (typeof window !== "undefined" && window._uniformPreloadedComposition) {
    data = window._uniformPreloadedComposition;
  }

  const compositionType = composition?.type;
  return (
    <div>
      <UniformContext context={context}>
        <UniformComposition
          data={data}
          behaviorTracking="onLoad"
          resolveRenderer={(component) => compositionType === 'page' ? resolveRenderer2(component) : resolveRenderer1(component)}
        />
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
