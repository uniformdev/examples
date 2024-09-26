import { CanvasClient, ContentClient } from '@uniformdev/canvas';
import { mergeTranslationToUniform, TranslationPayload } from '@uniformdev/tms-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

type TranslationRequestPayload = {
  translationPayload: TranslationPayload;
};

const workflowId = process.env.WORKFLOW_ID ? process.env.WORKFLOW_ID : undefined;
const workflowTranslatedStageId = process.env.WORKFLOW_TRANSLATED_STAGE_ID
  ? process.env.WORKFLOW_TRANSLATED_STAGE_ID
  : undefined;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const payload = req.body as TranslationRequestPayload;
  const translationPayload = payload.translationPayload;

  if (!translationPayload) {
    // eslint-disable-next-line no-console
    console.log('no translation payload');

    res.status(500).json({ updated: false });
    return;
  }

  const uniformProjectId = translationPayload.metadata.uniformProjectId;
  const uniformReleaseId = translationPayload.metadata.uniformReleaseId;
  const uniformEntityType = translationPayload.metadata.entityType;
  const uniformEntityId = translationPayload.metadata.entity.id;

  // eslint-disable-next-line no-console
  console.log(
    `process translation payload (project: ${uniformProjectId}, release: ${
      uniformReleaseId || 'n/a'
    }, entityType: ${uniformEntityType}, entity: ${uniformEntityId})`
  );

  const canvasClient = new CanvasClient({
    projectId: uniformProjectId,
    apiKey: process.env.UNIFORM_API_KEY || assert('missing UNIFORM_API_KEY'),
    bypassCache: true,
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
  });

  const contentClient = new ContentClient({
    projectId: uniformProjectId,
    apiKey: process.env.UNIFORM_API_KEY || assert('missing UNIFORM_API_KEY'),
    bypassCache: true,
    apiHost: process.env.UNIFORM_CLI_BASE_URL,
  });

  const { translationMerged } = await mergeTranslationToUniform({
    canvasClient,
    contentClient,
    translationPayload,
    updateComposition: async ({ canvasClient, composition }) => {
      // eslint-disable-next-line no-console
      console.log('update composition: start');

      const compositionWithWorkflow = ensureWorkflowStage(composition);
      await canvasClient.updateComposition(compositionWithWorkflow);

      // eslint-disable-next-line no-console
      console.log('update composition: done');

      return true;
    },
    updateEntry: async ({ contentClient, entry }) => {
      // eslint-disable-next-line no-console
      console.log('update entry: start');

      const entryWithWorkflow = ensureWorkflowStage(entry);
      await contentClient.upsertEntry(entryWithWorkflow);

      // eslint-disable-next-line no-console
      console.log('update entry: done');

      return true;
    },
    onNotFound: ({ translationPayload }) => {
      const entityType = translationPayload.metadata.entityType;
      const entityId = translationPayload.metadata.entity.id;

      // eslint-disable-next-line no-console
      console.log(`skip: can not find ${entityType} (${entityId})`);
    },
    onNotTranslatedResult: ({ updated, errorKind, errorText }) => {
      if (errorKind !== undefined) {
        // eslint-disable-next-line no-console
        console.warn(errorText || 'Unknown error');
      } else if (!updated) {
        // eslint-disable-next-line no-console
        console.log('Translation has no updates');
      }
    },
  });

  res.status(200).json({ updated: translationMerged });
};

const ensureWorkflowStage = <T extends { workflowId?: string; workflowStageId?: string }>(entity: T): T => {
  if (workflowId && workflowTranslatedStageId && entity.workflowId === workflowId) {
    return {
      ...entity,
      workflowStageId: workflowTranslatedStageId,
    };
  }

  return entity;
};

function assert(msg: string): never {
  throw new Error(msg);
}
