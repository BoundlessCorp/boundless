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
  const failed = await env.SYNC_DB.prepare(
    "SELECT COUNT(*) AS count FROM processed_messages WHERE status='failed'",
  ).first<{ count: number }>();
  const processing = await env.SYNC_DB.prepare(
    "SELECT COUNT(*) AS count FROM processed_messages WHERE status='processing'",
  ).first<{ count: number }>();

  return {
    gmailHistoryId: historyId,
    gmailWatchExpiration: watchExpiration,
    failedMessages: failed?.count ?? 0,
    processingMessages: processing?.count ?? 0,
  };
}
