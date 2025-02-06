import {
  UniformComposition,
  PageParameters,
} from "@uniformdev/canvas-next-rsc";
import { resolveComponent } from "@/uniform/resolve";
import retrieveRoute from "@/uniform/l18n/localeHelper";

export { generateStaticParams } from "@uniformdev/canvas-next-rsc";

export default async function HomePage(props: PageParameters) {
  const route = await retrieveRoute(props);
  return (
    <UniformComposition
      {...props}
      route={route}
      resolveComponent={resolveComponent}
      mode="static"
    />
  );
}
