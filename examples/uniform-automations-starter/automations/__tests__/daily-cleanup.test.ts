import { afterEach, describe, expect, it, vi } from "vitest";
import dailyCleanup from "../daily-cleanup.automation";

const payload = {
  trigger: {
    type: "schedule" as const,
    rrule: "FREQ=DAILY;BYHOUR=2;BYMINUTE=0;BYSECOND=0",
    timezone: "America/Los_Angeles",
  },
  input: { eventType: "schedule" as const, firedAt: "2026-01-01T10:00:00.000Z" },
};

describe("daily-cleanup", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails when the external key is missing", async () => {
    vi.stubEnv("UNIFORM_ENV_EXTERNAL_KEY", "");
    const result = await dailyCleanup(payload);

    expect(result.outcome).toBe("failure");
    expect(result.logs).toContainEqual(
      expect.objectContaining({ level: "error", message: "No external key found" })
    );
  });

  it("succeeds when the external key is set", async () => {
    vi.stubEnv("UNIFORM_ENV_EXTERNAL_KEY", "secret");
    const result = await dailyCleanup(payload);

    expect(result.outcome).toBe("success");
    expect(result.logs).toContainEqual(
      expect.objectContaining({ level: "info", message: "Daily cleanup running." })
    );
  });
});
