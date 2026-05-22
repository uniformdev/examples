import {
  UniformComposition,
  UniformPageParameters,
  createUniformStaticParams,
  resolveRouteFromCode,
} from "@uniformdev/next-app-router";
// TODO: Uncomment this to use resolveComponent with cache components support
// import { resolveRouteFromCode } from "@uniformdev/next-app-router/cache";
import { resolveComponent } from "@/components/resolveComponent";
import { CustomUniformClientContext } from "@/lib/uniform/CustomUniformClientContext";

export const generateStaticParams = async () => {
  return createUniformStaticParams({
    // Important: for localized sites, you need to add the locales to the paths
    paths: ["/en"],
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
