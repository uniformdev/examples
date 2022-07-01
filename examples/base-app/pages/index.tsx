import type { GetStaticProps, NextPage } from "next";
import { getPage } from "@cms";
import { ComponentType } from "../lib/models";
import { PersonalizedHero } from "../components/PersonalizedHero";
import { ComponentPage, PageProps } from "../components/ComponentPage";

const componentMapping: Partial<
  Record<ComponentType, React.ComponentType<any>>
> = {
  [ComponentType.PersonalizedHero]: PersonalizedHero,
};

const Home: NextPage<PageProps> = (props) => {
  return <ComponentPage {...props} componentMapping={componentMapping} />;
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return {
    props: {
      page: await getPage("/"),
    },
  };
};

export default Home;
