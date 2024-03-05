import type { AppProps } from "next/app";


import "../styles/styles.css";

import "@klevu/ui/dist/klevu-ui/klevu-ui.css";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
