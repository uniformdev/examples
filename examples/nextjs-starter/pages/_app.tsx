import { UniformContext } from "@uniformdev/context-react";
import { UniformAppProps } from "@uniformdev/context-next";
import createUniformContext from "lib/uniform/uniformContext";

// IMPORTANT: importing all components registered in Canvas
import "../components/canvasComponents";

import "../styles/styles.css";
import Head from "next/head";
import { RootComponentInstance } from "@uniformdev/canvas";

const clientContext = createUniformContext();

function MyApp({
  Component,
  pageProps,
  serverUniformContext,
}: UniformAppProps<{
  data: RootComponentInstance;
}>) {
  const { data: composition } = pageProps || {};
  const { metaTitle } = composition?.parameters || {};
  return (
    <>
      <Head>
        <title>
          {(metaTitle?.value as string) ?? "Uniform Next.js Starter Kit"}
        </title>
      </Head>
      <UniformContext
        context={serverUniformContext ?? clientContext}
        outputType={"standard"}
        // enable for edge-side rendering (will need a special context-edge npm package)
        //outputType={"edge"}
      >
        <Component {...pageProps} />
      </UniformContext>
    </>
  );
}

export default MyApp;
