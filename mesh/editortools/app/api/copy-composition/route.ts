import { NextRequest } from "next/server";
import {
  CANVAS_PUBLISHED_STATE,
  CompositionManagementClient,
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

  const sourceCompositionClient = new CompositionManagementClient({
    projectId: payload.sourceProjectId,
    apiKey: process.env.UNIFORM_API_KEY || assert("missing UNIFORM_API_KEY"),
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
  });

  const targetCompositionClient = new CompositionManagementClient({
    projectId: payload.targetProjectId,
    apiKey: process.env.UNIFORM_API_KEY || assert("missing UNIFORM_API_KEY"),
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
  });

  const sourceComposition = await sourceCompositionClient.get({
    compositionId: payload.compositionId,
    state: payload.state,
  });

  if (!sourceComposition || !isExpectedWorkflow(sourceComposition)) {
    const result: CopyCompositionRequestResult = {
      success: false,
    };
    return Response.json(result);
  }

  if (payload.state === CANVAS_PUBLISHED_STATE) {
    await targetCompositionClient.saveAndPublish(sourceComposition);
  } else {
    await targetCompositionClient.save(sourceComposition);
  }

  const result: CopyCompositionRequestResult = {
    success: true,
  };
  return Response.json(result);
}

function assert(msg: string): never {
  throw new Error(msg);
}
