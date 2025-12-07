import { useEffect, useState } from "react";

import { CompositionWorkflowRequestPayload, CompositionWorkflowRequestResult, getCompositionWorkflow } from "../lib";

type AsyncState<T> = {
  loading: boolean;
  error: Error | undefined;
  value: T | undefined;
};

export const useGetCompositionWorkflow = (payload: CompositionWorkflowRequestPayload): AsyncState<CompositionWorkflowRequestResult | null> => {
  const [state, setState] = useState<AsyncState<CompositionWorkflowRequestResult | null>>({
    loading: true,
    error: undefined,
    value: undefined,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (!payload.projectId || !payload.compositionId) {
        setState({ loading: false, error: undefined, value: null });
        return;
      }

      setState(prev => ({ ...prev, loading: true }));

      try {
        const result = await getCompositionWorkflow(payload);
        if (!cancelled) {
          setState({ loading: false, error: undefined, value: result });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ loading: false, error: error as Error, value: undefined });
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [payload.projectId, payload.compositionId, payload.state]);

  return state;
};
