import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head />
        <body className="leading-normal tracking-normal text-white gradient">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
