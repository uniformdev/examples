import {
  createUniformPlaygroundStaticParams,
  PlaygroundParameters,
  resolvePlaygroundRoute,
  UniformPlayground,
} from "@uniformdev/next-app-router";

import { resolveComponent } from "@/components/resolveComponent";

export const generateStaticParams = async () => {
  return createUniformPlaygroundStaticParams({
    paths: ["/en"],
  });
};

export default async function PlaygroundPage({ params }: PlaygroundParameters) {
  const { code } = await params;
  return (
    <UniformPlayground
      code={code}
      resolveRoute={resolvePlaygroundRoute}
      resolveComponent={resolveComponent}
    />
  );
}
