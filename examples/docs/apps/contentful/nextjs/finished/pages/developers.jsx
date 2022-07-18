import { Hero } from "../components/Hero";
import { fetch } from "../lib/cf/fetch";

export async function getStaticProps() {
  const fields = await fetch("1bVm4b5RiE9GZt0K57eN8y");
  return { 
    props: { ...fields }
  }
}

export default function Developers(props) {
  return <Hero {...props} />
};
