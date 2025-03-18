/* eslint no-console: 0 */
import {
  TranslationPayload,
  collectTranslationPayload,
  getCompositionForTranslation,
  getEntryForTranslation,
} from '@uniformdev/tms-sdk';
import { Webhook } from "svix";
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { WorkflowTransitionPayload } from '@uniformdev/webhooks';
import {
  CANVAS_DRAFT_STATE,
  CanvasClient,
  ContentClient,
  EntryData,
  RootComponentInstance,
} from '@uniformdev/canvas';
import {
  SmartlingApiClientBuilder,
  SmartlingJobsApi,
  SmartlingJobBatchesApi,
  CreateJobParameters,
  CreateBatchParameters,
  UploadBatchFileParameters,
} from 'smartling-api-sdk-nodejs';

function throwError(msg: string): string {
  throw new Error(msg);
}

const uniformApiKey = process.env.UNIFORM_API_KEY ?? throwError('no UNIFORM_API_KEY');
const uniformApiHost = process.env.UNIFORM_CLI_BASE_URL;
const uniformSourceLocale = process.env.UNIFORM_SOURCE_LOCALE ?? throwError('no UNIFORM_SOURCE_LOCALE');
const uniformSmartlingWebhookCallbackUrl =
  process.env.SMARTLING_WEBHOOK_URL ?? throwError('no SMARTLING_WEBHOOK_URL');
const uniformToSmartlingLanguageMap =
  process.env.UNIFORM_TO_SMARTLING_LOCALE_MAPPING ?? throwError('no UNIFORM_TO_SMARTLING_LOCALE_MAPPING');
const uniformSvixSecret = process.env.SVIX_SECRET ?? throwError('no SVIX_SECRET');

const smartlingUserId = process.env.SMARTLING_USER_ID ?? throwError('no SMARTLING_USER_ID');
const smartlingUserSecret = process.env.SMARTLING_USER_SECRET ?? throwError('no SMARTLING_USER_SECRET');
const smartlingProjectId = process.env.SMARTLING_PROJECT_ID ?? throwError('no SMARTLING_PROJECT_ID');

const uniformWorkflowStageIdReadyForTranslations =
  process.env.WORKFLOW_LOCKED_FOR_TRANSLATION_STAGE_ID ??
  throwError('no WORKFLOW_LOCKED_FOR_TRANSLATION_STAGE_ID');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const headers = req.headers as Record<string, string>;
  const wh = new Webhook(uniformSvixSecret);
  try {
    wh.verify(JSON.stringify(req.body), headers);
    console.log('payload verified')
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(
        JSON.stringify({ reason: "webhook payload was not verified", err })
      );
    return;
  }

  const apiBuilder = new SmartlingApiClientBuilder()
    .setBaseSmartlingApiUrl('https://api.smartling.com')
    .authWithUserIdAndUserSecret(smartlingUserId, smartlingUserSecret);

  // You can find full payload structure under Uniform Project -> Settings -> Webhooks => Event Catalog
  const payloadObject: WorkflowTransitionPayload = req.body;

  if (!payloadObject.newStage) {
    throw new Error("No newStage data in payloadObject: " + JSON.stringify(payloadObject));
  }

  if (payloadObject.newStage.stageId === uniformWorkflowStageIdReadyForTranslations) {
    const { entity, translationEntityType } = await resolveUniformEntityFromWebhook(payloadObject);

    if (!entity || !translationEntityType) {
      console.log(`skip: can not find Uniform entity: ${translationEntityType} (${payloadObject.entity.id})`);

      res.status(400).json('error: can not find Uniform entity');
      return;
    }
    const uniformMappedLocales = JSON.parse(uniformToSmartlingLanguageMap) as Record<string, string>;

    const translationPayloads: { payload: TranslationPayload; fileUri: string; targetLocale: string }[] = [];
    for (const uniformLanguage of Object.keys(uniformMappedLocales)) {
      if (uniformLanguage === uniformSourceLocale) {
        continue;
      }

      const {
        payload: translationPayload,
        errorKind,
        errorText,
      } = collectTranslationPayload({
        uniformProjectId: payloadObject.project.id,
        uniformSourceLocale: uniformSourceLocale,
        uniformTargetLocale: uniformLanguage,
        uniformReleaseId: payloadObject.entity.releaseId,
        targetLang: uniformMappedLocales[uniformLanguage],
        entity: entity,
        entityType: translationEntityType,
      });

      if (translationPayload) {
        const hasContentToTranslate = Object.keys(translationPayload.components).length > 0;

        if (hasContentToTranslate) {
          console.log(`translation for ${uniformLanguage} is ready`);
          translationPayloads.push({
            payload: translationPayload,
            fileUri: `${getJobNamePrefix({
              entityId: payloadObject.entity.id,
              entityType: payloadObject.entity.type === 'component' ? 'composition' : 'entry',
              slug: payloadObject.entity.name,
              projectId: payloadObject.project.id,
            })}__${uniformLanguage}__${new Date().toISOString()}.json`,
            targetLocale: uniformMappedLocales[uniformLanguage],
          });
        } else {
          console.warn('nothing to translate');
        }
      } else {
        console.error(`error: ${errorKind} - ${errorText}`);
      }
    }
    const jobClient = apiBuilder.build(SmartlingJobsApi);

    const params = new CreateJobParameters({
      jobName: `${getJobNamePrefix({
        entityId: payloadObject.entity.id,
        entityType: payloadObject.entity.type,
        slug: payloadObject.entity.name,
        projectId: payloadObject.project.id,
      })}__${new Date().toISOString()}`,
      targetLocaleIds: Object.values(uniformMappedLocales),
      callbackUrl: uniformSmartlingWebhookCallbackUrl,
      callbackMethod: 'GET',
    });

    const createdJob = await jobClient.createJob(smartlingProjectId, params);

    console.log(`Translation job was created: ${createdJob.translationJobUid}`);

    if (!createdJob) {
      throw 'Failed to create job';
    }

    const jobBatchesClient = apiBuilder.build(SmartlingJobBatchesApi);
    const batchParams = new CreateBatchParameters({
      translationJobUid: createdJob.translationJobUid,
      authorize: 'true',
    });
    for (const { fileUri } of translationPayloads) {
      batchParams.addFileUri(fileUri);
    }
    const batch = await jobBatchesClient.createBatch(smartlingProjectId, batchParams);
    console.log(`Batch was created: ${batch.batchUid}`);
    if (!batch) {
      throw 'Failed to create batch';
    }

    const filesUploadClient = apiBuilder.build(SmartlingJobBatchesApi);

    for (const { payload, fileUri, targetLocale } of translationPayloads) {
      const filePath = path.join(os.tmpdir(), `translation-${v4()}.json`);

      fs.writeFileSync(filePath, JSON.stringify({ ...smartlingJsonPayloadSettings, ...payload }));

      const fileUploadParameters = new UploadBatchFileParameters({
        fileUri,
        fileType: 'json',
        file: fs.createReadStream(filePath),
        authorize: 'true',
        localeIdsToAuthorize: [targetLocale],
      });

      const success = await filesUploadClient.uploadBatchFile(
        smartlingProjectId,
        batch.batchUid,
        fileUploadParameters
      );

      if (success) {
        console.log(`File ${fileUri} was uploaded`);
      }
    }

    res.status(200).json('ok');
  } else {
    console.log(
      `skip: stage is different (${payloadObject.newStage.stageId} !== ${uniformWorkflowStageIdReadyForTranslations})`
    );
    res.status(200).send('ok');
  }
}

