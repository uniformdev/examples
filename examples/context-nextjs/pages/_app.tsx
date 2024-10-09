import { UniformContext } from "@uniformdev/context-react";
import { type UniformAppProps } from "@uniformdev/context-next";
import { createUniformContext } from "../lib/uniform/uniformContext";

import "../styles/style.css";

import { PageContainer } from "components/PageContainer";

const clientContext = createUniformContext();

function MyApp({ Component, pageProps }: UniformAppProps) {

  return (
    // IMPORTANT: needed to wrap the app in UniformContext for the tracker and personalization to work
    <UniformContext context={clientContext}>
      <PageContainer>
        <Component {...pageProps} />
      </PageContainer>
    </UniformContext>
  );
}

export default MyApp;
