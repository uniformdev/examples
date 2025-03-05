import { NextApiRequest, NextApiResponse } from "next";

import { CanvasClient } from "@uniformdev/canvas";

import { CompositionWorkflowRequestPayload, CompositionWorkflowRequestResult } from "../../lib";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = req.body as CompositionWorkflowRequestPayload;

  if (!payload.compositionId || !payload.projectId) {
    res.status(500).json({ error: "Invalid payload" });
  }

  const canvasClient = new CanvasClient({
    projectId: payload.projectId,
    apiKey: process.env.UNIFORM_API_KEY || assert("missing UNIFORM_API_KEY"),
    bypassCache: true,
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
  });

  const composition = await canvasClient.getCompositionById({
    compositionId: payload.compositionId,
    skipDataResolution: true,
    skipOverridesResolution: true,
    skipPatternResolution: true,
    // OPTION: in case we need workflow definition
    // withWorkflowDefinition: true,
    state: payload.state,
  });

  const result: CompositionWorkflowRequestResult = {
    workflowId: composition?.workflowId,
    workflowStageId: composition?.workflowStageId,
  }

  res.status(200).json(result);
};

function assert(msg: string): never {
  throw new Error(msg);
}
