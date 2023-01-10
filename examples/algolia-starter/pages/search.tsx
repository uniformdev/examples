import { GetStaticPropsContext } from "next";
import SearchComposition from "@/components/SearchComposition";
import { getCompositionBySlug } from "lib/uniform/canvasClient";
import { RootComponentInstance } from "@uniformdev/canvas";

interface SearchPageProps {
  composition: RootComponentInstance;
}

const SearchPage = (props: SearchPageProps) => SearchComposition(props);

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<{ props: SearchPageProps }> {
  const composition = await getCompositionBySlug("/algolia-demo", context);
  return {
    props: {
      composition,
    },
  };
}

export default SearchPage;
