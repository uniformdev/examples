import { defineScoutAutomation } from '@uniformdev/automations-sdk';

import { AI_WORKFLOW_ID, TRANSLATION_STAGE_ID } from './lib/workflow';

/**
 * Translates content when it enters the AI Workflow's Translation stage: Scout translates the
 * en-US fields to es-MX, sends the entity for human approval, then notifies.
 *
 * The deployed `publicId` is the filename without extension: `ai-workflow-translator`.
 *
 * @see https://docs.uniform.app/docs/guides/automations/scout-automations
 * @see https://docs.uniform.app/docs/guides/automations/best-practices — workflow stages and loop protection
 */
export default defineScoutAutomation(
  {
    name: 'AI Workflow: Content Translation',
    description: 'Translates content entering the Translation stage to es-MX via Scout and sends it for human approval.',
    triggers: [
      {
        type: 'workflow.transition',
        // Only our workflow's Translation stage; other stages/workflows never create a run.
        filter: `input.newStage.workflowId == "${AI_WORKFLOW_ID}" && input.newStage.stageId == "${TRANSLATION_STAGE_ID}"`,
      },
    ],
    permissions: { role: 'editor' },
  },
  `## Step 1: Translate the content
You are an expert translator.
The content ready for translation is the entity in the preceding trigger payload.
You are responsible for translating all user-facing text fields that have en-US content to es-MX.

## Step 2: Advance the workflow
When finished with translation, always execute the forward workflow transition.

## Step 3: Verify the translation
Read the content back that you translated and evaluate it for accuracy and completeness.

## Step 4: Report the outcome
Send Uniform and Slack notifications via the AI Workflow notification tool, including the entity's name and \`entity.url\` from the trigger payload:
a completed translation on success, or what blocked you if the translation could not be completed.

Reporting your run outcome: report \`failure\` if you could not translate every field that needed it, or could not execute the transition — a partial translation is not a success.`
);
