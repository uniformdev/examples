import { Hero } from "../components/Hero";
import { fetch } from "../lib/cf/fetch";

export async function getStaticProps() {
  const fields = await fetch("7FqVTULpTtY0AdOUp4n58g");
  return { 
    props: { ...fields }
  }
}

export default function Home(props) {
  return <Hero {...props} />
};
