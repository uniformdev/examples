import { GetStaticPropsContext } from "next";
import { getCompositionsForNavigation } from "lib/uniform/canvasClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventSimulator from "@/components/EventSimulator";

const SimulatorPage = (props) => {
  return (
    <>
      <Navigation navLinks={props.navLinks} />
      <EventSimulator />
      <Footer />
    </>
  );
};

export default SimulatorPage;

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
