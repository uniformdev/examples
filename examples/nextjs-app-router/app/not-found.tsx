import { retrieveRoute, UniformComposition } from "@uniformdev/canvas-next-rsc";
import { resolveComponent } from "@/uniform/resolve";

import "./globals.css";

export const metadata = {
  title: "Page not found",
  description: "Page not found",
};

export default async function NotFound() {
  const notFoundProps = { params: { path: "en/404" } };
  const route = await retrieveRoute(notFoundProps);
  return (
    <UniformComposition
      {...notFoundProps}
      route={route}
      resolveComponent={resolveComponent}
      mode="static"
    />
  );
}
