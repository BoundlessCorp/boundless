import { canFinalizeRelease } from "./policy";
import { contentFingerprint } from "./fingerprint";
import { extractSingleRecipient, getDraft, getFullMessage, header } from "./gmail";
import {
  assertCompanyApprovalForDraft,
  fetchPage,
  finalizeCompanyReleaseAfterExactSent,
} from "./notion";
import {
  consumeApprovedDraft,
  getActiveApprovedDraft,
  saveApprovedDraft,
} from "./state";
import type { ApprovedDraftSnapshot, Env, GmailMessage, NotionPage } from "./types";

export interface CaptureApprovedDraftInput {
  companyPageId: string;
  draftId: string;
  expectedDraftMessageId: string;
}

export interface ApprovedSentMatch {
  hasSnapshot: boolean;
  matched: boolean;
  finalized: boolean;
  approvalId?: string;
}

export function approvalMismatchReasons(
  snapshot: ApprovedDraftSnapshot,
  message: GmailMessage,
  recipient: string,
  fingerprint: string,
): string[] {
  const errors: string[] = [];

  if (snapshot.providerThreadId !== message.threadId) errors.push("thread ID mismatch");
  if (snapshot.recipient.trim().toLowerCase() !== recipient.trim().toLowerCase()) {
    errors.push("recipient mismatch");
  }
  if (snapshot.subject.trim() !== header(message, "Subject").trim()) errors.push("subject mismatch");
  if (snapshot.contentFingerprint !== fingerprint) errors.push("content fingerprint mismatch");

  return errors;
}

export async function captureApprovedDraft(
  env: Env,
  input: CaptureApprovedDraftInput,
): Promise<ApprovedDraftSnapshot> {
  const [company, draft] = await Promise.all([
    fetchPage(env, input.companyPageId),
    getDraft(env, input.draftId),
  ]);

  if (draft.id !== input.draftId) throw new Error("Gmail returned an unexpected draft ID");
  if (draft.message.id !== input.expectedDraftMessageId) {
    throw new Error("Current Gmail draft message ID no longer matches the approved version");
  }
  if (!(draft.message.labelIds?.includes("DRAFT") ?? false)) {
    throw new Error("Approval snapshot refused: Gmail object is not currently a DRAFT");
  }

  const recipient = extractSingleRecipient(draft.message);
  if (!recipient) throw new Error("Approval snapshot refused: exactly one valid To recipient is required");
  if (header(draft.message, "Cc").trim() || header(draft.message, "Bcc").trim()) {
    throw new Error("Approval snapshot refused: Cc/Bcc must be empty for controlled outreach");
  }

  const companyGate = assertCompanyApprovalForDraft(company, {
    draftId: input.draftId,
    draftMessageId: input.expectedDraftMessageId,
    recipient,
  });

  const capturedAt = new Date().toISOString();
  const snapshot: ApprovedDraftSnapshot = {
    approvalId: crypto.randomUUID(),
    companyPageId: company.id,
    gmailDraftId: input.draftId,
    draftMessageId: input.expectedDraftMessageId,
    providerThreadId: draft.message.threadId,
    recipient,
    subject: header(draft.message, "Subject").trim(),
    contentFingerprint: await contentFingerprint(draft.message),
    qaPassedMessageId: companyGate.qaPassedMessageId,
    founderApprovedDraftId: companyGate.founderApprovedDraftId,
    founderApprovedMessageId: companyGate.founderApprovedMessageId,
    founderApprovedAt: companyGate.founderApprovedAt,
    state: "approved",
    sentMessageId: null,
    capturedAt,
  };

  return saveApprovedDraft(env, snapshot);
}

export interface ApprovedSentInspection {
  hasSnapshot: boolean;
  matched: boolean;
  approvalId?: string;
  mismatchReasons: string[];
}

export async function inspectApprovedSent(
  env: Env,
  company: NotionPage,
  metadataMessage: GmailMessage,
  recipient: string,
): Promise<ApprovedSentInspection> {
  const snapshot = await getActiveApprovedDraft(env, company.id);
  if (!snapshot) {
    return { hasSnapshot: false, matched: false, mismatchReasons: [] };
  }

  const fullMessage = await getFullMessage(env, metadataMessage.id);
  const fingerprint = await contentFingerprint(fullMessage);
  const errors = approvalMismatchReasons(snapshot, fullMessage, recipient, fingerprint);

  return {
    hasSnapshot: true,
    matched: errors.length === 0,
    approvalId: snapshot.approvalId,
    mismatchReasons: errors,
  };
}

export async function verifyAndMaybeFinalizeApprovedSent(
  env: Env,
  company: NotionPage,
  metadataMessage: GmailMessage,
  recipient: string,
): Promise<ApprovedSentMatch> {
  const inspection = await inspectApprovedSent(env, company, metadataMessage, recipient);
  if (!inspection.hasSnapshot) {
    return { hasSnapshot: false, matched: false, finalized: false };
  }

  if (!inspection.matched) {
    throw new Error(
      `APPROVED_DRAFT_MISMATCH for company ${company.id}: ${inspection.mismatchReasons.join("; ")}`,
    );
  }

  const snapshot = await getActiveApprovedDraft(env, company.id);
  if (!snapshot || snapshot.approvalId !== inspection.approvalId) {
    throw new Error("Approved-draft snapshot changed during SENT verification");
  }

  if (!canFinalizeRelease(env.WRITE_MODE, env.FINALIZE_RELEASE_STATE)) {
    return {
      hasSnapshot: true,
      matched: true,
      finalized: false,
      approvalId: snapshot.approvalId,
    };
  }

  await finalizeCompanyReleaseAfterExactSent(env, {
    companyPageId: company.id,
    gmailDraftId: snapshot.gmailDraftId,
    draftMessageId: snapshot.draftMessageId,
    qaPassedMessageId: snapshot.qaPassedMessageId,
    founderApprovedDraftId: snapshot.founderApprovedDraftId,
    founderApprovedMessageId: snapshot.founderApprovedMessageId,
    founderApprovedAt: snapshot.founderApprovedAt,
  });

  await consumeApprovedDraft(env, snapshot.approvalId, metadataMessage.id);

  return {
    hasSnapshot: true,
    matched: true,
    finalized: true,
    approvalId: snapshot.approvalId,
  };
}
