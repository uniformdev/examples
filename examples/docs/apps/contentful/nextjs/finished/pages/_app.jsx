import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/style.css";

import { 
  Context, 
  enableContextDevTools,
} from "@uniformdev/context";
import { UniformContext } from "@uniformdev/context-react";
import manifest from "../contextManifest.json";

const context = new Context({
  defaultConsent: true,
  manifest,
  plugins: [
    enableContextDevTools(),
  ],
});

function MyApp({
  Component,
  pageProps,
}) {
  return (
    <UniformContext context={context}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </UniformContext>
  );
}

export default MyApp;
