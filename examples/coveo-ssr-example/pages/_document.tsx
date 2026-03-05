import { Html, Head, Main, NextScript } from "next/document";
import Document, {
  type DocumentContext,
  type DocumentInitialProps,
} from "next/document";
import { enableNextSsr } from "@uniformdev/context-next";
import { createUniformContext } from "@/lib/uniform/createUniformContext";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const serverTracker = createUniformContext(ctx);
    enableNextSsr(ctx, serverTracker);
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="main">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
