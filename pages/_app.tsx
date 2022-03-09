import { UniformContext } from "@uniformdev/context-react";
import { type UniformAppProps } from "@uniformdev/context-next";
import { createUniformContext } from "../uniformContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/style.css";

import { ToggleEmbeddedContextDevTools } from "@uniformdev/context-devtools";

function MyApp({
  Component,
  pageProps,
  serverUniformContext,
}: UniformAppProps) {
  return (
    <UniformContext context={serverUniformContext || createUniformContext()}>
      <div className="leading-normal tracking-normal text-white gradient">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
      <ToggleEmbeddedContextDevTools
        initialSettings={{
          apiHost: "https://canary.uniform.app",
          // add your own project ID and API key
          apiKey: "",
          projectId: "",
        }}
      />
    </UniformContext>
  );
}

export default MyApp;
