/* eslint no-console: 0 */
import { CanvasClient, ContentClient } from '@uniformdev/canvas';
import { mergeTranslationToUniform } from '@uniformdev/tms-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  SmartlingApiClientBuilder,
  SmartlingJobsApi,
  SmartlingJobBatchesApi,
  ListBatchesParameters,
  SmartlingFilesApi,
  DownloadFileParameters,
  CloseJobParameters,
} from 'smartling-api-sdk-nodejs';

function throwError(msg: string): string {
  throw new Error(msg);
}

const projectId = process.env.SMARTLING_PROJECT_ID || throwError('no SMARTLING_PROJECT_ID');
const userSecret = process.env.SMARTLING_USER_SECRET || throwError('no SMARTLING_USER_SECRET');
const userId = process.env.SMARTLING_USER_ID || throwError('no SMARTLING_USER_ID');

const uniformAPIKey = process.env.UNIFORM_API_KEY || throwError('no UNIFORM_API_KEY');
const uniformCLIBaseUrl = process.env.UNIFORM_CLI_BASE_URL;

// There two env variables are required if you are implementing automated translation via Uniform Workflow
const workflowId = process.env.WORKFLOW_ID ? process.env.WORKFLOW_ID : undefined;
const workflowTranslatedStageId = process.env.WORKFLOW_TRANSLATED_STAGE_ID
  ? process.env.WORKFLOW_TRANSLATED_STAGE_ID
  : undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, translationJobUid } = req.query;

  if (type !== 'job.completed') {
    console.log('We only react on comleted jobs');
    res.status(200).send('We only react on comleted jobs');
    return;
  }

  const apiBuilder = new SmartlingApiClientBuilder()
    .setBaseSmartlingApiUrl('https://api.smartling.com')
    .authWithUserIdAndUserSecret(userId!, userSecret!);

  const jobsClient = apiBuilder.build(SmartlingJobsApi);
  const jobBatchesClient = apiBuilder.build(SmartlingJobBatchesApi);

  const lastBatch = await jobBatchesClient.listBatches(
    projectId,
    new ListBatchesParameters({ translationJobUid, limit: 1, status: 'COMPLETED' })
  );

  const batchInfo = lastBatch.items[0];
  const batchDetails = await jobBatchesClient.getBatchStatus(projectId, batchInfo.batchUid);

  const filesClient = apiBuilder.build(SmartlingFilesApi);

  const translationsStatus: Record<string, boolean> = {};

  for (const fileInfo of batchDetails.files) {
    const downloadParameters = new DownloadFileParameters({ retrievalType: 'published' });
    const file = await filesClient.downloadFile(
      projectId,
      fileInfo.fileUri,
      fileInfo.targetLocales[0].localeId,
      downloadParameters
    );

    try {
      const translationPayload = JSON.parse(file.toString());

      const uniformProjectId = translationPayload.metadata.uniformProjectId;
      const uniformReleaseId = translationPayload.metadata.uniformReleaseId;
      const uniformEntityType = translationPayload.metadata.entityType;
      const uniformEntityId = translationPayload.metadata.entity.id;

      console.log(
        `process translation payload (project: ${uniformProjectId}, release: ${
          uniformReleaseId || 'n/a'
        }, entityType: ${uniformEntityType}, entity: ${uniformEntityId})`
      );

      const canvasClient = new CanvasClient({
        projectId: uniformProjectId,
        apiKey: uniformAPIKey,
        bypassCache: true,
        apiHost: uniformCLIBaseUrl,
      });

      const contentClient = new ContentClient({
        projectId: uniformProjectId,
        apiKey: uniformAPIKey,
        bypassCache: true,
        apiHost: uniformCLIBaseUrl,
      });

      const { translationMerged } = await mergeTranslationToUniform({
        canvasClient,
        contentClient,
        translationPayload,
        updateComposition: async ({ canvasClient, composition }) => {
          console.log('update composition: start');

          const compositionWithWorkflow = ensureWorkflowStage(composition);
          await canvasClient.updateComposition(compositionWithWorkflow);

          console.log('update composition: done');

          return true;
        },
        updateEntry: async ({ contentClient, entry }) => {
          console.log('update entry: start');

          const entryWithWorkflow = ensureWorkflowStage(entry);
          await contentClient.upsertEntry(entryWithWorkflow);

          console.log('update entry: done');

          return true;
        },
        onNotFound: ({ translationPayload }) => {
          const entityType = translationPayload.metadata.entityType;
          const entityId = translationPayload.metadata.entity.id;

          console.log(`skip: can not find ${entityType} (${entityId})`);
        },
        onNotTranslatedResult: ({ updated, errorKind, errorText }) => {
          if (!updated) {
            console.log('Translation has no updates');
          } else if (errorKind !== undefined) {
            console.warn(errorText || 'Unknown error');
          }
        },
      });
      translationsStatus[fileInfo.fileUri] = translationMerged;
    } catch (e) {
      console.error('Error processing file', { exception: e, fileContent: file });
      translationsStatus[fileInfo.fileUri] = false;
    }
  }

  if (Object.keys(translationsStatus).every((key) => translationsStatus[key] === true)) {
    console.log('update job status: start');

    await jobsClient.closeJob(projectId, translationJobUid as string, new CloseJobParameters({}));

    console.log('update job status: done');
  } else {
    console.log(
      'update job status: failed. Not all translations were merged. Failed translations:',
      translationsStatus
    );
  }
  console.log('Smartling Job-Completed Webhook: end');
  res.status(200).json('Ok');
}

const ensureWorkflowStage = <T extends { workflowId?: string; workflowStageId?: string }>(entity: T): T => {
  if (workflowId && workflowTranslatedStageId && entity.workflowId === workflowId) {
    return {
      ...entity,
      workflowStageId: workflowTranslatedStageId,
    };
  }

  return entity;
};
