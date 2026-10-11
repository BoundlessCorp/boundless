import { describe, expect, it } from "vitest";
import {
  classifyOutboundEvent,
  greatestHistoryId,
  nextProspectStatus,
  shouldAdvanceTimestamp,
} from "./policy";

describe("nextProspectStatus", () => {
  it("advances normal first touch and follow-up states", () => {
    expect(nextProspectStatus("Ready for Outreach", "First Touch")).toBe("Contacted");
    expect(nextProspectStatus("Contacted", "Follow-Up")).toBe("Follow-Up");
  });

  it.each([
    "Responded",
    "Qualified",
    "Discovery Booked",
    "Not Interested",
    "Not a Fit",
    "No Response",
    "Do Not Contact",
    "Future Opportunity",
  ])("never downgrades protected status %s", (status) => {
    expect(nextProspectStatus(status, "First Touch")).toBeNull();
    expect(nextProspectStatus(status, "Follow-Up")).toBeNull();
  });
});

describe("classifyOutboundEvent", () => {
  it("classifies first touch vs follow-up from thread evidence", () => {
    expect(classifyOutboundEvent(false)).toBe("First Touch");
    expect(classifyOutboundEvent(true)).toBe("Follow-Up");
  });
});

describe("shouldAdvanceTimestamp", () => {
  it("advances missing or older timestamps only", () => {
    expect(shouldAdvanceTimestamp(null, "2026-10-11T20:00:00.000Z")).toBe(true);
    expect(
      shouldAdvanceTimestamp("2026-10-11T19:00:00.000Z", "2026-10-11T20:00:00.000Z"),
    ).toBe(true);
    expect(
      shouldAdvanceTimestamp("2026-10-11T21:00:00.000Z", "2026-10-11T20:00:00.000Z"),
    ).toBe(false);
    expect(
      shouldAdvanceTimestamp("2026-10-11T20:00:00.000Z", "2026-10-11T20:00:00.000Z"),
    ).toBe(false);
  });

  it("fails closed on invalid timestamps", () => {
    expect(shouldAdvanceTimestamp("not-a-date", "2026-10-11T20:00:00.000Z")).toBe(false);
    expect(shouldAdvanceTimestamp("2026-10-11T20:00:00.000Z", "not-a-date")).toBe(false);
  });
});

describe("greatestHistoryId", () => {
  it("compares Gmail history IDs as integers without precision loss", () => {
    expect(
      greatestHistoryId("99999999999999999999", "100000000000000000000"),
    ).toBe("100000000000000000000");
  });

  it("requires at least one history ID", () => {
    expect(() => greatestHistoryId()).toThrow();
  });
});
