import { describe, expect, it } from "vitest";
import {
  extractSingleRecipient,
  GmailApiError,
  header,
  historyCandidates,
  isExpiredHistoryError,
  isSent,
  threadHasPriorSent,
} from "./gmail";
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


describe("Gmail history errors", () => {
  it("recognizes only 404 Gmail API errors as expired-history signals", () => {
    expect(isExpiredHistoryError(new GmailApiError(404, "stale history"))).toBe(true);
    expect(isExpiredHistoryError(new GmailApiError(401, "auth"))).toBe(false);
    expect(isExpiredHistoryError(new Error("404 text is not enough"))).toBe(false);
  });
});


describe("Gmail thread truth", () => {
  it("detects an earlier provider-confirmed SENT in the same thread", () => {
    expect(
      threadHasPriorSent(
        {
          id: "t1",
          messages: [
            { id: "old", threadId: "t1", labelIds: ["SENT"] },
            { id: "current", threadId: "t1", labelIds: ["SENT"] },
          ],
        },
        "current",
      ),
    ).toBe(true);
  });

  it("does not count the current message itself or inbound-only history", () => {
    expect(
      threadHasPriorSent(
        {
          id: "t1",
          messages: [
            { id: "incoming", threadId: "t1", labelIds: ["INBOX"] },
            { id: "current", threadId: "t1", labelIds: ["SENT"] },
          ],
        },
        "current",
      ),
    ).toBe(false);
  });
});

describe("Gmail SENT history coverage", () => {
  it("catches a new outbound message and the SENT-label transition of a draft", () => {
    expect(historyCandidates({
      id: "100",
      messagesAdded: [{ message: { id: "created-and-sent", threadId: "t" } }],
      labelsAdded: [
        { message: { id: "existing-draft-sent", threadId: "t" }, labelIds: ["SENT"] },
        { message: { id: "unrelated-inbox", threadId: "t" }, labelIds: ["INBOX"] },
      ],
    })).toEqual(["created-and-sent", "existing-draft-sent"]);
  });

  it("deduplicates a SENT message surfaced by both change categories", () => {
    expect(historyCandidates({
      id: "101",
      messagesAdded: [{ message: { id: "same", threadId: "t" } }],
      labelsAdded: [{ message: { id: "same", threadId: "t" }, labelIds: ["SENT"] }],
    })).toEqual(["same"]);
  });
});
