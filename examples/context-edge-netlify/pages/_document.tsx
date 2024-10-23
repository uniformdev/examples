import Document, {
  type DocumentContext,
  type DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { enableNextSsr } from "@uniformdev/context-next";
import { createUniformContext } from "lib/uniform/uniformContext";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const serverTracker = createUniformContext(ctx);
    enableNextSsr(ctx, serverTracker);
    return await Document.getInitialProps(ctx);
  }

  render(): React.ReactElement {
    return (
      <Html lang={"en"}>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
