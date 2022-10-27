import React from "react";
import "../styles/globals.css";
import { MeshApp } from "@uniformdev/mesh-sdk-react";

function MyApp({ Component, pageProps }) {
  return (
    <MeshApp>
      <Component {...pageProps} />
    </MeshApp>
  );
}

export default MyApp;