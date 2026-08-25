import { describe, expect, it } from "vitest";
import {
  MAX_NOTIFICATION_SUMMARY,
  buildNotificationSummary,
} from "../lib/notifications";

describe("buildNotificationSummary", () => {
  it("keeps a short name intact", () => {
    expect(buildNotificationSummary("Home", (name) => `Entry **${name}** changed.`)).toBe(
      "Entry **Home** changed."
    );
  });

  it("clips a long name so the summary stays within the API cap", () => {
    const name = "N".repeat(400);
    const summary = buildNotificationSummary(
      name,
      (clipped) => `Entry **${clipped}** changed.`
    );

    expect(summary.length).toBeLessThanOrEqual(MAX_NOTIFICATION_SUMMARY);
    expect(summary.startsWith("Entry **")).toBe(true);
    expect(summary.endsWith("** changed.")).toBe(true);
    expect(summary).toContain("…");
  });

  it("keeps surrounding copy when the template itself is long", () => {
    const summary = buildNotificationSummary("Home", (name) => {
      const padding = "x".repeat(200);
      return `Shared content: **${name}** ${padding} 2/2 project(s).`;
    });

    expect(summary.length).toBeLessThanOrEqual(MAX_NOTIFICATION_SUMMARY);
    expect(summary).toContain("2/2 project(s).");
  });
});
