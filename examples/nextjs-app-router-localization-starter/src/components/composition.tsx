import { UniformComposition } from "@uniformdev/canvas-next-rsc";
import { notFound } from "next/navigation";
import { resolveComponent } from "@/lib/uniform/componentResolver";
import { getRouteData } from "@/lib/uniform/utils";

export default async function Composition(params: {
  locale: string;
  path: string[];
}) {
  const { path } = params;
  const route = await getRouteData(params);
  if (
    route.type === "notFound" ||
    (route.type === "composition" &&
      route.compositionApiResponse.errors?.some((e) => e.type === "data"))
  ) {
    // if we got data errors, we could not resolve a data resource and we choose to return a 404 instead of partial content
    // eslint-disable-next-line no-console
    console.log("Returning 404 because data errors: ", {
      path,
      route,
    });
    return notFound();
  }

  return (
    <UniformComposition
      mode="static"
      resolveComponent={resolveComponent}
      route={route}
      params={{ path: Array.isArray(path) ? path.join("/") : path }}
    />
  );
}
