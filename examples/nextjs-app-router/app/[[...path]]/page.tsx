// IMPORTANT This is SSR-enabled page handler. If you are looking for the SSG-enabled page handler, please use `./page.tsx.ssg-disabled` instead.
import {
  UniformComposition,
  PageParameters,
  createServerUniformContext,
  retrieveRoute,
} from "@uniformdev/canvas-next-rsc";
import { resolveComponent } from "@/uniform/resolve";

// example component that displays current quirks from Uniform Context tracker
// import { QuirksSetter } from "@/components/quirks-setter";

export default async function HomePage(props: PageParameters) {
  const route = await retrieveRoute(props);
  const serverContext = await createServerUniformContext({
    searchParams: await props.searchParams,
  });
  return (
    <UniformComposition
      {...props}
      route={route}
      resolveComponent={resolveComponent}
      serverContext={serverContext}
      mode="server"
    />
  );
}
