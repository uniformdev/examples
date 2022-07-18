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
import { NextCookieTransitionDataStore } from '@uniformdev/context-next';
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
  transitionStore: new NextCookieTransitionDataStore({}),
});

function MyApp({ Component, pageProps, serverUniformContext }) {
  return (
    <UniformContext context={serverUniformContext ?? context} outputType="edge">
      <Component {...pageProps} />
    </UniformContext>
  );
}

export default MyApp;
