import {
  UniformComposition,
  PageParameters,
  retrieveRoute,
} from "@uniformdev/canvas-next-rsc";
import { resolveComponent } from "@/uniform/resolve";

// TODO: Uncomment this to enable static site generation mode
// export { generateStaticParams } from '@uniformdev/canvas-next-rsc';

export const runtime = "edge";

export default async function HomePage(props: PageParameters) {
  const route = await retrieveRoute(props);
  return (
    <UniformComposition
      {...props}
      route={route}
      resolveComponent={resolveComponent}
      // TODO: change mode to "static" to enable static site generation
      // mode="static"
      mode="server"
    />
  );
}

// TODO: Uncomment this when static site generation is enabled
// export const dynamic = 'force-static';