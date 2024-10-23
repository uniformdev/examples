import type { NextPage } from "next";
import { getPage } from "@cms";
import { ComponentPage, PageProps } from "../components/ComponentPage";

const Home: NextPage<PageProps> = (props: PageProps) => {
  return <ComponentPage {...props} />;
};

export const getServerSideProps = async (context: { params: any }) => {
  const { params } = context;
  const { slug } = params || {};
  return {
    props: {
      page: await getPage(slug),
    },
  };
};

export default Home;
