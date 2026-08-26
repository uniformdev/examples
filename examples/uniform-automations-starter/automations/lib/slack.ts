import type { AutomationLogger } from "@uniformdev/automations-sdk";
import { errorMessage } from "./errors";
import { truncate } from "./utils";

/**
 * Slack incoming-webhook notifications for automations.
 *
 * Builds a Block Kit message (with a plain-text fallback) and posts it to the
 * webhook in `UNIFORM_ENV_SLACK_WEBHOOK_URL`. The block/text builders are pure
 * and exported so they can be unit-tested without any network I/O.
 */

/** Visual severity of a notification, mapped to a leading status emoji. */
export type NotificationLevel = "success" | "warning" | "error";

const NOTIFICATION_EMOJI: Record<NotificationLevel, string> = {
  success: "✅",
  warning: "⚠️",
  error: "❌",
};

export interface SlackNotification {
  level: NotificationLevel;
  /** Entity display name, shown as the headline. */
  title: string;
  /** One-line status describing what happened. */
  headline: string;
  /** Optional deep link back to the entity in Uniform. */
  entityUrl?: string;
}

/** Slack `header` blocks are plain text capped at 150 characters. */
const HEADER_MAX = 150;

const DEFAULT_BUTTON_LABEL = "Open in Uniform";

/**
 * A minimal subset of the Slack Block Kit block shapes these notifications emit.
 * See https://docs.slack.dev/block-kit for the full schema.
 */
type SlackBlock =
  | { type: "header"; text: { type: "plain_text"; text: string; emoji: true } }
  | { type: "section"; text: { type: "mrkdwn"; text: string } }
  | { type: "divider" }
  | {
      type: "actions";
      elements: {
        type: "button";
        text: { type: "plain_text"; text: string; emoji: true };
        url: string;
        style?: "primary";
      }[];
    };

/**
 * Renders a Slack message as a Block Kit `blocks` array: a status header, the
 * headline, and an optional deep-link button.
 */
export function buildSlackBlocks(notification: SlackNotification): SlackBlock[] {
  const { level, title, headline, entityUrl } = notification;

  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: truncate(`${NOTIFICATION_EMOJI[level]} ${title}`, HEADER_MAX),
        emoji: true,
      },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: headline },
    },
  ];

  if (entityUrl) {
    blocks.push(
      { type: "divider" },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: DEFAULT_BUTTON_LABEL,
              emoji: true,
            },
            url: entityUrl,
            style: "primary",
          },
        ],
      }
    );
  }

  return blocks;
}

/**
 * Renders the plain-text fallback for the message's top-level `text` field.
 * Slack uses this for notifications and screen readers, so it mirrors the block
 * content.
 */
export function buildSlackText(notification: SlackNotification): string {
  const { level, title, headline, entityUrl } = notification;

  const parts = [`${NOTIFICATION_EMOJI[level]} ${title}`, headline];
  if (entityUrl) {
    parts.push(`<${entityUrl}|${DEFAULT_BUTTON_LABEL}>`);
  }
  return parts.join("\n\n");
}

/**
 * Posts a notification to the Slack incoming webhook in
 * `UNIFORM_ENV_SLACK_WEBHOOK_URL`, when one is configured. Best-effort: a missing
 * webhook is logged and skipped, and a delivery failure is logged but never
 * thrown, so notifications never fail the automation run.
 */
export async function notifySlack(
  notification: SlackNotification,
  log: AutomationLogger
): Promise<void> {
  const webhookUrl = process.env.UNIFORM_ENV_SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    log.info("No Slack webhook is configured; skipping the Slack notification.");
    return;
  }
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: buildSlackText(notification),
        blocks: buildSlackBlocks(notification),
      }),
    });
    if (!response.ok) {
      log.warning(
        `Slack notification returned ${response.status} ${response.statusText}.`
      );
    }
  } catch (error) {
    log.warning(`Slack notification failed to send: ${errorMessage(error)}`);
  }
}
