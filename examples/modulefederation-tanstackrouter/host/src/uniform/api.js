import { RouteClient } from "@uniformdev/canvas";

const projectId = process.env.UNIFORM_PROJECT_ID;
const apiKey = process.env.UNIFORM_API_KEY;
const apiHost = process.env.UNIFORM_API_HOST || "https://uniform.app";

const client = new RouteClient({
  projectId,
  apiKey,
  apiHost,
});

export async function getComposition(path) {
  const response = await client.getRoute({ path });

  if (response.type === "composition") {
    return response.compositionApiResponse.composition;
  }

  return null;
}
