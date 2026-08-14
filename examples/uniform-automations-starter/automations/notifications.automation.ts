import { defineAutomation } from '@uniformdev/automations-sdk';
import {
  resolveNotificationRecipients,
  sendUniformNotification,
} from './lib/notifications';
import { notifySlack } from './lib/slack';

/**
 * Same triggers as `on-content-changed`, split out so notifying can be deployed
 * (or disabled) on its own. Sends an in-app Uniform notification to the author
 * (falling back to `UNIFORM_ENV_NOTIFY_RECIPIENTS`) and a Slack message when
 * `UNIFORM_ENV_SLACK_WEBHOOK_URL` is set. Both are best-effort and never fail
 * the run.
 *
 * The deployed `publicId` is the filename without extension: `notifications`.
 */
export default defineAutomation({
  metadata: {
    name: 'Notifications',
    description:
      'Notifies the author in Uniform and Slack when a "product" entry or a "page" composition changes.',
    triggers: [
      {
        type: 'entry.changed',
        filter: `input.type == "product"`,
      },
      {
        type: 'composition.changed',
        filter: `input.type == "page"`,
      },
    ],
    permissions: {
      role: 'developer',
    },
  },
  handler: async ({ input, log, uniformCredentials }) => {
    const entityType = input.eventType.startsWith('entry') ? 'entry' : 'composition';
    const headline = `${entityType === 'entry' ? 'Entry' : 'Composition'} **${input.name}** changed.`;

    await Promise.all([
      sendUniformNotification(
        {
          recipients: resolveNotificationRecipients(input.initiator),
          projectId: input.project.id,
          summary: `${entityType === 'entry' ? 'Entry' : 'Composition'} **${input.name}** changed.`,
          entity: {
            entityId: input.id,
            type: entityType,
            ...(input.editionId ? { editionId: input.editionId } : {}),
          },
        },
        uniformCredentials,
        log
      ),
      notifySlack(
        {
          level: 'success',
          title: input.name,
          headline: `${entityType === 'entry' ? 'Entry' : 'Composition'} changed in ${input.project.id}.`,
          entityUrl: input.edit_url,
        },
        log
      ),
    ]);

    return { outcome: 'success' };
  },
});
