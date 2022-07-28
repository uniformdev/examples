import { GetStaticPropsContext } from "next";
import PageComposition from "@/components/PageComposition";
import {
  getCompositionBySlug,
  getCompositionsForNavigation,
} from "lib/uniform/canvasClient";

const CanvasPage = (props) => PageComposition(props);

export default CanvasPage;

export async function getServerSideProps(context: GetStaticPropsContext) {
  const { preview = false } = context;
  const composition = await getCompositionBySlug("/", preview);
  const navLinks = await getCompositionsForNavigation(preview);
  return {
    props: {
      composition,
      navLinks,
      preview,
    },
  };
}
