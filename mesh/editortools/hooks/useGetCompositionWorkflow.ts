import { useAsync } from "react-use";

import { CompositionWorkflowRequestPayload, CompositionWorkflowRequestResult, getCompositionWorkflow } from "../lib";

export const useGetCompositionWorkflow = (payload: CompositionWorkflowRequestPayload): ReturnType<
  typeof useAsync<() => Promise<CompositionWorkflowRequestResult | null>>
> => {
  return useAsync(async () => {
    if(!payload.projectId || !payload.compositionId) {
      return null;
    }

    return getCompositionWorkflow(payload);
  }, [payload.projectId, payload.projectId, payload.state]);
};
