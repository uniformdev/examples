import "./src/styles/global.css";
import { UniformContext } from "@uniformdev/context-react";
import {
  Context,
  enableContextDevTools,
  ManifestV2,
} from "@uniformdev/context";
import manifest from "./uniform-manifest.json";
import { GatsbyBrowser } from "gatsby";
import * as React from "react";

const context = new Context({
  defaultConsent: true,
  plugins: [enableContextDevTools()], // Use this to enable the Chrome plugin
  manifest: manifest as ManifestV2,
});

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = ({
  element,
}) => {
  return (
    <UniformContext context={context} outputType={"standard"}>
      {element}
    </UniformContext>
  );
};
