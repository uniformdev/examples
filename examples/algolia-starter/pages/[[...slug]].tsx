import { GetStaticPropsContext } from "next";
import PageComposition from "@/components/PageComposition";
import {
  getCompositionBySlug,
  getCompositionPaths,
} from "lib/uniform/canvasClient";

const CanvasPage = (props: any) => PageComposition(props);

export default CanvasPage;

export async function getStaticProps(context: GetStaticPropsContext) {
  const { slug } = context?.params || {};
  const slugString = Array.isArray(slug) ? slug.join("/") : slug;
  const { preview = false } = context;
  const slashedSlug = !slugString
    ? "/"
    : slugString.startsWith("/")
    ? slugString
    : `/${slugString}`;
  const composition = await getCompositionBySlug(slashedSlug, context);
  return {
    props: {
      composition,
      preview,
    },
  };
}

export async function getStaticPaths() {
  const paths = await getCompositionPaths();
  console.log({ paths });
  return { paths, fallback: true };
}
