import { RouteClient } from "@uniformdev/canvas";

const DEFAULT_LOCALE = "en";

export async function getComposition(path) {
  const client = new RouteClient({
    projectId: process.env.UNIFORM_PROJECT_ID,
    apiKey: process.env.UNIFORM_API_KEY,
  });

  const response = await client
    .getRoute({
      path: "/:locale" + path,
      locale: DEFAULT_LOCALE,
    })
    .then(response =>
      response.type === "notFound"
        ? client.getRoute({
            path: path,
            locale: DEFAULT_LOCALE,
          })
        : response
    );

  if (response.type === "composition") {
    return response.compositionApiResponse.composition;
  }

  return null;
}
