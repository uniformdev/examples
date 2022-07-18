import HomeLayout from "../src/components/HomeLayout";

import content from "../content/content.json";

export async function getStaticProps() {
  const slug = "/";
  const topic = content.find((e) => e.url == slug);
  return { props: { fields: topic.fields } };
}

export default function Home({ fields }) {
  return <HomeLayout content={content} fields={fields} />;
}
