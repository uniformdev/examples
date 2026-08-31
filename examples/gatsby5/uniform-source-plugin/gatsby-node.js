const {
  CompositionDeliveryClient,
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
} = require("@uniformdev/canvas");
const { ProjectMapClient } = require("@uniformdev/project-map");

const getUniformEnv = () => {
  const apiKey = process.env.UNIFORM_API_KEY;
  const projectId = process.env.UNIFORM_PROJECT_ID;

  if (!projectId) {
    throw new Error(
      "projectId is not specified. Uniform clients cannot be instantiated"
    );
  }

  return {
    apiKey,
    projectId,
    apiHost: process.env.UNIFORM_CLI_BASE_URL || "https://uniform.app",
    edgeApiHost:
      process.env.UNIFORM_CLI_BASE_EDGE_URL || "https://uniform.global",
  };
};

const getProjectMapClient = () => {
  const { apiKey, apiHost, projectId } = getUniformEnv();

  return new ProjectMapClient({
    apiKey,
    apiHost,
    projectId,
  });
};

const getCompositionClient = () => {
  const { apiKey, edgeApiHost, projectId } = getUniformEnv();

  return new CompositionDeliveryClient({
    apiKey,
    edgeApiHost,
    projectId,
  });
};

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
}) => {
  const { createNode } = actions;

  const { compositions } = await getCompositionClient().list({
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  });

  console.log(
    `${compositions.length} loaded from Uniform Canvas: ` +
      compositions.map((c) => c.composition._slug).join(", ")
  );

  for (let c of compositions) {
    const { nodes } = await getProjectMapClient().getNodes({
      compositionId: c.composition._id,
    });
    const nodePath = nodes?.[0]?.path;
    if (nodePath) {
      createNode({
        ...c,
        id: createNodeId(`Composition-${c.composition._id}`),
        name: c.composition._name,
        slug: nodes?.[0]?.path ?? "",
        componentType: c.composition.type,
        slots: JSON.stringify(c.composition.slots),
        parameters: JSON.stringify(c.composition?.parameters),
        internal: {
          type: "Compositions",
          contentDigest: createContentDigest(c),
        },
      });
    } else {
      console.warn(
        `Uniform: Project Map node for composition ${c.composition._id} could not be found, so this node was removed from gatsby schema.`
      );
    }
  }
};
