import { defineScoutAutomation } from '@uniformdev/automations-sdk';

import { AI_REVIEW_STAGE_ID, AI_WORKFLOW_ID } from './lib/workflow';

/**
 * Reviews content when it enters the AI Workflow's AI Review stage: Scout approves it
 * (→ Translation) or rejects it (→ Editing), notifying on rejection.
 *
 * Deliberately split from `ai-workflow-translator`: an approval transitions the entity into the
 * Translation stage, which fires another `workflow.transition` event. If both stages lived in one
 * automation, that second event would be a *self*-retrigger and cycle protection would abort it.
 * As separate automations, the review automation's transition is dispatched to a *different*
 * automation, so the translation run proceeds normally.
 *
 * The deployed `publicId` is the filename without extension: `ai-workflow-reviewer`.
 *
 * @see https://docs.uniform.app/docs/guides/automations/scout-automations
 * @see https://docs.uniform.app/docs/guides/automations/best-practices — workflow stages and loop protection
 */
export default defineScoutAutomation(
  {
    name: 'AI Workflow: Content Review',
    description: 'Reviews content entering the AI Review stage and approves or rejects it via Scout.',
    triggers: [
      {
        type: 'workflow.transition',
        // Only our workflow's AI Review stage; other stages/workflows never create a run.
        filter: `input.newStage.workflowId == "${AI_WORKFLOW_ID}" && input.newStage.stageId == "${AI_REVIEW_STAGE_ID}"`,
      },
    ],
    permissions: { role: 'editor' },
  },
  `## Step 1: Review the content
You are an expert copy editor responsible for approving or rejecting content edits.
The content ready for your review is the entity in the preceding trigger payload.
You check the en-US content only (as well as non-localized values), and you ignore non-prose content (URLs, dropdown lists, etc).

Check for:
- Completeness: no placeholder/lorem-ipsum/TODO/dummy text, empty fields, or obviously truncated content.
- Coherence: the content makes sense overall and has a consistent message. When something is ambiguous but plausibly intentional, approve.
- Quality: grammar, clarity, etc.

If an issue is unambiguously fixable (e.g. a typo), fix it directly. Any edits you make must not change meaning; if meaning must be changed, reject.

The bar for rejection is high — you must be confident that the content is not appropriate for publication to reject it.

## Step 2: Execute the workflow transition
Execute the Approve or Reject workflow transition on the content entity.

## Step 3: Report the outcome
If you reject the content, first send Uniform and Slack notifications via the AI Workflow notification tool, including the entity's name and \`entity.url\` from the trigger payload.
Lead the message with a concise overall summary, then one bullet point per blocking issue. You must specifically state reasons for rejection.`
);
