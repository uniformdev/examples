import { RegisterForm } from "../components/RegistrationForm";
import { fetch } from "../lib/cf/fetch";

export async function getStaticProps() {
  const fields = await fetch("3cbutsIArBeyssMHGuVuBU");
  return { 
    props: { ...fields }
  }
}

export default function Marketers(props) {
  return <RegisterForm {...props} />
};
