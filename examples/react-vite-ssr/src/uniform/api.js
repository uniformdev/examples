import { enhance, EnhancerBuilder, RouteClient } from "@uniformdev/canvas";

const TOKEN = "$first_name";

// Walks a Lexical rich-text tree and replaces token occurrences in text nodes.
// Returns true if anything changed so the caller knows the tree was mutated.
const replaceInRichTextNode = (node, firstName) => {
  let changed = false;
  if (node?.type === "text" && typeof node.text === "string" && node.text.includes(TOKEN)) {
    node.text = node.text.replaceAll(TOKEN, firstName);
    changed = true;
  }
  if (Array.isArray(node?.children)) {
    for (const child of node.children) {
      if (replaceInRichTextNode(child, firstName)) changed = true;
    }
  }
  return changed;
};

// Factory: closes over the resolved firstName so EnhancerBuilder gets a stable
// per-request enhancer. The enhancer's context arg only exposes `preview`, so
// quirks have to be threaded in via closure rather than read from the context.
const makeFirstNameEnhancer = (firstName) => ({ parameter }) => {
  const value = parameter?.value;
  if (typeof value === "string" && value.includes(TOKEN)) {
    return value.replaceAll(TOKEN, firstName);
  }
  if (value && typeof value === "object" && value.root) {
    return replaceInRichTextNode(value.root, firstName) ? value : undefined;
  }
  return undefined;
};

export async function getComposition(path, quirks = {}) {
  // Pull the visitor's first name from the quirks the client persisted to the
  // `ufvdqk` cookie (parsed in server.js). Falls back to empty string on first
  // visits or when the quirk isn't set, which leaves the token visible — a
  // useful signal during development that the cookie roundtrip didn't happen.
  const firstName = quirks.first_name ?? "";
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
      enhancers: new EnhancerBuilder().parameter(makeFirstNameEnhancer(firstName)),
      context: { preview: false },
    });
    return composition;
  }

  return null;
}
