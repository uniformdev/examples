// IMPORTANT This is SSR-enabled page handler. If you are looking for the SSG-enabled page handler, please use `./page.tsx.ssg-disabled` instead.
import {
  UniformComposition,
  PageParameters,
  ContextUpdateTransfer,
  createServerUniformContext,
} from "@uniformdev/canvas-next-rsc";
import { resolveComponent } from "@/uniform/resolve";
import retrieveRoute from "@/uniform/l18n/localeHelper";

// example component that displays current quirks from Uniform Context tracker
// import { QuirksSetter } from "@/components/quirks-setter";

export default async function HomePage(props: PageParameters) {
  const route = await retrieveRoute(props);
  const serverContext = await createServerUniformContext({
    searchParams: props.searchParams,
  });
  return (
    <>
      {/* example component that sets quirk 'province' server-side with a value */}
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
        serverContext={serverContext}
        mode="server"
      />
      {/* 
      {/* <QuirksSetter /> */}
    </>
  );
}
