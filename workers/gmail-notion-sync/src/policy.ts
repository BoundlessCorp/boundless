export const NON_DOWNGRADABLE_PROSPECT_STATUSES = new Set([
  "Responded",
  "Qualified",
  "Discovery Booked",
  "Not Interested",
  "Not a Fit",
  "No Response",
  "Do Not Contact",
  "Future Opportunity",
]);

export function nextProspectStatus(
  currentStatus: string | null | undefined,
  eventType: "First Touch" | "Follow-Up",
): string | null {
  if (currentStatus && NON_DOWNGRADABLE_PROSPECT_STATUSES.has(currentStatus)) return null;
  // Replaying an older first touch must never demote an existing follow-up.
  if (currentStatus === "Follow-Up" && eventType === "First Touch") return null;
  return eventType === "First Touch" ? "Contacted" : "Follow-Up";
}

export function classifyOutboundEvent(priorOutboundInThread: boolean): "First Touch" | "Follow-Up" {
  return priorOutboundInThread ? "Follow-Up" : "First Touch";
}

export function shouldAdvanceTimestamp(current: string | null | undefined, candidate: string): boolean {
  if (!current) return true;
  const currentMs = new Date(current).getTime();
  const candidateMs = new Date(candidate).getTime();
  if (!Number.isFinite(currentMs) || !Number.isFinite(candidateMs)) return false;
  return candidateMs > currentMs;
}

export function greatestHistoryId(...ids: string[]): string {
  if (ids.length === 0) throw new Error("At least one history ID is required");
  return ids.reduce((greatest, id) => (BigInt(id) > BigInt(greatest) ? id : greatest));
}


export function isApplyMode(writeMode: string | null | undefined): boolean {
  return writeMode === "apply";
}

export function canFinalizeRelease(
  writeMode: string | null | undefined,
  finalizeFlag: string | null | undefined,
): boolean {
  return isApplyMode(writeMode) && finalizeFlag === "true";
}
