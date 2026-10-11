import { describe, expect, it } from "vitest";
import { assertAdmin } from "./auth";
import type { Env } from "./types";

const env = { ADMIN_TOKEN: "secret" } as Env;

describe("admin authorization", () => {
  it("accepts exact admin token", () => {
    expect(() =>
      assertAdmin(
        new Request("https://example.test/admin/watch", {
          headers: { "x-boundless-admin-token": "secret" },
        }),
        env,
      ),
    ).not.toThrow();
  });

  it("rejects missing or incorrect admin token", () => {
    expect(() => assertAdmin(new Request("https://example.test/admin/watch"), env)).toThrow(
      "Unauthorized",
    );
    expect(() =>
      assertAdmin(
        new Request("https://example.test/admin/watch", {
          headers: { "x-boundless-admin-token": "wrong" },
        }),
        env,
      ),
    ).toThrow("Unauthorized");
  });
});
