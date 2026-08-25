import { describe, expect, it } from "vitest";
import onInboundHook from "../on-inbound-hook.automation";

function invoke(rawBody: string) {
  return onInboundHook({
    trigger: { type: "incomingWebhook" },
    input: {
      eventType: "incomingWebhook",
      method: "POST",
      headers: { "content-type": "application/json" },
      query: {},
      rawBody,
    },
  });
}

describe("on-inbound-hook", () => {
  it("returns unauthorized when source validation fails", async () => {
    const result = await invoke('{"id":"abc","action":"unauthorized"}');
    expect(result.outcome).toBe("unauthorized");
  });

  it("rejects a payload that does not match the schema", async () => {
    const result = await invoke('{"id":"abc"}');
    expect(result.outcome).toBe("rejected");
    expect(result.logs.some((log) => log.level === "error" && log.message.startsWith("Invalid body:"))).toBe(
      true
    );
  });

  it("handles a valid payload", async () => {
    const result = await invoke('{"id":"abc","action":"sync"}');
    expect(result).toMatchObject({
      outcome: "success",
      logs: [{ level: "info", message: "Handling sync for abc" }],
    });
  });
});
