import { Hero } from "../components/Hero";
import { Personalize } from '@uniformdev/context-react';
import { fetchVariations } from "../lib/cf/fetch";

export async function getStaticProps() {
  const variations = await fetchVariations("29zgaRj1vU1idUq3ydCQeU");
  return {
    props: { variations }
  }
}

export default function Home({ variations }) {
  return (
    <Personalize
        variations={variations}
        name="heroPersonalized"
        component={Hero}
    />
  );
};
