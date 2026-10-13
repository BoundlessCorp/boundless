import { describe, expect, it, vi } from "vitest";
import { assertCompanyApprovalForDraft, assertOutboundEventReadback, companyAuditSnapshot, findCompanyByPrimaryEmail } from "./notion";
import type { Env, NotionPage } from "./types";

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

describe("Company identity resolution", () => {
  const env = {
    NOTION_TOKEN: "test-only",
    NOTION_VERSION: "2026-03-11",
    NOTION_COMPANIES_DATA_SOURCE_ID: "test-source",
  } as unknown as Env;

  it("rejects same mailbox repeated in different capitalization", async () => {
    const response = {
      ok: true,
      json: async () => ({
        results: [
          company({ "Primary Contact Email": { type: "email", email: "Owner@Example.com" } }),
          { ...company({ "Primary Contact Email": { type: "email", email: "owner@example.com" } }), id: "company-2" },
        ],
        has_more: false,
      }),
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
    try {
      await expect(findCompanyByPrimaryEmail(env, "owner@example.com")).rejects.toThrow(
        /multiple case-insensitive matches/,
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("refuses incomplete pagination instead of certifying uniqueness", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [], has_more: true, next_cursor: null }),
    }));
    try {
      await expect(findCompanyByPrimaryEmail(env, "owner@example.com")).rejects.toThrow(
        /pagination cursor missing/,
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("Provider-backed Outreach Event readback", () => {
  const expected = {
    providerMessageId: "sent-123",
    providerThreadId: "thread-456",
    companyPageId: "company-1",
    eventType: "First Touch" as const,
    sentAt: "2026-10-12T17:20:23.000Z",
  };
  const original: NotionPage = {
    id: "event-1",
    properties: {
      "Provider Message ID": text("sent-123"),
      "Provider Thread ID": text("thread-456"),
      "Event Type": { type: "select", select: { name: "First Touch" } },
      "Direction": { type: "select", select: { name: "Outbound" } },
      "Channel": { type: "select", select: { name: "Email" } },
      "Company": { type: "relation", relation: [{ id: "company-1" }] },
      "Event Date": { type: "date", date: { start: "2026-10-12T17:20:00.000Z" } },
    },
  };
  it("accepts the provider's minute when Notion rounds away seconds", () => {
    expect(() => assertOutboundEventReadback(original, expected)).not.toThrow();
  });
  it("rejects an incorrect thread, direction, or event type", () => {
    expect(() => assertOutboundEventReadback(
      { ...original, properties: { ...original.properties, "Provider Thread ID": text("other") } }, expected,
    )).toThrow(/thread ID mismatch/);
    expect(() => assertOutboundEventReadback(
      { ...original, properties: { ...original.properties, "Direction": { type: "select", select: { name: "Inbound" } } } }, expected,
    )).toThrow(/type\/direction\/channel mismatch/);
    expect(() => assertOutboundEventReadback(
      { ...original, properties: { ...original.properties, "Event Type": { type: "select", select: { name: "Follow-Up" } } } }, expected,
    )).toThrow(/type\/direction\/channel mismatch/);
  });
  it("rejects a stale event minute or wrong Company relation", () => {
    expect(() => assertOutboundEventReadback(
      { ...original, properties: { ...original.properties, "Event Date": { type: "date", date: { start: "2026-10-12T17:19:59.000Z" } } } }, expected,
    )).toThrow(/timestamp differs/);
    expect(() => assertOutboundEventReadback(
      { ...original, properties: { ...original.properties, "Company": { type: "relation", relation: [{ id: "wrong" }] } } }, expected,
    )).toThrow(/company relation mismatch/);
  });
});
