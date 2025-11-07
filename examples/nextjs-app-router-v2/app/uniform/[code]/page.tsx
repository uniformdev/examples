import {
  resolveRouteFromCode,
  UniformComposition,
  UniformPageParameters,
  createUniformStaticParams,
  UniformContext,
} from "@uniformdev/canvas-next-rsc-v2";
import { notFound } from "next/navigation";

import { resolveComponent } from "@/components/resolveComponent";
import { CustomUniformClientContext } from "@/components/CustomUniformClientContext";

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

  return (
    <>
      <UniformContext
        route={result.route}
        clientContextComponent={CustomUniformClientContext}
      />
      <UniformComposition {...result} resolveComponent={resolveComponent} />
    </>
  );
}
