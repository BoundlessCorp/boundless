import type { Env } from "./types";

const nowIso = () => new Date().toISOString();

export async function getState(env: Env, key: string): Promise<string | null> {
  const row = await env.SYNC_DB.prepare("SELECT value FROM sync_state WHERE key = ?")
    .bind(key)
    .first<{ value: string }>();
  return row?.value ?? null;
}

export async function setState(env: Env, key: string, value: string): Promise<void> {
  await env.SYNC_DB.prepare(
    `INSERT INTO sync_state(key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  ).bind(key, value, nowIso()).run();
}

export async function logDelivery(
  env: Env,
  pubsubMessageId: string | null,
  historyId: string | null,
  status: string,
  detail?: string,
): Promise<void> {
  await env.SYNC_DB.prepare(
    `INSERT INTO delivery_log(pubsub_message_id, notification_history_id, status, detail, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).bind(pubsubMessageId, historyId, status, detail ?? null, nowIso()).run();
}

export async function claimMessage(
  env: Env,
  input: {
    providerMessageId: string;
    providerThreadId: string;
    direction: string;
    eventType: string;
    gmailInternalDate?: string;
  },
): Promise<"claimed" | "already_succeeded" | "busy"> {
  const now = new Date();
  const leaseExpires = new Date(now.getTime() + 5 * 60_000).toISOString();

  const existing = await env.SYNC_DB.prepare(
    "SELECT status, lease_expires_at FROM processed_messages WHERE provider_message_id = ?",
  ).bind(input.providerMessageId).first<{ status: string; lease_expires_at: string | null }>();

  if (existing?.status === "succeeded") return "already_succeeded";
  if (existing?.status === "processing" && existing.lease_expires_at && existing.lease_expires_at > now.toISOString()) {
    return "busy";
  }

  if (!existing) {
    await env.SYNC_DB.prepare(
      `INSERT INTO processed_messages(
        provider_message_id, provider_thread_id, direction, event_type,
        gmail_internal_date, status, lease_expires_at, attempt_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'processing', ?, 1, ?, ?)`,
    ).bind(
      input.providerMessageId,
      input.providerThreadId,
      input.direction,
      input.eventType,
      input.gmailInternalDate ?? null,
      leaseExpires,
      now.toISOString(),
      now.toISOString(),
    ).run();
    return "claimed";
  }

  await env.SYNC_DB.prepare(
    `UPDATE processed_messages
     SET status='processing', lease_expires_at=?, attempt_count=attempt_count+1,
         last_error=NULL, updated_at=?
     WHERE provider_message_id=?`,
  ).bind(leaseExpires, now.toISOString(), input.providerMessageId).run();
  return "claimed";
}

export async function completeMessage(
  env: Env,
  providerMessageId: string,
  companyPageId: string | null,
  notionEventPageId: string | null,
): Promise<void> {
  await env.SYNC_DB.prepare(
    `UPDATE processed_messages
     SET status='succeeded', company_page_id=?, notion_event_page_id=?,
         lease_expires_at=NULL, last_error=NULL, updated_at=?
     WHERE provider_message_id=?`,
  ).bind(companyPageId, notionEventPageId, nowIso(), providerMessageId).run();
}

export async function failMessage(env: Env, providerMessageId: string, error: string): Promise<void> {
  await env.SYNC_DB.prepare(
    `UPDATE processed_messages
     SET status='failed', lease_expires_at=NULL, last_error=?, updated_at=?
     WHERE provider_message_id=?`,
  ).bind(error.slice(0, 4000), nowIso(), providerMessageId).run();
}

export async function healthSnapshot(env: Env): Promise<Record<string, unknown>> {
  const historyId = await getState(env, "gmail_history_id");
  const watchExpiration = await getState(env, "gmail_watch_expiration");
  const historyGap = await getState(env, "gmail_history_gap");
  const failed = await env.SYNC_DB.prepare(
    "SELECT COUNT(*) AS count FROM processed_messages WHERE status='failed'",
  ).first<{ count: number }>();
  const processing = await env.SYNC_DB.prepare(
    "SELECT COUNT(*) AS count FROM processed_messages WHERE status='processing'",
  ).first<{ count: number }>();
  const observations = await env.SYNC_DB.prepare(
    "SELECT COUNT(*) AS count FROM sync_observations",
  ).first<{ count: number }>();

  return {
    gmailHistoryId: historyId,
    gmailWatchExpiration: watchExpiration,
    gmailHistoryGap: historyGap ? JSON.parse(historyGap) : null,
    failedMessages: failed?.count ?? 0,
    processingMessages: processing?.count ?? 0,
    observedMessages: observations?.count ?? 0,
  };
}


export async function clearState(env: Env, key: string): Promise<void> {
  await env.SYNC_DB.prepare("DELETE FROM sync_state WHERE key = ?").bind(key).run();
}


export async function getActiveApprovedDraft(
  env: Env,
  companyPageId: string,
): Promise<import("./types").ApprovedDraftSnapshot | null> {
  const row = await env.SYNC_DB.prepare(
    `SELECT
       approval_id AS approvalId,
       company_page_id AS companyPageId,
       gmail_draft_id AS gmailDraftId,
       draft_message_id AS draftMessageId,
       provider_thread_id AS providerThreadId,
       recipient,
       subject,
       content_fingerprint AS contentFingerprint,
       qa_passed_message_id AS qaPassedMessageId,
       founder_approved_draft_id AS founderApprovedDraftId,
       founder_approved_message_id AS founderApprovedMessageId,
       founder_approved_at AS founderApprovedAt,
       state,
       sent_message_id AS sentMessageId,
       captured_at AS capturedAt
     FROM approved_drafts
     WHERE company_page_id = ? AND state = 'approved'
     LIMIT 1`,
  ).bind(companyPageId).first<import("./types").ApprovedDraftSnapshot>();

  return row ?? null;
}

export async function saveApprovedDraft(
  env: Env,
  snapshot: import("./types").ApprovedDraftSnapshot,
): Promise<import("./types").ApprovedDraftSnapshot> {
  const existingExact = await env.SYNC_DB.prepare(
    `SELECT
       approval_id AS approvalId,
       company_page_id AS companyPageId,
       gmail_draft_id AS gmailDraftId,
       draft_message_id AS draftMessageId,
       provider_thread_id AS providerThreadId,
       recipient,
       subject,
       content_fingerprint AS contentFingerprint,
       qa_passed_message_id AS qaPassedMessageId,
       founder_approved_draft_id AS founderApprovedDraftId,
       founder_approved_message_id AS founderApprovedMessageId,
       founder_approved_at AS founderApprovedAt,
       state,
       sent_message_id AS sentMessageId,
       captured_at AS capturedAt
     FROM approved_drafts
     WHERE company_page_id = ? AND gmail_draft_id = ? AND draft_message_id = ?
     LIMIT 1`,
  ).bind(snapshot.companyPageId, snapshot.gmailDraftId, snapshot.draftMessageId)
   .first<import("./types").ApprovedDraftSnapshot>();

  if (existingExact?.state === "approved") return existingExact;

  const now = new Date().toISOString();
  await env.SYNC_DB.batch([
    env.SYNC_DB.prepare(
      `UPDATE approved_drafts
       SET state='invalidated', invalidated_at=?, invalidation_reason=?
       WHERE company_page_id=? AND state='approved'`,
    ).bind(now, "Superseded by a newer explicitly validated approval snapshot", snapshot.companyPageId),
    env.SYNC_DB.prepare(
      `INSERT INTO approved_drafts(
        approval_id, company_page_id, gmail_draft_id, draft_message_id,
        provider_thread_id, recipient, subject, content_fingerprint,
        qa_passed_message_id, founder_approved_draft_id, founder_approved_message_id,
        founder_approved_at, state, captured_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?)
      ON CONFLICT(company_page_id, gmail_draft_id, draft_message_id)
      DO UPDATE SET
        provider_thread_id=excluded.provider_thread_id,
        recipient=excluded.recipient,
        subject=excluded.subject,
        content_fingerprint=excluded.content_fingerprint,
        qa_passed_message_id=excluded.qa_passed_message_id,
        founder_approved_draft_id=excluded.founder_approved_draft_id,
        founder_approved_message_id=excluded.founder_approved_message_id,
        founder_approved_at=excluded.founder_approved_at,
        state='approved',
        sent_message_id=NULL,
        consumed_at=NULL,
        invalidated_at=NULL,
        invalidation_reason=NULL,
        captured_at=excluded.captured_at`,
    ).bind(
      snapshot.approvalId,
      snapshot.companyPageId,
      snapshot.gmailDraftId,
      snapshot.draftMessageId,
      snapshot.providerThreadId,
      snapshot.recipient,
      snapshot.subject,
      snapshot.contentFingerprint,
      snapshot.qaPassedMessageId,
      snapshot.founderApprovedDraftId,
      snapshot.founderApprovedMessageId,
      snapshot.founderApprovedAt,
      snapshot.capturedAt,
    ),
  ]);

  const saved = await getActiveApprovedDraft(env, snapshot.companyPageId);
  if (!saved) throw new Error("Approved-draft snapshot write could not be read back");
  return saved;
}

export async function consumeApprovedDraft(
  env: Env,
  approvalId: string,
  sentMessageId: string,
): Promise<void> {
  const now = new Date().toISOString();
  const result = await env.SYNC_DB.prepare(
    `UPDATE approved_drafts
     SET state='consumed', sent_message_id=?, consumed_at=?
     WHERE approval_id=? AND state='approved'`,
  ).bind(sentMessageId, now, approvalId).run();

  if ((result.meta.changes ?? 0) !== 1) {
    throw new Error("Approved-draft consumption failed or snapshot was already inactive");
  }
}


export async function recordObservation(
  env: Env,
  input: {
    providerMessageId: string;
    providerThreadId: string;
    recipient: string;
    companyPageId: string;
    predictedEventType: string;
    providerSentAt?: string | null;
    existingNotionEventId?: string | null;
    approvalSnapshotState: string;
    approvalId?: string | null;
    detail?: string | null;
  },
): Promise<void> {
  const now = new Date().toISOString();
  await env.SYNC_DB.prepare(
    `INSERT INTO sync_observations(
      provider_message_id, provider_thread_id, recipient, company_page_id,
      predicted_event_type, provider_sent_at, existing_notion_event_id,
      approval_snapshot_state, approval_id, detail,
      observation_count, first_observed_at, last_observed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    ON CONFLICT(provider_message_id) DO UPDATE SET
      provider_thread_id=excluded.provider_thread_id,
      recipient=excluded.recipient,
      company_page_id=excluded.company_page_id,
      predicted_event_type=excluded.predicted_event_type,
      provider_sent_at=excluded.provider_sent_at,
      existing_notion_event_id=excluded.existing_notion_event_id,
      approval_snapshot_state=excluded.approval_snapshot_state,
      approval_id=excluded.approval_id,
      detail=excluded.detail,
      observation_count=sync_observations.observation_count+1,
      last_observed_at=excluded.last_observed_at`,
  ).bind(
    input.providerMessageId,
    input.providerThreadId,
    input.recipient,
    input.companyPageId,
    input.predictedEventType,
    input.providerSentAt ?? null,
    input.existingNotionEventId ?? null,
    input.approvalSnapshotState,
    input.approvalId ?? null,
    input.detail ?? null,
    now,
    now,
  ).run();
}
