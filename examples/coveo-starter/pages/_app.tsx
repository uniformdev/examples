import React from "react";
import { UniformAppProps } from "@uniformdev/context-next";
import "../styles/styles.css";
import "../components/canvasComponents";

function App({ Component, pageProps }: UniformAppProps) {
  return <Component {...pageProps} />;
}

export default App;
