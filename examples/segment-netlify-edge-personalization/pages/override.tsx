import { GetStaticPropsContext } from "next";
import { getCompositionsForNavigation } from "lib/uniform/canvasClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const OverrideAnonymousId = dynamic(
  () => import("@/components/OverrideAnonymousId"),
  {
    ssr: false,
  }
);

const OverridePage = (props) => {
  return (
    <>
      <Navigation navLinks={props.navLinks} />
      <OverrideAnonymousId />
      <Footer />
    </>
  );
};

export default OverridePage;

export async function getStaticProps(context: GetStaticPropsContext) {
  const { preview } = context;
  const navLinks = await getCompositionsForNavigation(preview);
  return {
    props: {
      navLinks,
      preview: preview ?? false,
    },
  };
}
