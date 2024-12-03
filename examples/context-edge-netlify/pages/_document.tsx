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

type GeoData = {
  city?: string;
  country?: {
    code: string;
    name: string;
  };
  subdivision?: {
    code: string;
    name: string;
  };
  timezone?: string;
  latitude?: string;
  longitude?: string;
  postal_code?: string;
};

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const geoData = ctx.req?.headers?.["x-nf-geo"];
    let geo: GeoData = {};
    if (geoData) {
      geo = JSON.parse(
        Buffer.from(geoData as string, "base64").toString("utf-8")
      );
    }

    const geoQuirks = {
      city: geo.city ?? "",
      country: geo.country?.code ?? "",
      state: geo.subdivision?.code ?? "",
      zip: geo.postal_code ?? "",
    };

    console.log({ geoQuirks });

    const serverTracker = createUniformContext(ctx);
    await serverTracker.update({
      quirks: geoQuirks,
    });
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
