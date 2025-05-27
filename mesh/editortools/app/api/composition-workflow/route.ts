import { NextRequest } from "next/server";
import { CanvasClient } from "@uniformdev/canvas";
import { CompositionWorkflowRequestPayload, CompositionWorkflowRequestResult } from "../../../lib";

export async function POST(request: NextRequest) {
  const payload = await request.json() as CompositionWorkflowRequestPayload;

  if (!payload.compositionId || !payload.projectId) {
    return Response.json({ error: "Invalid payload" }, { status: 500 });
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
    state: payload.state,
  });

  const result: CompositionWorkflowRequestResult = {
    workflowId: composition?.workflowId,
    workflowStageId: composition?.workflowStageId,
  }

  return Response.json(result);
}

function assert(msg: string): never {
  throw new Error(msg);
} 