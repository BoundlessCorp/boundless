import { describe, expect, it } from "vitest";
import { assertCompanyApprovalForDraft, companyAuditSnapshot } from "./notion";
import type { NotionPage } from "./types";

function text(value: string) {
  return { type: "rich_text", rich_text: value ? [{ plain_text: value }] : [] };
}

function company(overrides: Record<string, any> = {}): NotionPage {
  return {
    id: "company-1",
    properties: {
      "Company Name": { type: "title", title: [{ plain_text: "Example Painting" }] },
      "Primary Contact Email": { type: "email", email: "Owner@Example.com" },
      "Prospect Status": { type: "select", select: { name: "Ready for Outreach" } },
      "Outreach QA Status": { type: "select", select: { name: "PASS" } },
      "Draft Release Status": { type: "select", select: { name: "APPROVED" } },
      "Canonical Draft ID": text("draft-1"),
      "QA Passed Message ID": text("draft-message-1"),
      "Founder Approved Draft ID": text("draft-1"),
      "Founder Approved Message ID": text("draft-message-1"),
      "Founder Approved At": { type: "date", date: { start: "2026-10-12T16:00:00.000Z" } },
      ...overrides,
    },
  };
}

describe("company approval gate", () => {
  it("accepts the exact immutable approved draft version case-insensitively by email", () => {
    const result = assertCompanyApprovalForDraft(company(), {
      draftId: "draft-1",
      draftMessageId: "draft-message-1",
      recipient: "owner@example.com",
    });

    expect(result.outreachQaStatus).toBe("PASS");
    expect(result.draftReleaseStatus).toBe("APPROVED");
    expect(result.founderApprovedAt).toBe("2026-10-12T16:00:00.000Z");
  });

  it("rejects a stale or incompletely approved version", () => {
    expect(() =>
      assertCompanyApprovalForDraft(
        company({
          "Outreach QA Status": { type: "select", select: { name: "REWORK" } },
          "Draft Release Status": { type: "select", select: { name: "HOLD" } },
          "Canonical Draft ID": text("different-draft"),
          "QA Passed Message ID": text("different-message"),
          "Founder Approved Draft ID": text(""),
          "Founder Approved Message ID": text(""),
          "Founder Approved At": { type: "date", date: null },
        }),
        {
          draftId: "draft-1",
          draftMessageId: "draft-message-1",
          recipient: "owner@example.com",
        },
      ),
    ).toThrow("Approval snapshot refused");
  });

  it("rejects a recipient mismatch even when all approval IDs match", () => {
    expect(() =>
      assertCompanyApprovalForDraft(company(), {
        draftId: "draft-1",
        draftMessageId: "draft-message-1",
        recipient: "other@example.com",
      }),
    ).toThrow("Primary Contact Email does not match Gmail draft recipient");
  });

  it("exposes the immutable audit fields used by reconciliation", () => {
    expect(companyAuditSnapshot(company())).toMatchObject({
      primaryContactEmail: "Owner@Example.com",
      outreachQaStatus: "PASS",
      draftReleaseStatus: "APPROVED",
      canonicalDraftId: "draft-1",
      qaPassedMessageId: "draft-message-1",
      founderApprovedDraftId: "draft-1",
      founderApprovedMessageId: "draft-message-1",
      founderApprovedAt: "2026-10-12T16:00:00.000Z",
    });
  });
});
