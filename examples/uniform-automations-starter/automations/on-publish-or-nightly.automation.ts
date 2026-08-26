import { defineAutomation } from '@uniformdev/automations-sdk';

/**
 * One handler, three triggers: two content events and a nightly schedule.
 *
 * This is the shape for "keep an external system in step with Uniform" — react to each change as it
 * lands, and sweep periodically to repair anything a missed event left behind. The alternative,
 * three automations that call the same code, triples the deploys and the places to look when
 * something stops firing.
 *
 * The payoff and the hazard both live in `input`, which is a discriminated union over every
 * configured trigger. Narrow it with `switch (input.eventType)` and the `never` default below turns
 * "someone added a trigger and forgot the branch" into a compile error rather than a runtime one.
 *
 * `filter` is CEL, evaluated before a run is created. A run that a filter prevents costs nothing and
 * never appears in the run list, so filtering here is strictly better than an early return in the
 * handler when the condition is knowable from the payload.
 *
 * The deployed `publicId` is the filename without extension: `on-publish-or-nightly`.
 *
 * @see https://docs.uniform.app/docs/guides/automations/triggers — multiple triggers and CEL filters
 */
export default defineAutomation({
  metadata: {
    name: 'Reindex on publish or nightly',
    description: 'Reindexes an article or page when it is published, and reindexes everything overnight.',
    // Pins the runtime behavior this was written against. Without it you inherit whatever the
    // runtime defaults to at deploy time, which can change under you.
    compatibilityDate: '2026-08-13',
    triggers: [
      { type: 'entry.published', filter: 'input.type == "article"' },
      { type: 'composition.published', filter: 'input.type == "page"' },
      {
        // RFC-5545 rrule. Anchor the time fields: without BYMINUTE/BYSECOND the run drifts to
        // whatever minute and second the automation happened to be deployed at.
        type: 'schedule',
        rrule: 'FREQ=DAILY;BYHOUR=3;BYMINUTE=0;BYSECOND=0',
        timezone: 'Etc/UTC',
      },
    ],
    permissions: { role: 'developer' },
  },
  handler: async ({ input, log }) => {
    switch (input.eventType) {
      case 'entry.published':
        log.info(`Reindexing article "${input.name}" (${input.id}).`);
        return;

      case 'composition.published':
        log.info(`Reindexing page "${input.name}" (${input.id}).`);
        return;

      case 'schedule':
        // A schedule payload carries no entity — only when it fired. Everything else it needs it
        // has to go and read.
        log.info(`Nightly full reindex, fired at ${input.firedAt}.`);
        return;

      default: {
        // Add a trigger to the metadata above without adding a branch here and this line stops
        // compiling.
        const unhandled: never = input;
        throw new Error(`Unhandled trigger input: ${JSON.stringify(unhandled)}`);
      }
    }
  },
});
