import { RouteClient } from "@uniformdev/canvas";

export async function getComposition(path) {
  const client = new RouteClient({
    projectId: "99495eba-c588-4672-89d9-715cca3539f3",
    apiKey:
      "uf18jlavcqyh9y0s7x2zz4q6cg7xvvx8e5n40zyfl6vw76ldqkgywszwnjpze7yzw4upvnknep6fse6nx03l2kr6a72tnr4wy",
  });

  const response = await client.getRoute({
    path: path ?? "/",
  });

  if (response.type === "composition") {
    return response.compositionApiResponse.composition;
  }

  return null;
}
