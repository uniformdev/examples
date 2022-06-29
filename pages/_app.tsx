import { UniformContext } from "@uniformdev/context-react";
import { type UniformAppProps } from "@uniformdev/context-next";
import { createUniformContext } from "../lib/uniform/uniformContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/style.css";

import { ToggleEmbeddedContextDevTools } from "@uniformdev/context-devtools";

const clientContext = createUniformContext();

function MyApp({
  Component,
  pageProps,
  serverUniformContext,
}: UniformAppProps) {
  return (
    // IMPORTANT: needed to wrap the app in UniformContext
    <UniformContext context={serverUniformContext ?? clientContext} outputType="edge">
      <>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </>
      <ToggleEmbeddedContextDevTools
        initialSettings={{
          apiHost: "https://uniform.app",
          apiKey: process.env.UNIFORM_API_KEY,
          projectId: process.env.UNIFORM_PROJECT_ID,
        }}
      />
    </UniformContext>
  );
}

export default MyApp;
