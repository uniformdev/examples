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
}: UniformAppProps) {
  return (
    <UniformContext
      context={clientContext}>
      <Component {...pageProps} />
    </UniformContext>
  );
}

export default MyApp;
