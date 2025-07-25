import {
  resolveRouteFromCode,
  UniformComposition,
  UniformPageParameters,
} from "@uniformdev/canvas-next-rsc-v2";
import { notFound } from "next/navigation";

import { resolveComponent } from "../../../components/resolveComponent";

// enables ISR
export const generateStaticParams = async () => {
  return [];
};

export default async function UniformPage(props: UniformPageParameters) {
  const result = await resolveRouteFromCode(props);

  if (!result.route) {
    notFound();
  }

  // optional, when used tests and personalizations
  // will only be evaluated here and not on the client
  // await precomputeComposition(result);
  return <UniformComposition {...result} resolveComponent={resolveComponent} />;
}
