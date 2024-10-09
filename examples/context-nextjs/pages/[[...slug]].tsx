import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { getPage, pages } from "@cms";
import { ComponentPage, PageProps } from "../components/ComponentPage";

const Home: NextPage<PageProps> = (props: PageProps) => {
  return <ComponentPage {...props} />;
};

export const getStaticProps: GetStaticProps<any> = async (context) => {
  const { params } = context;
  const { slug } = params || {};
  return {
    props: {
      page: await getPage(slug),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: Object.keys(pages), fallback: false };
};

export default Home;
