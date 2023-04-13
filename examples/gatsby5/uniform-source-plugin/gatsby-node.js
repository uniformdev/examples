const { CanvasClient, CANVAS_DRAFT_STATE } = require("@uniformdev/canvas");
const { enhance, EnhancerBuilder } = require("@uniformdev/canvas");
const fetch = require("node-fetch");

const canvasClient = new CanvasClient({
  apiKey: process.env.UNIFORM_API_KEY,
  apiHost: "https://uniform.app",
  projectId: process.env.UNIFORM_PROJECT_ID,
  fetch: fetch,
});

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
}) => {
  const { createNode } = actions;

  const { compositions } = await canvasClient.getCompositionList({
    skipEnhance: true,
    state: CANVAS_DRAFT_STATE,
  });

  console.log(
    `${compositions.length} loaded from Uniform Canvas: ` +
      compositions.map((c) => c.composition._slug).join(", ")
  );

  compositions.forEach((c) =>
    createNode({
      ...c,
      id: createNodeId(`Composition-${c.composition._id}`),
      name: c.composition._name,
      slug: c.composition._slug,
      componentType: c.composition.type,
      slots: JSON.stringify(c.composition.slots),
      parameters: JSON.stringify(c.composition?.parameters),
      internal: {
        type: "Compositions",
        contentDigest: createContentDigest(c),
      },
    })
  );
  return;
};
