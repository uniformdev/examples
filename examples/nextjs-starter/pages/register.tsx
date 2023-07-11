import { FC } from "react";
import Script from "next/script";
import { RootComponentInstance } from "@uniformdev/canvas";
import { UniformComposition, UniformSlot } from "@uniformdev/canvas-react";
import { withUniformGetStaticProps } from "@uniformdev/canvas-next/route";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";
import { UniformContext } from "@uniformdev/context-react";

import { createUniformContext } from "../lib/uniform/uniformContext";

// IMPORTANT: importing all components registered in Canvas
import "../components/canvasComponents";

export interface RegistrationPage {
  data: RootComponentInstance;
}

const clientContext = createUniformContext();

const RegistrationPage: FC<RegistrationPage> = ({ data: composition }) => {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-281JZDZS6M" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-281JZDZS6M');
        `}
      </Script>
      <UniformContext
        context={clientContext}
        outputType={"edge"}
        // enable for edge-side rendering
        //outputType={"edge"}
      >
        <main className="main">
          <UniformComposition data={composition}>
            <UniformSlot name="content" />
          </UniformComposition>
        </main>
      </UniformContext>
    </>
  );
};

export const getStaticProps = withUniformGetStaticProps({
  // overriding the path to a hard-coded path /register
  modifyPath: () => {
    return "/register";
  },
  // fetching draft composition in dev mode for convenience
  requestOptions: {
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  },
});

export default RegistrationPage;
