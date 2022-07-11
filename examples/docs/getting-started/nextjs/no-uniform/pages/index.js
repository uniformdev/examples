import Layout from "../src/components/Layout";

import content from "../lib/content.json";

export async function getStaticProps() {
  const slug = "/";
  const topic = content.find((e) => e.url == slug);
  return { props: { fields: topic.fields } };
}

export default function Home({ fields }) {
  return <Layout content={content} fields={fields} />;
}