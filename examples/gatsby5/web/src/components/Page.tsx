import * as React from "react";
import { Layout } from "./Layout";

// import { UniformContext } from "@uniformdev/context-react";
// import { Context, enableContextDevTools } from "@uniformdev/context";
// import manifest from "../../uniform-manifest.json";

// export const context = new Context({
//   defaultConsent: true,
//   plugins: [enableContextDevTools()],
//   manifest,
// });

export const PageComponent = (props: any) => {
  return (
    <Layout>
      <div className="container mx-auto">{props.children}</div>
    </Layout>
  );
};
