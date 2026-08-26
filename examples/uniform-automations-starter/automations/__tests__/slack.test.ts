import { describe, expect, it } from "vitest";
import { buildSlackBlocks, buildSlackText } from "../lib/slack";

const notification = {
  level: "success" as const,
  title: "Home",
  headline: "Composition changed in project-1.",
  entityUrl: "https://uniform.app/projects/p1/dashboards/canvas/edit/abc",
};

describe("buildSlackBlocks", () => {
  it("renders a header, headline, and deep-link button", () => {
    const blocks = buildSlackBlocks(notification);

    expect(blocks[0]).toMatchObject({
      type: "header",
      text: { type: "plain_text", text: "✅ Home" },
    });
    expect(blocks[1]).toMatchObject({
      type: "section",
      text: { type: "mrkdwn", text: notification.headline },
    });
    expect(blocks.at(-1)).toMatchObject({
      type: "actions",
      elements: [
        {
          type: "button",
          text: { text: "Open in Uniform" },
          url: notification.entityUrl,
          style: "primary",
        },
      ],
    });
  });

  it("omits the button when there is no entity URL", () => {
    const blocks = buildSlackBlocks({
      level: "success",
      title: "Home",
      headline: notification.headline,
    });
    expect(blocks.some((block) => block.type === "actions")).toBe(false);
  });
});

describe("buildSlackText", () => {
  it("mirrors the blocks as a plain-text fallback", () => {
    expect(buildSlackText(notification)).toBe(
      `✅ Home\n\n${notification.headline}\n\n<${notification.entityUrl}|Open in Uniform>`
    );
  });
});
