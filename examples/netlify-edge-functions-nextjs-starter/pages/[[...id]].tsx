import { GetStaticPropsContext } from "next";
import PageComposition from "@/components/PageComposition";
import {
  getCompositionBySlug,
  getCompositionPaths,
  getCompositionsForNavigation,
} from "lib/uniform/canvasClient";

const CanvasPage = (props) => PageComposition(props);
export default CanvasPage;

export async function getStaticProps(context: GetStaticPropsContext) {
  const slug = context?.params?.id;
  const slugString = Array.isArray(slug) ? slug.join("/") : slug;
  const { preview } = context;
  const slashedSlug = !slugString
    ? "/"
    : slugString.startsWith("/")
    ? slugString
    : `/${slugString}`;
  const composition = await getCompositionBySlug(slashedSlug, preview);
  const navLinks = await getCompositionsForNavigation(preview);
  return {
    props: {
      composition,
      navLinks,
      preview: preview ?? false,
    },
  };
}

export async function getStaticPaths() {
  const paths = await getCompositionPaths();
  return { paths, fallback: true };
}
