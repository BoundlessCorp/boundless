import type { Env, GmailMessage } from "./types";
import { extractSingleRecipient, getMessage, isSent, listHistory } from "./gmail";
import {
  companyAuditSnapshot,
  createOutboundEvent,
  findCompanyByPrimaryEmail,
  findOutreachEventByProviderMessageId,
  hasPriorOutboundInThread,
  reconcileCompanyAfterOutbound,
  verifyReconciliation,
} from "./notion";
import { claimMessage, completeMessage, failMessage, getState, setState } from "./state";

export interface ReconcileSummary {
  startHistoryId: string;
  latestHistoryId: string;
  discovered: number;
  processed: number;
  skipped: number;
  alreadyDone: number;
  failures: Array<{ messageId: string; error: string }>;
}

async function processOutboundMessage(env: Env, message: GmailMessage): Promise<"processed" | "skipped" | "already_done"> {
  if (!isSent(message)) return "skipped";
  if (env.PROCESS_OUTBOUND !== "true") return "skipped";

  const recipient = extractSingleRecipient(message);
  if (!recipient) {
    throw new Error(`Unsafe recipient shape for SENT message ${message.id}; exactly one valid To address is required`);
  }

  const existingEvent = await findOutreachEventByProviderMessageId(env, message.id);
  if (existingEvent) {
    const claim = await claimMessage(env, {
      providerMessageId: message.id,
      providerThreadId: message.threadId,
      direction: "Outbound",
      eventType: "Existing",
      gmailInternalDate: message.internalDate,
    });
    if (claim !== "already_succeeded") {
      await completeMessage(env, message.id, null, existingEvent.id);
    }
    return "already_done";
  }

  const company = await findCompanyByPrimaryEmail(env, recipient);
  const priorOutbound = await hasPriorOutboundInThread(env, message.threadId);
  const eventType = priorOutbound ? "Follow-Up" : "First Touch";

  const claim = await claimMessage(env, {
    providerMessageId: message.id,
    providerThreadId: message.threadId,
    direction: "Outbound",
    eventType,
    gmailInternalDate: message.internalDate,
  });

  if (claim === "already_succeeded") return "already_done";
  if (claim === "busy") throw new Error(`Message ${message.id} is already being processed under a live lease`);

  try {
    const sentAt = message.internalDate
      ? new Date(Number(message.internalDate)).toISOString()
      : new Date().toISOString();

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
    const after = companyAuditSnapshot(afterCompany);

    // Immutable audit fields must be preserved by V0.1.
    if (
      before.qaPassedMessageId !== after.qaPassedMessageId ||
      before.founderApprovedDraftId !== after.founderApprovedDraftId ||
      before.founderApprovedMessageId !== after.founderApprovedMessageId
    ) {
      throw new Error("Safety invariant failed: immutable QA/founder audit fields changed");
    }

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
      skipped: 0,
      alreadyDone: 0,
      failures: [],
    };
  }

  const history = await listHistory(env, startHistoryId);
  const summary: ReconcileSummary = {
    startHistoryId,
    latestHistoryId: history.latestHistoryId,
    discovered: history.messageIds.length,
    processed: 0,
    skipped: 0,
    alreadyDone: 0,
    failures: [],
  };

  for (const messageId of history.messageIds) {
    try {
      const gmailMessage = await getMessage(env, messageId);
      const result = await processOutboundMessage(env, gmailMessage);
      if (result === "processed") summary.processed++;
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

  const advanceTo =
    BigInt(notificationHistoryId) > BigInt(history.latestHistoryId)
      ? notificationHistoryId
      : history.latestHistoryId;
  await setState(env, "gmail_history_id", advanceTo);
  summary.latestHistoryId = advanceTo;
  return summary;
}