const resolveUniformEntityFromWebhook = async (
  payload: WorkflowTransitionPayload
): Promise<{
  translationEntityType: TranslationPayload['metadata']['entityType'];
  entity?: RootComponentInstance | EntryData;
}> => {
  if (payload.entity.type === 'component') {
    const canvasClient = new CanvasClient({
      apiKey: uniformApiKey,
      projectId: payload.project.id,
      apiHost: uniformApiHost,
      bypassCache: true,
    });

    const compositionOrPattern = await getCompositionForTranslation({
      canvasClient,
      compositionId: payload.entity.id,
      releaseId: payload.entity.releaseId,
      state: CANVAS_DRAFT_STATE,
    });

    if (compositionOrPattern) {
      return {
        entity: compositionOrPattern.composition,
        translationEntityType: compositionOrPattern.pattern ? 'componentPattern' : 'composition',
      };
    }

    return { translationEntityType: 'composition' };
  } else {
    const contentClient = new ContentClient({
      apiKey: uniformApiKey,
      projectId: payload.project.id,
      apiHost: uniformApiHost,
      bypassCache: true,
    });

    // NOTE: entityType === "entry" for both entry and entry pattern
    const entry = await getEntryForTranslation({
      contentClient,
      entryId: payload.entity.id,
      releaseId: payload.entity.releaseId,
      state: CANVAS_DRAFT_STATE,
      pattern: false,
    });

    if (entry) {
      return {
        entity: entry.entry,
        translationEntityType: 'entry',
      };
    }

    const entryPattern = await getEntryForTranslation({
      contentClient,
      entryId: payload.entity.id,
      releaseId: payload.entity.releaseId,
      state: CANVAS_DRAFT_STATE,
      pattern: true,
    });

    if (entryPattern) {
      return {
        entity: entryPattern.entry,
        translationEntityType: 'entryPattern',
      };
    }

    return { translationEntityType: 'entry' };
  }
};

// If you want to see status of jobs in Smartling Integration UI, you have to keep this job name prefix format
export const getJobNamePrefix = ({
  entityId,
  entityType,
  slug,
  projectId,
}: {
  entityId: string;
  entityType: string;
  slug: string;
  projectId: string;
}) => {
  return `${slug}-${entityType}-${entityId}-${projectId}`;
};

const smartlingJsonPayloadSettings = {
  smartling: {
    translate_paths: [
      {
        path: '*/locales/target',
        key: '{*}/locales/target',
      },
      {
        path: '*/locales/target/xml',
        key: '{*}/locales/target/xml',
      },
    ],
    placeholder_format_custom: ['\\$\\{[^\\}]+\\}'],
    variants_enabled: 'true',
  },
};
