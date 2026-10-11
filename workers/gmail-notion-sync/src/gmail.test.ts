import { describe, expect, it } from "vitest";
import { extractSingleRecipient, header, isSent } from "./gmail";
import type { GmailMessage } from "./types";

function message(headers: Array<{ name: string; value: string }>, labelIds: string[] = []): GmailMessage {
  return {
    id: "m1",
    threadId: "t1",
    labelIds,
    payload: { headers },
  };
}

describe("Gmail safety helpers", () => {
  it("finds headers case-insensitively", () => {
    expect(header(message([{ name: "sUbJeCt", value: "Hello" }]), "Subject")).toBe("Hello");
  });

  it("extracts one plain recipient", () => {
    expect(extractSingleRecipient(message([{ name: "To", value: "owner@example.com" }]))).toBe(
      "owner@example.com",
    );
  });

  it("extracts one display-name recipient", () => {
    expect(
      extractSingleRecipient(message([{ name: "To", value: "Owner <Owner@Example.com>" }])),
    ).toBe("owner@example.com");
  });

  it("fails closed for multi-recipient mail", () => {
    expect(
      extractSingleRecipient(
        message([{ name: "To", value: "one@example.com, two@example.com" }]),
      ),
    ).toBeNull();
  });

  it("fails closed for malformed recipient mail", () => {
    expect(extractSingleRecipient(message([{ name: "To", value: "not-an-email" }]))).toBeNull();
  });

  it("trusts Gmail SENT label rather than draft assumptions", () => {
    expect(isSent(message([], ["SENT"]))).toBe(true);
    expect(isSent(message([], ["DRAFT"]))).toBe(false);
  });
});
