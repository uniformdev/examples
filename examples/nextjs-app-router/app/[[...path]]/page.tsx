import {
  ContextUpdateTransfer,
  UniformComposition,
  createServerUniformContext,
  retrieveRoute,
} from "@uniformdev/canvas-next-rsc";
import { resolveComponent } from "@/uniform/resolve";
import { QuirksSetter } from "@/components/QuirksSetter";

export default async function HomePage(props: any) {
  const route = await retrieveRoute(props);
  const serverContext = await createServerUniformContext({
    searchParams: props.searchParams,
  });
  return (
    <>
      <ContextUpdateTransfer
        serverContext={serverContext}
        update={{
          quirks: {
            province: "quebec",
          },
        }}
      />
      <UniformComposition
        {...props}
        route={route}
        resolveComponent={resolveComponent}
        mode="server"
      />
      <QuirksSetter />
    </>
  );
}
