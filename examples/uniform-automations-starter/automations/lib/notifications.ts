import {
  NotificationsClient,
  type AutomationLogger,
  type NotificationEntity,
  type UniformConnectionParams,
} from "@uniformdev/automations-sdk";
import type { WebhookInitiator } from "@uniformdev/webhooks";
import { errorMessage } from "./errors";
import { truncate } from "./utils";

/** Longest summary the Notifications API accepts; a longer body is rejected. */
export const MAX_NOTIFICATION_SUMMARY = 256;

/** Entity name floor, so the rest of a summary cannot squeeze the name to nothing. */
const MIN_ENTITY_NAME = 20;

/**
 * Fits a notification summary into the Notifications API's character cap.
 *
 * `summarize` is the message with the entity name substituted in. The name is
 * the only unbounded part, so it absorbs the truncation and the rest of the
 * template always survives. The closing clip is a last resort for the case
 * where even the shortest name does not fit.
 */
export function buildNotificationSummary(
  entityName: string,
  summarize: (name: string) => string,
  maxLength = MAX_NOTIFICATION_SUMMARY
): string {
  const nameBudget = maxLength - summarize("").length;
  return truncate(
    summarize(truncate(entityName, Math.max(nameBudget, MIN_ENTITY_NAME))),
    maxLength
  );
}

/**
 * Parses the configured fallback recipient identity subject IDs from
 * `UNIFORM_ENV_NOTIFY_RECIPIENTS` (comma-separated Uniform identity subject IDs).
 * Whitespace is trimmed and empty entries are dropped, so an unset or blank value
 * yields an empty list (a silent no-op downstream).
 *
 * Note: this reads `process.env.UNIFORM_ENV_NOTIFY_RECIPIENTS` as a literal so
 * the Uniform CLI can statically inline the value into the deployed bundle. A
 * computed lookup (`process.env[someVar]`) would not be inlined and would always
 * read as undefined at runtime.
 */
export function configuredNotificationRecipients(): string[] {
  return (process.env.UNIFORM_ENV_NOTIFY_RECIPIENTS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

/**
 * Resolves the recipients for an automation notification. Prefers the
 * initiating person (a non-API-key identity from a workflow trigger); falls
 * back to the configured list when there is no such person (e.g. schedule and
 * webhook runs, or an API-key initiator).
 */
export function resolveNotificationRecipients(
  initiator?: WebhookInitiator
): string[] {
  if (initiator && !initiator.is_api_key) {
    return [initiator.id];
  }
  return configuredNotificationRecipients();
}

/**
 * In-app Uniform notifications for automations.
 *
 * Backed by `NotificationsClient` from `@uniformdev/automations-sdk`.
 * Sending is best-effort: when there are no recipients it no-ops, and any
 * delivery failure is logged but never thrown, so a notification issue never
 * fails the automation run.
 */

export interface UniformNotification {
  /** Uniform identity subject IDs to notify (not email addresses). */
  recipients: string[];
  /** Project the notification belongs to. */
  projectId: string;
  /** Markdown body shown in the notification. */
  summary: string;
  /** Optional entity the notification links to (in-app when internal). */
  entity?: NotificationEntity;
}

/**
 * Best-effort in-app Uniform notification. No-ops (with an info log) when there
 * are no recipients. Otherwise creates a text notification via the
 * `NotificationsClient`, mapping the Markdown `summary` into the API's
 * `{ format, value }` shape. Delivery failures are logged as warnings and never
 * thrown, so the automation run is never affected.
 */
export async function sendUniformNotification(
  notification: UniformNotification,
  credentials: UniformConnectionParams,
  log: AutomationLogger
): Promise<void> {
  const { recipients, projectId, summary, entity } = notification;

  if (recipients.length === 0) {
    log.info("No notification recipients; skipping the in-app notification.");
    return;
  }

  try {
    const client = new NotificationsClient(credentials);
    await client.create({
      recipients,
      projectId,
      summary: { format: "markdown", value: summary },
      ...(entity ? { entity } : {}),
    });
  } catch (error) {
    log.warning(
      `In-app Uniform notification failed to send: ${errorMessage(error)}`
    );
  }
}
