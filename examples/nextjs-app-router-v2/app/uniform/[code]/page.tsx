import {
  UniformComposition,
  UniformPageParameters,
  createUniformStaticParams,
} from "@uniformdev/canvas-next-rsc-v2";

import { resolveComponent } from "@/components/resolveComponent";
import { CustomUniformClientContext } from "@/components/CustomUniformClientContext";

export const generateStaticParams = async () => {
  return createUniformStaticParams({
    paths: ["/"],
    // Important: for localized sites, you need to add the locales to the paths
    // paths: ["/en"],
  });
};

export default async function UniformPage(props: UniformPageParameters) {
  const { code } = await props.params;
  return (
    <UniformComposition
      code={code}
      cacheComponents={true}
      resolveComponent={resolveComponent}
      clientContextComponent={CustomUniformClientContext}
    />
  );
}
