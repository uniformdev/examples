import {
  NotificationsClient,
  type AutomationLogger,
  type NotificationPostParameters,
} from "@uniformdev/automations-sdk";
import { errorMessage } from "./errors";

/** The shape of a workflow trigger's initiator we read to pick a recipient. */
export interface NotificationInitiator {
  id?: string;
  is_api_key?: boolean;
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
  initiator?: NotificationInitiator
): string[] {
  if (initiator && !initiator.is_api_key && initiator.id) {
    return [initiator.id];
  }
  return configuredNotificationRecipients();
}

/**
 * In-app Uniform notifications for automations.
 *
 * Backed by the experimental `NotificationsClient` from
 * `@uniformdev/automations-sdk`.
 * Sending is best-effort: when there are no recipients it no-ops, and any
 * delivery failure is logged but never thrown, so a notification issue never
 * fails the automation run.
 */

/** Run credentials (matches the other Uniform clients). */
type Credentials = ConstructorParameters<typeof NotificationsClient>[0];

/**
 * The entity a notification links to. An internal reference (`entry`,
 * `composition`, and so on) makes the notification open the entity in-app; an
 * `external` reference opens the URL as an outbound link.
 */
export type NotificationEntity = NonNullable<NotificationPostParameters["entity"]>;

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
  credentials: Credentials,
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
