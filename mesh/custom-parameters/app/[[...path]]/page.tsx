// IMPORTANT This is SSR-enabled page handler. If you are looking for the SSG-enabled page handler, please use `./page.tsx.ssg-disabled` instead.
import {
  UniformComposition,
  PageParameters,
  retrieveRoute,
  createServerUniformContext,
} from "@uniformdev/canvas-next-rsc";
import { resolveComponent } from "@/uniform/resolve";

export default async function HomePage(props: PageParameters) {
  const route = await retrieveRoute(props);
  const serverContext = await createServerUniformContext({
    searchParams: props.searchParams,
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
