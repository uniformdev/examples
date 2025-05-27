import { NextRequest } from "next/server";
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  CanvasClient,
} from "@uniformdev/canvas";
import {
  CopyCompositionRequestPayload,
  CopyCompositionRequestResult,
  isExpectedWorkflow,
} from "../../../lib";

export async function POST(request: NextRequest) {
  const payload = await request.json() as CopyCompositionRequestPayload;
  console.log("payload", payload);

  if (
    !payload.sourceProjectId ||
    !payload.targetProjectId ||
    !payload.compositionId
  ) {
    return Response.json({ error: "Invalid payload" }, { status: 500 });
  }

  const sourceCanvasClient = new CanvasClient({
    projectId: payload.sourceProjectId,
    apiKey: process.env.UNIFORM_API_KEY || assert("missing UNIFORM_API_KEY"),
    bypassCache: true,
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
  });

  const targetCanvasClient = new CanvasClient({
    projectId: payload.targetProjectId,
    apiKey: process.env.UNIFORM_API_KEY || assert("missing UNIFORM_API_KEY"),
    bypassCache: true,
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
  });

  const sourceComposition = await sourceCanvasClient.getCompositionById({
    compositionId: payload.compositionId,
    skipDataResolution: true,
    skipOverridesResolution: true,
    skipPatternResolution: true,
    state: payload.state,
  });

  if (!sourceComposition || !isExpectedWorkflow(sourceComposition)) {
    const result: CopyCompositionRequestResult = {
      success: false,
    };
    return Response.json(result);
  }

  // if the target state is PUBLISHED 
  // let's update both DRAFT and PUBLISHED states to avoid conflicts
  // also it allows to ensure that DRAFT state exists
  if (payload.state === CANVAS_PUBLISHED_STATE) {
    await targetCanvasClient.updateComposition({
      ...sourceComposition,
      state: CANVAS_DRAFT_STATE,
    });
  }

  await targetCanvasClient.updateComposition(sourceComposition);

  const result: CopyCompositionRequestResult = {
    success: true,
  };
  return Response.json(result);
}

function assert(msg: string): never {
  throw new Error(msg);
} 