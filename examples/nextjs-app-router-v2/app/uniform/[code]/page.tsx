import {
  resolveRouteFromCode,
  UniformComposition,
  UniformPageParameters,
  createUniformStaticParams,
} from "@uniformdev/canvas-next-rsc-v2";
import { notFound } from "next/navigation";

import { resolveComponent } from "@/components/resolveComponent";

// enables ISR
export const generateStaticParams = async () => {
  return createUniformStaticParams({
    paths: ["/"],
  });
};

export default async function UniformPage(props: UniformPageParameters) {
  const result = await resolveRouteFromCode(props);

  if (!result.route) {
    notFound();
  }

  return <UniformComposition {...result} resolveComponent={resolveComponent} />;
}
