const { CanvasClient, CANVAS_DRAFT_STATE } = require("@uniformdev/canvas");
const { ProjectMapClient } = require("@uniformdev/project-map");
const fetch = require("node-fetch");

const getProjectMapClient = () => {
  const apiKey = process.env.UNIFORM_API_KEY;
  const apiHost = process.env.UNIFORM_CLI_BASE_URL || "https://uniform.app";
  const projectId = process.env.UNIFORM_PROJECT_ID;

  if (!apiHost)
    throw new Error(
      "apiHost is not specified. Project Map client cannot be instantiated"
    );

  if (!projectId)
    throw new Error(
      "projectId is not specified. Project Map client cannot be instantiated"
    );

  return new ProjectMapClient({
    apiKey,
    apiHost,
    projectId,
  });
};

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

  for (let c of compositions) {
    const { nodes } = await getProjectMapClient().getNodes({
      compositionId: c.composition._id,
    });
    createNode({
      ...c,
      id: createNodeId(`Composition-${c.composition._id}`),
      name: c.composition._name,
      slug: nodes?.[0].path,
      componentType: c.composition.type,
      slots: JSON.stringify(c.composition.slots),
      parameters: JSON.stringify(c.composition?.parameters),
      internal: {
        type: "Compositions",
        contentDigest: createContentDigest(c),
      },
    });
  }
};
