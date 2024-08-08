import { Webhook } from "svix";
import type { NextApiRequest, NextApiResponse } from "next";

import { WorkflowTransitionPayload } from '@uniformdev/webhooks';

function throwError(msg: string): string {
  throw new Error(msg);
}

const uniformSvixSecret =
  process.env.SVIX_SECRET ?? throwError("no SVIX_SECRET");
const uniformApiKey =
  process.env.UNIFORM_API_KEY ?? throwError("no UNIFORM_API_KEY");
const uniformApiHost = process.env.UNIFORM_CLI_BASE_URL;

const phraseApiHost =
  process.env.PHRASE_API_HOST ?? throwError("no PHRASE_API_HOST");
const phraseProjectUid =
  process.env.PHRASE_PROJECT_UID ?? throwError("no PHRASE_PROJECT_UID");
const phraseUserName =
  process.env.PHRASE_USER_NAME ?? throwError("no PHRASE_USER_NAME");
const phrasePassword =
  process.env.PHRASE_USER_PASSWORD ?? throwError("no PHRASE_USER_PASSWORD");

import {
  CANVAS_DRAFT_STATE,
  CanvasClient,
  ContentClient,
  EntryData,
  RootComponentInstance,
} from "@uniformdev/canvas";
import { PhraseTmsClient } from "@uniformdev/tms-phrase";
import {
  TranslationPayload,
  collectTranslationPayload,
  getCompositionForTranslation,
  getEntryForTranslation,
} from "@uniformdev/tms-sdk";

const phraseClient = new PhraseTmsClient({
  apiHost: phraseApiHost,
  userName: phraseUserName,
  password: phrasePassword,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload: WorkflowTransitionPayload  = req.body; 
  console.log(new Date().toISOString() + " received payload: " + JSON.stringify(payload, null, 2));

  const headers = req.headers as Record<string, string>;
  const wh = new Webhook(uniformSvixSecret);
  try {
    wh.verify(JSON.stringify(payload), headers);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send(
        JSON.stringify({ reason: "webhook payload was not verified", err })
      );
    return;
  }

  /**
   * If you page retrieval does not depend on the Project Map and only using Composition Slugs
   * you can use the following code to clear the cache
   *
   * await purgeEdgioCache([payload.slug]);
   */

  /**
   * If you are using Project Map tree to retrieve the page path, you can use the following code to clear the cache
   */
  const uniformProjectId =
    payload?.project?.id ?? throwError("no payload?.project?.id");
  const canvasClient = new CanvasClient({
    apiKey: uniformApiKey,
    projectId: uniformProjectId,
    apiHost: uniformApiHost,
    bypassCache: true,
  });

  const contentClient = new ContentClient({
    apiKey: uniformApiKey,
    projectId: uniformProjectId,
    apiHost: uniformApiHost,
    bypassCache: true,
  });

  console.log(" newStage: " + JSON.stringify(payload.newStage, null, 2));

  const uniformWorkflowStageId = process.env.WORKFLOW_LOCKED_FOR_TRANSLATION_STAGE_ID;

  //   "stageId": "f7e3f614-ce89-4eef-ac22-f4f11943ce21",
  //   "stageName": "Content locked for translation",
  if (payload.newStage.stageId !== uniformWorkflowStageId) {
    // eslint-disable-next-line no-console
    console.log(
      `skip: stage is different (${payload.newStage.stageId} !== ${uniformWorkflowStageId})`
    );

    res.status(200).json({ updated: false });
    return;
  }

  console.log("extracting composition for translation");
  
  const { entity: { id: uniformEntityId, type: uniformEntityType, releaseId: uniformReleaseId} } = payload;

  const { entity, translationEntityType } = await resolveUniformEntityFromWebhook({
    canvasClient,
    contentClient,
    entityId: uniformEntityId,
    entityType: uniformEntityType,
    releaseId: uniformReleaseId,
  }) ?? {};

  if (!translationEntityType) {
    res.status(200).json({ updated: false });
    throw new Error("Type not supported: " + uniformEntityType);
  }
  if (!entity) {
    // eslint-disable-next-line no-console
    console.log(`skip: can not find Uniform entity: ${translationEntityType} (${uniformEntityId})`);

    res.status(200).json({ updated: false });
    return;
  }

  const uniformSourceLanguage =
    process.env.UNIFORM_SOURCE_LANGUAGE ??
    throwError("no UNIFORM_SOURCE_LANGUAGE");
  const phraseTargetLanguage =
    process.env.PHRASE_TARGET_LANGUAGE ?? throwError("no PHRASE_TARGET_LANGUAGE");

  const uniformTargetLanguage =
    process.env.UNIFORM_TARGET_LANGUAGE ??
    throwError("no UNIFORM_TARGET_LANGUAGE");

  const {
    payload: translationPayload,
    errorKind,
    errorText,
  } = collectTranslationPayload({
    uniformProjectId: uniformProjectId,
    uniformSourceLocale: uniformSourceLanguage,
    uniformTargetLocale: uniformTargetLanguage,
    uniformReleaseId: uniformReleaseId,
    targetLang: phraseTargetLanguage,
    entity: entity,
    entityType: translationEntityType,
  });

  if (translationPayload) {
    // eslint-disable-next-line no-console
    console.log(
      "sending Uniform entity for translation: " +
        JSON.stringify(translationPayload, null, 2)
    );

    const hasContentToTranslate =
      Object.keys(translationPayload.components).length > 0;

    if (hasContentToTranslate) {
      const jobId = await phraseClient.createTranslationJobFromPayload({
        projectUid: phraseProjectUid,
        payload: translationPayload,
        dueDate: undefined,
        provider: undefined,
      });

      // eslint-disable-next-line no-console
      console.log("job has been created, job uid: " + jobId);
    } else {
      // eslint-disable-next-line no-console
      console.warn("nothing to translate");
    }
  } else if (errorKind) {
    // eslint-disable-next-line no-console
    console.warn(
      "error while collecting translation payload: " + errorText || errorKind
    );
  } else {
    // eslint-disable-next-line no-console
    console.warn("nothing to send");
  }

  res.status(200).json({ updated: true });
}

const resolveUniformEntityFromWebhook = async ({
  canvasClient,
  contentClient,
  entityId,
  entityType,
  releaseId,
}: {
  canvasClient: CanvasClient;
  contentClient: ContentClient;
  entityId: string;
  entityType: string;
  releaseId?: string;
}): Promise<{
  translationEntityType?: TranslationPayload["metadata"]["entityType"];
  entity?: RootComponentInstance | EntryData;
}> => {
  if (entityType === "component") {
    const compositionOrPattern = await getCompositionForTranslation({
      canvasClient,
      compositionId: entityId,
      releaseId: releaseId,
      state: CANVAS_DRAFT_STATE,
    });
    
    if(compositionOrPattern) {
      return { 
        entity: compositionOrPattern.composition, 
        translationEntityType: compositionOrPattern.pattern ? 'componentPattern': 'composition'
      }
    }

    return { translationEntityType: 'composition'};
  } else if(entityType === "entry") {
    // NOTE: entityType === "entry" for both entry and entry pattern
    const entry = await getEntryForTranslation({
      contentClient,
      entryId: entityId,
      releaseId: releaseId,
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
      entryId: entityId,
      releaseId: releaseId,
      state: CANVAS_DRAFT_STATE,
      pattern: true,
    });

    if (entryPattern) {
      return { 
        entity: entryPattern.entry, 
        translationEntityType: 'entryPattern',
      };
    }

    return { translationEntityType: 'entry'};
  }

  return {};
};
