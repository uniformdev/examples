import { useEffect } from "react";
import { useRouter } from "next/router";
import getConfig from "next/config";
import { UniformContext } from "@uniformdev/context-react";
import { UniformAppProps } from "@uniformdev/context-next";
import createUniformContext from "lib/uniform/uniformContext";
import Script from "next/script";
import * as snippet from "@segment/snippet";
import { CookiesProvider } from "react-cookie";

import "../styles/styles.css";

const clientContext = createUniformContext();

const DEFAULT_WRITE_KEY = "dNiRpcQyzgWUus5i6FbqLxWj457nsdeQ";

function renderSnippet() {
  const opts = {
    apiKey: process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY || DEFAULT_WRITE_KEY,
    // note: the page option only covers SSR tracking.
    // Page.js is used to track other events using `window.analytics.page()`
    page: true,
  };

  if (process.env.NODE_ENV === "development") {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}

function MyApp({
  Component,
  pageProps,
  serverUniformContext,
}: UniformAppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      console.log({ url, router });
      global.analytics.page({
        path: url,
        referrer: window.location.origin,
        url: window.location.origin + url,
        search: "",
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const {
    serverRuntimeConfig: { outputType },
  } = getConfig();
  return (
    <>
      <Script
        id="segment-script"
        dangerouslySetInnerHTML={{ __html: renderSnippet() }}
      />
      <CookiesProvider>
        <UniformContext
          context={serverUniformContext ?? clientContext}
          outputType={
            process.env.NODE_ENV === "development" ? "standard" : outputType
          }
        >
          <Component {...pageProps} />
        </UniformContext>
      </CookiesProvider>
    </>
  );
}

export default MyApp;
