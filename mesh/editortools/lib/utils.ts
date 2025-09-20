import {
  CompositionWorkflowRequestPayload,
  CompositionWorkflowRequestResult,
  CopyCompositionRequestPayload,
  CopyCompositionRequestResult,
} from "./types";

export async function getCompositionWorkflow(
  payload: CompositionWorkflowRequestPayload
): Promise<CompositionWorkflowRequestResult | null> {
  const response = await fetch("/api/composition-workflow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as CompositionWorkflowRequestResult;
  return json;
}

export async function copyComposition(
  payload: CopyCompositionRequestPayload
): Promise<boolean> {
  const response = await fetch("/api/copy-composition", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return false;
  }

  const json = (await response.json()) as CopyCompositionRequestResult;
  return !!json?.success;
}

export const isExpectedWorkflow = ({
  workflowId,
  workflowStageId,
}: {
  workflowId?: string;
  workflowStageId?: string;
}) => {
  // TODO: Implement workflow validation
  return true;
};
