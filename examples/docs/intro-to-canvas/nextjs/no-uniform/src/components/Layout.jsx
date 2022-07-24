import Head from "next/head";

import Body from "./Body";
import Footer from "./Footer";

export default function Layout({ fields, content }) {
  const { title } = fields;
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body fields={fields} content={content} />
      <Footer />
    </div>
  );
}