import {
  UniformComposition,
  UniformPageParameters,
  createUniformStaticParams,
  resolveRouteFromCode,
} from "@uniformdev/next-app-router";
import { resolveComponent } from "@/src/components/resolveComponent";
import { CustomUniformClientContext } from "@/src/components/CustomUniformClientContext";

export const generateStaticParams = async () => {
  return createUniformStaticParams({
    // paths: ["/"],
    // Important: for localized sites, you need to add the locales to the paths
    paths: ["/", "/protected"],
  });
};

export default async function UniformPage(props: UniformPageParameters) {
  const { code } = await props.params;
  return (
    <UniformComposition
      code={code}
      resolveRoute={resolveRouteFromCode}
      resolveComponent={resolveComponent}
      clientContextComponent={CustomUniformClientContext}
    />
  );
}
