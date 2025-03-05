export type IntegrationSettings = {
    targetProjectId?: string;
}

export type CompositionWorkflowRequestPayload = {
    projectId: string;
    compositionId: string;
    state?: number;
}

export type CompositionWorkflowRequestResult = {
    workflowId?: string;
    workflowStageId?: string;
}

export type CopyCompositionRequestPayload = {
    sourceProjectId: string;
    targetProjectId: string;
    compositionId: string;
    state?: number;
}

export type CopyCompositionRequestResult = {
    success: boolean;
}