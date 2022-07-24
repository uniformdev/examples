import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/style.css";

function MyApp({
  Component,
  pageProps,
}) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
