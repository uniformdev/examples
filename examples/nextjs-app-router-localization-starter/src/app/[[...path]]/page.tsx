import {
  PageParameters,
  retrieveRoute,
  UniformComposition,
} from "@uniformdev/canvas-next-rsc";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { resolveComponent } from "@/lib/uniform/componentResolver";

// Enable for the SSR at the edge along with the "server" mode
// export const runtime = "edge";

export async function generateMetadata(
  props: PageParameters
): Promise<Metadata> {
  const route = await retrieveRoute(props);

  if (route.type !== "composition") {
    return notFound();
  }

  const metaTitleParameter = route.compositionApiResponse?.composition
    .parameters?.metaTitle?.value as string | undefined;

  return {
    title: metaTitleParameter ?? "",
  };
}

export default async function Home(props: PageParameters) {
  const route = await retrieveRoute(props);

  if (
    route.type === "notFound" ||
    (route.type === "composition" &&
      route.compositionApiResponse.errors?.some((e) => e.type === "data"))
  ) {
    // if we got data errors, we could not resolve a data resource and we choose to return a 404 instead of partial content
    // eslint-disable-next-line no-console
    console.log("Returning 404 because data errors");
    return notFound();
  }

  return (
    <UniformComposition
      {...props}
      resolveComponent={resolveComponent}
      mode="server"
      route={route}
    />
  );
}
