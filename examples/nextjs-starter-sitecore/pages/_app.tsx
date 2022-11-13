import getConfig from "next/config";
import { UniformContext } from "@uniformdev/context-react";
import { UniformAppProps } from "@uniformdev/context-next";
import createUniformContext from "lib/uniform/uniformContext";

import "../styles/styles.css";

const clientContext = createUniformContext();

function MyApp({
  Component,
  pageProps,
  serverUniformContext,
}: UniformAppProps) {
  const {
    serverRuntimeConfig: { outputType },
  } = getConfig();
  return (
    <UniformContext
      context={serverUniformContext ?? clientContext}
      outputType={
        process.env.NODE_ENV === "development" ? "standard" : outputType
      }
    >
      <Component {...pageProps} />
    </UniformContext>
  );
}

export default MyApp;
