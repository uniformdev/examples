import { defineAutomation } from '@uniformdev/automations-sdk';

/**
 * Schedule-triggered automation.
 *
 * Runs based on the `rrule` (RFC 5545) recurrence in `timezone`.
 * Note that a COUNT rule must be anchored by a DTSTART rule; the count is computed by the recurrence rule,
 * NOT by the absolute number of runs completed.
 *
 * The deployed `publicId` is the filename without extension: `daily-cleanup`.
 */
export default defineAutomation({
  metadata: {
    name: 'Daily cleanup',
    description: 'Runs every day at 02:00 in America/Los_Angeles.',
    triggers: [
      {
        type: 'schedule',
        rrule: 'FREQ=DAILY;BYHOUR=2;BYMINUTE=0;BYSECOND=0',
        timezone: 'America/Los_Angeles',
      },
    ],
  },
  handler: async ({ log }) => {
    log.info('Daily cleanup running.');

    // you can use env vars prefixed with UNIFORM_ENV_ to reference secret values. Other env vars are not available.
    const externalKey = process.env.UNIFORM_ENV_EXTERNAL_KEY;
    if (!externalKey) {
      log.error('No external key found');
      return { outcome: 'failure' };
    }
  },
});
