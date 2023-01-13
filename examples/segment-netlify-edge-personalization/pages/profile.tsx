import { GetStaticPropsContext } from "next";
import { getCompositionsForNavigation } from "lib/uniform/canvasClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Profile from "@/components/Profile";

const ProfilePage = (props) => {
  return (
    <>
      <Navigation navLinks={props.navLinks} />
      <Profile />
      <Footer />
    </>
  );
};

export default ProfilePage;

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
