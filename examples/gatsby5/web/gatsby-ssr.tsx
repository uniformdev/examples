/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */
// You can delete this file if you're not using it

// // Doing something similar to Gatsby-browser for SSR data
// import "./src/styles/global.css";
// import { UniformContext } from "@uniformdev/context-react";
// import {
//   Context,
//   enableContextDevTools,
//   ManifestV2,
// } from "@uniformdev/context";
// import manifest from "./uniform-manifest.json";
// import type { GatsbySSR } from "gatsby";
// import * as React from "react";

// const context = new Context({
//   defaultConsent: true,
//   plugins: [enableContextDevTools()], // Use this to enable the Chrome plugin
//   manifest: manifest as ManifestV2,
// });

// export const wrapPageElement: GatsbySSR["wrapPageElement"] = ({ element }) => {
//   return (
//     <UniformContext
//       context={context}
//       outputType={
//         process.env.GATSBY_UNIFORM_OUTPUT_MODE
//           ? process.env.GATSBY_UNIFORM_OUTPUT_MODE
//           : "standard"
//       }
//     >
//       {element}
//     </UniformContext>
//   );
// };
