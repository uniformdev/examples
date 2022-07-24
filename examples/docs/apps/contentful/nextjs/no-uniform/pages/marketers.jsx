import { Hero } from "../components/Hero";
import { fetch } from "../lib/cf/fetch";

export async function getStaticProps() {
  const fields = await fetch("1aYuWjIaF3M4eUFYClKINB");
  return { 
    props: { ...fields }
  }
}

export default function Marketers(props) {
  return <Hero {...props} />
};
