/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../styles/third-party.css";
import "../styles/style.css";
import "../styles/personalization.css";

import { UniformContext } from "@uniformdev/context-react";
import { Context, enableContextDevTools } from "@uniformdev/context";
import manifest from "../contextManifest.json";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const context = new Context({
  manifest,
  defaultConsent: true,
  plugins: [
    enableContextDevTools(),
  ],
});

function MyApp({ Component, pageProps }) {
  return (
    <UniformContext context={context}>
      <Component {...pageProps} />
    </UniformContext>
  );
}

export default MyApp;
