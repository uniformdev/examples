import { enhance, EnhancerBuilder, RouteClient } from "@uniformdev/canvas";

const firstName = "Alex";
const TOKEN = "$first_name";

const replaceInRichTextNode = (node) => {
  let changed = false;
  if (node?.type === "text" && typeof node.text === "string" && node.text.includes(TOKEN)) {
    node.text = node.text.replaceAll(TOKEN, firstName);
    changed = true;
  }
  if (Array.isArray(node?.children)) {
    for (const child of node.children) {
      if (replaceInRichTextNode(child)) changed = true;
    }
  }
  return changed;
};

const firstNameEnhancer = ({ parameter }) => {
  const value = parameter?.value;
  if (typeof value === "string" && value.includes(TOKEN)) {
    return value.replaceAll(TOKEN, firstName);
  }
  if (value && typeof value === "object" && value.root) {
    return replaceInRichTextNode(value.root) ? value : undefined;
  }
  return undefined;
};

export async function getComposition(path) {
  const projectId = process.env.UNIFORM_PROJECT_ID;
  const apiKey = process.env.UNIFORM_API_KEY;

  if (!projectId || !apiKey) {
    throw new Error(
      "Missing Uniform credentials: ensure UNIFORM_PROJECT_ID and UNIFORM_API_KEY are set in your .env file."
    );
  }

  const client = new RouteClient({
    projectId,
    apiKey,
  });

  const response = await client.getRoute({
    path: path ?? "/",
  });

  if (response.type === "composition") {
    const composition = response.compositionApiResponse.composition;
    await enhance({
      composition,
      enhancers: new EnhancerBuilder().parameter(firstNameEnhancer),
      context: { preview: false },
    });
    return composition;
  }

  return null;
}
