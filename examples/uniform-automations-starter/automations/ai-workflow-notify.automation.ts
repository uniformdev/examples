import { defineAutomation } from '@uniformdev/automations-sdk';
import * as z from 'zod';
import {
  configuredNotificationRecipients,
  sendUniformNotification,
} from './lib/notifications';
import { notifySlack } from './lib/slack';

/**
 * Notifications for the AI Workflow demo, exposed to Scout as a tool.
 *
 * The two stage automations (`ai-workflow-reviewer`, `ai-workflow-translator`) are Scout automations:
 * they have no code, so they cannot notify themselves. Their instructions tell them to call this
 * tool instead — which is the composition the model is meant to encourage. Anything an
 * agent-driven automation needs that isn't an agent capability is authored once as an `aiTool`
 * automation and reused by every automation (and by Scout in the dashboard) that needs it.
 *
 * The deployed `publicId` is the filename without extension: `ai-workflow-notify`.
 */
export default defineAutomation({
  metadata: {
    name: 'AI Workflow: notification',
    // Load-bearing: this is how the agent decides to call it, so it names the workflow explicitly.
    description:
      'Posts a notification about an AI Workflow content review or translation. Do not call outside automations.',
    triggers: [{ type: 'aiTool' }],
    inputSchema: z.object({
      targets: z
        .array(z.enum(['uniform', 'slack']))
        .min(1)
        .describe(
          'Where to send the notification: "uniform" for an in-app Uniform notification, "slack" for Slack. Include both to notify both channels in one call.'
        ),
      text: z
        .string()
        .max(256)
        .describe(
          'The message to post, at most 256 characters. Lead with a status emoji and the entity name, then the details — this is read by a human who was not watching the run. Do not paste the entity URL into the text; pass it as entityUrl instead.'
        ),
      entityUrl: z
        .url()
        .optional()
        .describe(
          'The absolute `entity.url` from the trigger payload, linked at the end of the message so the reader can open the content. Omit only if the payload had none.'
        ),
    }),
  },
  handler: async ({ input, log, uniformCredentials }) => {
    const targets = [...new Set(input.targets)];
    let failed = false;

    for (const target of targets) {
      switch (target) {
        case 'slack': {
          await notifySlack(
            {
              level: 'success',
              title: 'AI Workflow',
              headline: input.text,
              entityUrl: input.entityUrl,
            },
            log
          );
          break;
        }

        case 'uniform': {
          await sendUniformNotification(
            {
              recipients: configuredNotificationRecipients(),
              projectId: uniformCredentials.projectId,
              summary: input.text,
              ...(input.entityUrl
                ? { entity: { type: 'external' as const, url: input.entityUrl } }
                : {}),
            },
            uniformCredentials,
            log
          );
          break;
        }

        default: {
          const unhandled: never = target;
          log.error(`Unhandled notification target: ${unhandled}`);
          failed = true;
        }
      }
    }

    if (failed) {
      return { outcome: 'failure' };
    }
  },
});
