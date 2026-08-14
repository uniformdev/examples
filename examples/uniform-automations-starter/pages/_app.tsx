import type { AppProps } from "next/app";
import { UniformContext } from "@uniformdev/context-react";
import createUniformContext from "@/lib/uniform/uniformContext";

import "../components/canvasComponents";
import "../styles/styles.css";

const clientContext = createUniformContext();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UniformContext context={clientContext}>
      <Component {...pageProps} />
    </UniformContext>
  );
}
