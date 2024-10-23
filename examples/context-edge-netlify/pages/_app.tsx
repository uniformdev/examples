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
    // IMPORTANT: needed to wrap the app in UniformContext for the tracker and personalization to work
    <UniformContext context={serverUniformContext ?? clientContext}>
      <div className="leading-normal tracking-normal text-white gradient">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </UniformContext>
  );
}

export default MyApp;
