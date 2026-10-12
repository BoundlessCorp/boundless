import { inspectApprovedSent, verifyAndMaybeFinalizeApprovedSent } from "./approval";
import { classifyOutboundEvent, greatestHistoryId, isApplyMode } from "./policy";
import type { Env, GmailMessage } from "./types";
import {
  extractSingleRecipient,
  getMessage,
  getThread,
  isExpiredHistoryError,
  isSent,
  listHistory,
  providerSentAt,
  threadHasPriorSent,
} from "./gmail";
import {
  companyAuditSnapshot,
  createOutboundEvent,
  findCompanyByPrimaryEmail,
  findOutreachEventByProviderMessageId,
  reconcileCompanyAfterOutbound,
  verifyReconciliation,
} from "./notion";
import {
  claimMessage,
  completeMessage,
  failMessage,
  getState,
  recordObservation,
  setState,
} from "./state";

export interface ReconcileSummary {
  startHistoryId: string;
  latestHistoryId: string;
  discovered: number;
  processed: number;
  observed: number;
  skipped: number;
  alreadyDone: number;
  failures: Array<{ messageId: string; error: string }>;
}

async function processOutboundMessage(
  env: Env,
  message: GmailMessage,
): Promise<"processed" | "observed" | "skipped" | "already_done"> {
  if (!isSent(message)) return "skipped";
  if (env.PROCESS_OUTBOUND !== "true") return "skipped";

  // Provider time is required before an Event or Company Last Contact can
  // represent verified SENT. Do not silently substitute the Worker's clock.
  const sentAt = providerSentAt(message);

  const recipient = extractSingleRecipient(message);
  if (!recipient) {
    // Multi-recipient or malformed outbound mail is outside V0.1's controlled
    // prospect-reconciliation contract. Ignore it rather than poison the cursor.
    return "skipped";
  }

  const company = await findCompanyByPrimaryEmail(env, recipient);
  if (!company) {
    // The Gmail account can send ordinary non-prospect mail. Zero Company matches
    // is therefore a safe ignore; more than one match still fails in the adapter.
    return "skipped";
  }

  const thread = await getThread(env, message.threadId);
  const priorOutbound = threadHasPriorSent(thread, message.id);
  const predictedEventType = classifyOutboundEvent(priorOutbound);
  const existingEvent = await findOutreachEventByProviderMessageId(env, message.id);

  if (!isApplyMode(env.WRITE_MODE)) {
    const approval = await inspectApprovedSent(env, company, message, recipient);
    const approvalSnapshotState = !approval.hasSnapshot
      ? "none"
      : approval.matched
        ? "matched"
        : "mismatch";

    await recordObservation(env, {
      providerMessageId: message.id,
      providerThreadId: message.threadId,
      recipient,
      companyPageId: company.id,
      predictedEventType,
      providerSentAt: sentAt,
      existingNotionEventId: existingEvent?.id ?? null,
      approvalSnapshotState,
      approvalId: approval.approvalId ?? null,
      detail:
        approval.mismatchReasons.length > 0
          ? `Approved-draft mismatch: ${approval.mismatchReasons.join("; ")}`
          : existingEvent
            ? "Provider message already exists in Notion; observation only."
            : "Predicted reconciliation only; no Notion write performed.",
    });
    return "observed";
  }

  if (existingEvent) {
    const existingType =
      existingEvent.properties["Event Type"]?.select?.name === "Follow-Up" ? "Follow-Up" : "First Touch";

    const claim = await claimMessage(env, {
      providerMessageId: message.id,
      providerThreadId: message.threadId,
      direction: "Outbound",
      eventType: existingType,
      gmailInternalDate: message.internalDate,
    });
    if (claim === "already_succeeded") {
      await verifyAndMaybeFinalizeApprovedSent(env, company, message, recipient);
      return "already_done";
    }
    if (claim === "busy") throw new Error(`Message ${message.id} is already being processed under a live lease`);

    try {
      await reconcileCompanyAfterOutbound(env, company, existingType, sentAt);
      await verifyReconciliation(env, {
        providerMessageId: message.id,
        companyPageId: company.id,
        eventPageId: existingEvent.id,
        sentAt,
      });
      await verifyAndMaybeFinalizeApprovedSent(env, company, message, recipient);
      await completeMessage(env, message.id, company.id, existingEvent.id);
      return "already_done";
    } catch (error) {
      await failMessage(env, message.id, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  const eventType = predictedEventType;

  const claim = await claimMessage(env, {
    providerMessageId: message.id,
    providerThreadId: message.threadId,
    direction: "Outbound",
    eventType,
    gmailInternalDate: message.internalDate,
  });

  if (claim === "already_succeeded") {
    await verifyAndMaybeFinalizeApprovedSent(env, company, message, recipient);
    return "already_done";
  }
  if (claim === "busy") throw new Error(`Message ${message.id} is already being processed under a live lease`);

  try {

    const before = companyAuditSnapshot(company);
    const event = await createOutboundEvent(env, { message, company, eventType });
    await reconcileCompanyAfterOutbound(env, company, eventType, sentAt);

    await verifyReconciliation(env, {
      providerMessageId: message.id,
      companyPageId: company.id,
      eventPageId: event.id,
      sentAt,
    });

    const afterCompany = await findCompanyByPrimaryEmail(env, recipient);
    if (!afterCompany) throw new Error("Read-back failed: Company disappeared after reconciliation");
    const after = companyAuditSnapshot(afterCompany);

    // Immutable audit fields must be preserved by V0.1.
    if (
      before.qaPassedMessageId !== after.qaPassedMessageId ||
      before.founderApprovedDraftId !== after.founderApprovedDraftId ||
      before.founderApprovedMessageId !== after.founderApprovedMessageId ||
      before.founderApprovedAt !== after.founderApprovedAt
    ) {
      throw new Error("Safety invariant failed: immutable QA/founder audit fields changed");
    }

    await verifyAndMaybeFinalizeApprovedSent(env, afterCompany, message, recipient);
    await completeMessage(env, message.id, company.id, event.id);
    return "processed";
  } catch (error) {
    const messageText = error instanceof Error ? error.message : String(error);
    await failMessage(env, message.id, messageText);
    throw error;
  }
}

export async function reconcileFromHistory(env: Env, notificationHistoryId: string): Promise<ReconcileSummary> {
  const startHistoryId = await getState(env, "gmail_history_id");
  if (!startHistoryId) {
    throw new Error("Gmail history cursor is not initialized; run /admin/watch before accepting notifications");
  }

  if (BigInt(notificationHistoryId) <= BigInt(startHistoryId)) {
    return {
      startHistoryId,
      latestHistoryId: startHistoryId,
      discovered: 0,
      processed: 0,
      observed: 0,
      skipped: 0,
      alreadyDone: 0,
      failures: [],
    };
  }

  let history;
  try {
    history = await listHistory(env, startHistoryId);
  } catch (error) {
    if (isExpiredHistoryError(error)) {
      await setState(
        env,
        "gmail_history_gap",
        JSON.stringify({
          detectedAt: new Date().toISOString(),
          staleStartHistoryId: startHistoryId,
          notificationHistoryId,
          reason: "Gmail returned 404 for startHistoryId; manual full-sync/reseed review required.",
        }),
      );
      throw new Error(
        "GMAIL_HISTORY_GAP: Gmail rejected the persisted startHistoryId. Processing is paused until the gap is explicitly reviewed and reseeded.",
      );
    }
    throw error;
  }
  const summary: ReconcileSummary = {
    startHistoryId,
    latestHistoryId: history.latestHistoryId,
    discovered: history.messageIds.length,
    processed: 0,
    observed: 0,
    skipped: 0,
    alreadyDone: 0,
    failures: [],
  };

  for (const messageId of history.messageIds) {
    try {
      const gmailMessage = await getMessage(env, messageId);
      const result = await processOutboundMessage(env, gmailMessage);
      if (result === "processed") summary.processed++;
      if (result === "observed") summary.observed++;
      if (result === "skipped") summary.skipped++;
      if (result === "already_done") summary.alreadyDone++;
    } catch (error) {
      summary.failures.push({
        messageId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (summary.failures.length > 0) {
    // Do not advance the Gmail cursor. Pub/Sub retry will replay the same history range;
    // already-succeeded messages are idempotently skipped.
    throw new Error(`Reconciliation failed for ${summary.failures.length} message(s): ${JSON.stringify(summary.failures)}`);
  }

  const advanceTo = greatestHistoryId(notificationHistoryId, history.latestHistoryId);
  await setState(env, "gmail_history_id", advanceTo);
  summary.latestHistoryId = advanceTo;
  return summary;
}
