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
  const client = new RouteClient({
    projectId: "99495eba-c588-4672-89d9-715cca3539f3",
    apiKey:
      "uf18jlavcqyh9y0s7x2zz4q6cg7xvvx8e5n40zyfl6vw76ldqkgywszwnjpze7yzw4upvnknep6fse6nx03l2kr6a72tnr4wy",
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
