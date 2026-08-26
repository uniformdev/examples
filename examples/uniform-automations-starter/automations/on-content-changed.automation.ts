import { defineAutomation } from '@uniformdev/automations-sdk';
import { CompositionManagementClient, EntryManagementClient } from '@uniformdev/canvas';

/**
 * Event-triggered automation. The `trigger.type` is a webhook event name, so
 * `input` below is inferred as the `entry.changed` payload — no manual typing or
 * casting needed. Try changing `'entry.changed'` to another event name and watch
 * `input`'s shape follow.
 *
 * Notifications live in `notifications` so this handler can stay
 * focused on reading the changed entity.
 *
 * The deployed `publicId` is the filename without extension: `on-content-changed`.
 *
 * @see https://docs.uniform.app/docs/guides/automations/triggers — content events and CEL filters
 */
export default defineAutomation({
  metadata: {
    name: 'On content changed',
    description: 'Logs whenever a "product" entry or a "page" composition changes.',
    triggers: [
      {
        type: 'entry.changed',
        // only create an automation run if the entry is a product
        filter: `input.type == "product"`,
      },
      {
        type: 'composition.changed',
        // only create an automation run if the composition is a page
        filter: `input.type == "page"`,
      },
    ],
    permissions: {
      role: 'developer',
    },
  },
  handler: async ({ input, log, uniformCredentials }) => {
    // handle entry changed event
    if (input.eventType === 'entry.changed') {
      log.info(`Entry "${input.name}" (${input.id}) changed in project ${input.project.id}`);

      const client = new EntryManagementClient(uniformCredentials);

      const changedEntry = await client.get({
        entryId: input.id,
        state: input.state,
        editionId: input.editionId,
      });

      // do stuff - i.e. update the entry, send email, etc.
      // note: if you trigger the same automation again from an action here, for example
      // by saving the entry in an entry.saved automation, the second run will be stopped automatically
      // to prevent runaway event storms.
      log.info(`The retrieved entry is named "${changedEntry.entry._name}"`);
    }

    // handle composition changed event
    if (input.eventType === 'composition.changed') {
      log.info(`Composition "${input.name}" (${input.id}) changed in project ${input.project.id}`);

      const client = new CompositionManagementClient(uniformCredentials);

      const changedComposition = await client.get({
        compositionId: input.id,
        state: input.state,
        editionId: input.editionId,
      });

      log.info(`The retrieved composition is named "${changedComposition.composition._name}"`);
    }

    return { outcome: 'success' };
  },
});
