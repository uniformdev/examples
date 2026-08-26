import { RouteClient } from "@uniformdev/canvas";

const projectId = process.env.UNIFORM_PROJECT_ID;
const apiKey = process.env.UNIFORM_API_KEY;
const edgeApiHost = process.env.UNIFORM_EDGE_API_HOST || "https://uniform.global";

const client = new RouteClient({
  projectId,
  apiKey,
  edgeApiHost,
});

export async function getComposition(path) {
  const response = await client.get({ path });

  if (response.type === "composition") {
    return response.compositionApiResponse.composition;
  }

  return null;
}
