import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { enableNextSsr } from "@uniformdev/context-next";
import createUniformContext from "../lib/uniform/uniformContext";

type CustomDocumentProps = DocumentInitialProps & {};

class MyDocument extends Document<CustomDocumentProps> {
  // required to enable SSR personalization
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    //const ip = (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0];
    console.log("headers: ", JSON.stringify(ctx.req.headers, null, 2));

    // TODO: replace
    const geoData = {
      country: "US",
      region: "CA",
      city: "San Francisco",
      postal: "94105",
    };
    // const geoResponse = await fetch(
    //   `https://ipinfo.io/${ip}?token=insert-your-token-here`
    // );
    // const geoData = await geoResponse.json();
    const { country, region, city, postal } = geoData || {};
    const quirks = {
      "country-code": country,
      "region-code": region,
      "postal-code": postal,
      city: city,
    };
    const serverTracker = createUniformContext(ctx);
    await serverTracker.update({
      quirks,
    });
    enableNextSsr(ctx, serverTracker);
    serverTracker.quirks.set;
    return await Document.getInitialProps(ctx);
  }

  render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <main className="main">
            <Main />
          </main>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
