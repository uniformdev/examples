import { GetStaticPropsContext } from "next";
import { getCompositionsForNavigation } from "lib/uniform/canvasClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Identify from "@/components/Identify";

const IdentifyPage = (props) => {
  return (
    <>
      <Navigation navLinks={props.navLinks} />
      <Identify />
      <Footer />
    </>
  );
};

export default IdentifyPage;

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
