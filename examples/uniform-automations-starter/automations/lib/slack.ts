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

/** A single URL action button rendered in the notification's actions block. */
export interface SlackActionButton {
  /** Button text. */
  label: string;
  /** URL opened when the button is clicked. */
  url: string;
  /** When "primary", the button is visually emphasized. */
  style?: "primary";
}

export interface SlackNotification {
  level: NotificationLevel;
  /** Entity display name, shown as the headline. */
  title: string;
  /** One-line status describing what happened. */
  headline: string;
  /** Optional prose summary (e.g. of what an AI agent changed). */
  summary?: string;
  /** Optional label for the summary section heading. Defaults to "Summary". */
  summaryLabel?: string;
  /** Optional deterministic warnings to call out. */
  warnings?: string[];
  /** Optional deep link back to the entity in Uniform. */
  entityUrl?: string;
  /** Optional label for the deep-link button. Defaults to "Open in Uniform". */
  buttonLabel?: string;
  /**
   * Optional multiple action buttons. When provided (and non-empty), these
   * replace the single `entityUrl`/`buttonLabel` button.
   */
  actions?: SlackActionButton[];
}

/** Slack `header` blocks are plain text capped at 150 characters. */
const HEADER_MAX = 150;
/** Slack `section` text fields are capped at 3000 characters. */
const SECTION_MAX = 3000;

const DEFAULT_SUMMARY_LABEL = "Summary";
const DEFAULT_BUTTON_LABEL = "Open in Uniform";

/**
 * Converts the standard Markdown that AI agents return into Slack's "mrkdwn"
 * flavor so it renders instead of showing raw syntax. Handles ATX headings,
 * `**bold**`/`__bold__`, `[text](url)` links, and `-`/`*` bullets. Slack already
 * supports `_italic_`, so it is left as-is. See https://docs.slack.dev/block-kit.
 */
export function toSlackMrkdwn(markdown: string): string {
  return markdown
    .split("\n")
    .map((line) => {
      // ATX headings (`#`..`######`) become bold lines.
      const heading = line.match(/^\s*#{1,6}\s+(.*)$/);
      if (heading) {
        return `*${heading[1].trim()}*`;
      }
      // Normalize `-`/`*` bullet markers to Slack bullets, preserving indent.
      return line.replace(/^(\s*)[-*]\s+/, "$1• ");
    })
    .join("\n")
    // `[text](url)` -> `<url|text>`.
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<$2|$1>")
    // `**bold**` / `__bold__` -> `*bold*` (run after bullets so a leading
    // `**` is never mistaken for a bullet marker).
    .replace(/\*\*([^*]+)\*\*/g, "*$1*")
    .replace(/__([^_]+)__/g, "*$1*");
}

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

/** Formats a list of strings into Slack bullet lines. */
function bulletList(items: string[]): string {
  return items.map((item) => `• ${item}`).join("\n");
}

/**
 * Renders a Slack message as a Block Kit `blocks` array: a status header, the
 * headline, an optional summary and warnings section, and an optional deep-link
 * button. Sections and the button are omitted when their data is absent.
 */
export function buildSlackBlocks(notification: SlackNotification): SlackBlock[] {
  const {
    level,
    title,
    headline,
    summary,
    summaryLabel,
    warnings,
    entityUrl,
    buttonLabel,
    actions,
  } = notification;

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
      text: { type: "mrkdwn", text: truncate(headline, SECTION_MAX) },
    },
  ];

  if (summary?.trim()) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: truncate(
          `*${summaryLabel ?? DEFAULT_SUMMARY_LABEL}*\n${toSlackMrkdwn(summary.trim())}`,
          SECTION_MAX
        ),
      },
    });
  }

  if (warnings && warnings.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: truncate(`*Warnings*\n${bulletList(warnings)}`, SECTION_MAX),
      },
    });
  }

  // Prefer the multi-button `actions` list; otherwise fall back to the single
  // `entityUrl` button so existing callers keep their behavior.
  const buttons: SlackActionButton[] =
    actions && actions.length > 0
      ? actions
      : entityUrl
        ? [{ label: buttonLabel ?? DEFAULT_BUTTON_LABEL, url: entityUrl, style: "primary" }]
        : [];

  if (buttons.length > 0) {
    blocks.push(
      { type: "divider" },
      {
        type: "actions",
        elements: buttons.map((button) => ({
          type: "button",
          text: {
            type: "plain_text",
            text: button.label,
            emoji: true,
          },
          url: button.url,
          ...(button.style ? { style: button.style } : {}),
        })),
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
  const { level, title, headline, summary, warnings, entityUrl, buttonLabel, actions } =
    notification;

  const parts = [`${NOTIFICATION_EMOJI[level]} ${title}`, headline];
  if (summary?.trim()) {
    parts.push(toSlackMrkdwn(summary.trim()));
  }
  if (warnings && warnings.length > 0) {
    parts.push(`Warnings:\n${bulletList(warnings)}`);
  }

  // Mirror the block buttons: prefer the multi-button `actions` list, otherwise
  // fall back to the single `entityUrl` link.
  if (actions && actions.length > 0) {
    parts.push(actions.map((a) => `<${a.url}|${a.label}>`).join("  "));
  } else if (entityUrl) {
    parts.push(`<${entityUrl}|${buttonLabel ?? DEFAULT_BUTTON_LABEL}>`);
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
