import { UniformContext } from "@uniformdev/context-react";
import { type UniformAppProps } from "@uniformdev/context-next";
import { createUniformContext } from "../lib/uniform/uniformContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/style.css";

const clientContext = createUniformContext();

function MyApp({
  Component,
  pageProps,
  serverUniformContext,
}: UniformAppProps) {
  return (
    // IMPORTANT: needed to wrap the app in UniformContext
    <UniformContext
      context={serverUniformContext ?? clientContext}
      outputType={process.env.NODE_ENV === "development" ? "standard" : "edge"}
    >
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </UniformContext>
  );
}

export default MyApp;
