import { UniformContext } from "@uniformdev/context-react";
import { UniformAppProps } from "@uniformdev/context-next";
import createUniformContext from "lib/uniform/uniformContext";

// IMPORTANT: importing all components registered in Canvas
import "../components/canvasComponents";

import "../styles/styles.css";

const clientContext = createUniformContext();

function MyApp({
  Component,
  pageProps,
  serverUniformContext,
}: UniformAppProps) {
  return (
    <UniformContext
      context={serverUniformContext ?? clientContext}
      outputType={"standard"}
      // enable for edge-side rendering (will need a special context-edge npm package)
      //outputType={"edge"}
    >
      <Component {...pageProps} />
    </UniformContext>
  );
}

export default MyApp;
