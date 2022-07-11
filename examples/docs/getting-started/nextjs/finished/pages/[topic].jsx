import Layout from "../src/components/Layout";

import content from "../lib/content.json";

//
//Next.js uses this function to determine the
//dynamic routes this component can handle.
//It should handle all routes that represent
//topics.
export async function getStaticPaths() {
  const topics = content.filter((e) => e.type == "topic");
  const paths = topics.map((e) => {
    return { params: { topic: e.id } };
  });
  return { paths, fallback: false };
}

//
//Since this component supports dynamic routes,
//Next.js uses this function to determine the
//props to use based on the current route.
//This function returns the "fields" values
//from the content file.
export async function getStaticProps({ params }) {
  const topic = content.find((e) => e.id == params.topic);
  return { props: { fields: topic?.fields } };
}

export default function Topic({ fields }) {
  return <Layout content={content} fields={fields} />;
}