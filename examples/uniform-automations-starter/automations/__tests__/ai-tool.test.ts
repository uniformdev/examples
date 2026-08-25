import { afterEach, describe, expect, it, vi } from "vitest";
import aiTool from "../ai-tool.automation";

const credentials = { apiKey: "test-key", projectId: "project-1" };

function invoke(name: string) {
  return aiTool({
    trigger: { type: "aiTool" },
    input: { name },
    uniformCredentials: credentials,
  });
}

describe("ai-tool", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the creature JSON as the tool result", async () => {
    const creature = { index: "owlbear", name: "Owlbear", type: "monstrosity" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(creature), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    const result = await invoke("owlbear");

    expect(result).toMatchObject({
      outcome: "success",
      logs: [{ level: "info", message: expect.stringContaining("owlbear") }],
    });
  });

  it("fails with the status text when the API returns a non-JSON error body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Not Found", { status: 404, statusText: "Not Found" }))
    );

    const result = await invoke("xyz");

    expect(result.outcome).toBe("failure");
    expect(result.logs).toContainEqual(
      expect.objectContaining({
        level: "error",
        message: "Failed to fetch creature information: Not Found",
      })
    );
  });
});
