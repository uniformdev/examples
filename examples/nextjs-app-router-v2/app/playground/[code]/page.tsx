import {
  createUniformPlaygroundStaticParams,
  PlaygroundParameters,
  UniformPlayground,
} from "@uniformdev/canvas-next-rsc-v2";

import { resolveComponent } from "@/components/resolveComponent";

export const generateStaticParams = async () => {
  return createUniformPlaygroundStaticParams({
    paths: ["/"],
  });
};

export default async function PlaygroundPage({ params }: PlaygroundParameters) {
  const { code } = await params;
  return <UniformPlayground code={code} resolveComponent={resolveComponent} />;
}
