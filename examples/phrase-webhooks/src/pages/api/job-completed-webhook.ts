import { CanvasClient, ContentClient } from '@uniformdev/canvas';
import { PhraseTmsClient, PhraseWebhookPayload } from '@uniformdev/tms-phrase';
import { mergeTranslationToUniform, TranslationPayload } from '@uniformdev/tms-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const phraseClient = new PhraseTmsClient({
  apiHost: process.env.PHRASE_API_HOST || assert('missing PHRASE_API_HOST'),
  userName: process.env.PHRASE_USER_NAME || assert('missing PHRASE_USER_NAME'),
  password: process.env.PHRASE_USER_PASSWORD || assert('missing PHRASE_USER_PASSWORD'),
});

const workflowId = process.env.WORKFLOW_ID ? process.env.WORKFLOW_ID : undefined;
const workflowTranslatedStageId = process.env.WORKFLOW_TRANSLATED_STAGE_ID
  ? process.env.WORKFLOW_TRANSLATED_STAGE_ID
  : undefined;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // eslint-disable-next-line no-console
  console.log('jobWebhook - body', JSON.stringify(req.body, null, 2));

  const token = req.headers['x-memsource-token'];

  if (token !== process.env.PHRASE_WEBHOOK_SECRET_TOKEN) {
    // eslint-disable-next-line no-console
    console.log('Secret token is invalid');
    res.status(403).json({ message: 'Secret token is invalid' });
    return;
  }

  const payload = req.body as PhraseWebhookPayload;

  if (payload.event !== 'JOB_STATUS_CHANGED') {
    // eslint-disable-next-line no-console
    console.log(`skip: event !== 'JOB_STATUS_CHANGED'`);

    res.status(200).json({ updated: false });
    return;
  }

  const job = payload.jobParts.at(0);

  if (!job || !shouldProcessJob(job)) {
    res.status(200).json({ updated: false });
    return;
  }

  const translationPayload = job.uid
    ? await phraseClient.downloadTargetFile<TranslationPayload>({
        projectUid: job.project.uid,
        jobUid: job.uid,
      })
    : null;

  if (!translationPayload) {
    // eslint-disable-next-line no-console
    console.log('skip: no translation payload');

    res.status(200).json({ updated: false });
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

  if (translationMerged) {
    // eslint-disable-next-line no-console
    console.log('update job status: start');

    await phraseClient.setJobStatus({
      projectUid: job.project.uid,
      jobUid: job.uid,
      jobStatus: 'DELIVERED',
    });

    // eslint-disable-next-line no-console
    console.log('update job status: done');
  }

  res.status(200).json({ updated: translationMerged });
};

const shouldProcessJob = (job: PhraseWebhookPayload['jobParts'][number]): boolean => {
  if (job.status !== 'COMPLETED_BY_LINGUIST') {
    // eslint-disable-next-line no-console
    console.log('skip: job status !== COMPLETED_BY_LINGUIST');

    return false;
  }

  const phraseProjectUid = job.project.uid;

  if (!process.env.PHRASE_PROJECT_UID || phraseProjectUid !== process.env.PHRASE_PROJECT_UID) {
    if (!process.env.PHRASE_PROJECT_UID) {
      // eslint-disable-next-line no-console
      console.log(`skip: missing 'PHRASE_PROJECT_UID' env`);
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `skip: Phrase project id mismatch (expected: ${process.env.PHRASE_PROJECT_UID}, current: ${phraseProjectUid})`
      );
    }

    return false;
  }

  return true;
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
