import { describe, expect, it } from "vitest";
import { claimMessage } from "./state";
import type { Env } from "./types";

function fakeMessageLedger() {
  const row: { status: string; lease: string } = { status: "", lease: "" };
  const fakeDb = {
    prepare(sql: string) {
      return {
        bind(...params: unknown[]) {
          return {
            async run() {
              if (sql.includes("INSERT OR IGNORE INTO processed_messages")) {
                if (row.status) return { meta: { changes: 0 } };
                row.status = "processing";
                row.lease = String(params[5]);
                return { meta: { changes: 1 } };
              }
              if (sql.includes("UPDATE processed_messages")) {
                const now = String(params[3]);
                if (row.status === "succeeded" || (row.status === "processing" && row.lease > now)) {
                  return { meta: { changes: 0 } };
                }
                row.status = "processing";
                row.lease = String(params[0]);
                return { meta: { changes: 1 } };
              }
              throw new Error("Unexpected SQL");
            },
            async first() {
              if (!sql.includes("SELECT status FROM processed_messages")) {
                throw new Error("Unexpected SQL");
              }
              return row.status ? { status: row.status } : null;
            },
          };
        },
      };
    },
  };
  return { row, env: { SYNC_DB: fakeDb } as unknown as Env };
}

const message = {
  providerMessageId: "provider-001",
  providerThreadId: "thread-001",
  direction: "Outbound",
  eventType: "First Touch",
  gmailInternalDate: "1791801000000",
};

describe("atomic provider-message claiming", () => {
  it("allows exactly one of two concurrent deliveries to claim a live lease", async () => {
    const { env } = fakeMessageLedger();
    const responses = await Promise.all([claimMessage(env, message), claimMessage(env, message)]);
    expect(responses.sort()).toEqual(["busy", "claimed"]);
  });

  it("never reclaims an already-succeeded message", async () => {
    const { env, row } = fakeMessageLedger();
    expect(await claimMessage(env, message)).toBe("claimed");
    row.status = "succeeded";
    expect(await claimMessage(env, message)).toBe("already_succeeded");
  });

  it("allows a failed or expired message to be retried once", async () => {
    const { env, row } = fakeMessageLedger();
    expect(await claimMessage(env, message)).toBe("claimed");
    row.status = "failed";
    expect(await claimMessage(env, message)).toBe("claimed");
    expect(await claimMessage(env, message)).toBe("busy");
  });
});
