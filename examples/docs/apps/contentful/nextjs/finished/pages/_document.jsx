import Document, {
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link href="/favicon/favicon.ico" rel="icon" />
          <link href="/favicon/apple-touch-icon.png" rel="apple-touch-icon" />
          <meta
            name="description"
            content="UniformConf, a starter site from Uniform"
          />
        </Head>
        <body className="leading-normal tracking-normal text-white gradient">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
