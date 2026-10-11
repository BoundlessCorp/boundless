import { describe, expect, it } from "vitest";
import { canonicalMessageContent, contentFingerprint } from "./fingerprint";
import type { GmailMessage } from "./types";

function makeMessage(overrides: Partial<GmailMessage> = {}): GmailMessage {
  return {
    id: "m1",
    threadId: "thread-1",
    payload: {
      headers: [
        { name: "To", value: "owner@example.com" },
        { name: "Subject", value: "Quick question" },
        { name: "Date", value: "volatile-date" },
        { name: "Message-ID", value: "<volatile@example.com>" },
      ],
      mimeType: "text/plain",
      body: { size: 11, data: "aGVsbG8gd29ybGQ" },
    },
    ...overrides,
  };
}

describe("approved-draft content fingerprint", () => {
  it("ignores volatile Date and Message-ID headers", async () => {
    const draft = makeMessage();
    const sent = makeMessage({
      id: "sent-new-id",
      payload: {
        ...draft.payload,
        headers: [
          { name: "To", value: "owner@example.com" },
          { name: "Subject", value: "Quick question" },
          { name: "Date", value: "different-date" },
          { name: "Message-ID", value: "<different@example.com>" },
        ],
      },
    });

    expect(canonicalMessageContent(draft)).toBe(canonicalMessageContent(sent));
    expect(await contentFingerprint(draft)).toBe(await contentFingerprint(sent));
  });

  it("changes when approved content changes", async () => {
    const draft = makeMessage();
    const edited = makeMessage({
      payload: {
        ...draft.payload,
        body: { size: 12, data: "ZGlmZmVyZW50" },
      },
    });

    expect(await contentFingerprint(draft)).not.toBe(await contentFingerprint(edited));
  });

  it("changes when recipient or subject changes", async () => {
    const original = makeMessage();
    const changedRecipient = makeMessage({
      payload: {
        ...original.payload,
        headers: [
          { name: "To", value: "other@example.com" },
          { name: "Subject", value: "Quick question" },
        ],
      },
    });
    const changedSubject = makeMessage({
      payload: {
        ...original.payload,
        headers: [
          { name: "To", value: "owner@example.com" },
          { name: "Subject", value: "Different subject" },
        ],
      },
    });

    expect(await contentFingerprint(original)).not.toBe(await contentFingerprint(changedRecipient));
    expect(await contentFingerprint(original)).not.toBe(await contentFingerprint(changedSubject));
  });
});
