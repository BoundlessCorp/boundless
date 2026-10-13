import { describe, expect, it } from "vitest";
import { approvalMismatchReasons } from "./approval";
import type { ApprovedDraftSnapshot, GmailMessage } from "./types";

const snapshot: ApprovedDraftSnapshot = {
  approvalId: "a1",
  companyPageId: "c1",
  gmailDraftId: "d1",
  draftMessageId: "dm1",
  providerThreadId: "t1",
  recipient: "owner@example.com",
  subject: "Quick question",
  contentFingerprint: "abc123",
  qaPassedMessageId: "dm1",
  founderApprovedDraftId: "d1",
  founderApprovedMessageId: "dm1",
  founderApprovedAt: "2026-10-11T20:00:00.000Z",
  state: "approved",
  capturedAt: "2026-10-11T20:00:01.000Z",
};

function message(): GmailMessage {
  return {
    id: "sent1",
    threadId: "t1",
    labelIds: ["SENT"],
    payload: {
      headers: [
        { name: "To", value: "owner@example.com" },
        { name: "Subject", value: "Quick question" },
      ],
    },
  };
}

describe("approved SENT matching", () => {
  it("accepts exact thread, recipient, subject and content fingerprint", () => {
    expect(approvalMismatchReasons(snapshot, message(), "OWNER@example.com", "abc123")).toEqual([]);
  });

  it("reports every immutable mismatch", () => {
    const changed = message();
    changed.threadId = "different";
    changed.payload!.headers = [
      { name: "To", value: "other@example.com" },
      { name: "Subject", value: "Changed subject" },
    ];

    expect(approvalMismatchReasons(snapshot, changed, "other@example.com", "different-hash")).toEqual([
      "thread ID mismatch",
      "recipient mismatch",
      "subject mismatch",
      "content fingerprint mismatch",
    ]);
  });
});
