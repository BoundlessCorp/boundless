import { getGoogleAccessToken } from "./auth";
import type { Env, GmailDraft, GmailHistoryResponse, GmailMessage, GmailThread } from "./types";

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1";

export class GmailApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "GmailApiError";
  }
}

export function isExpiredHistoryError(error: unknown): boolean {
  return error instanceof GmailApiError && error.status === 404;
}

async function gmailFetch<T>(env: Env, path: string, init?: RequestInit): Promise<T> {
  const token = await getGoogleAccessToken(env);
  const response = await fetch(`${GMAIL_API}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new GmailApiError(response.status, `Gmail API ${response.status}: ${detail}`);
  }

  return response.json<T>();
}

export async function renewWatch(env: Env): Promise<{ historyId: string; expiration: string }> {
  return gmailFetch(env, `/users/${encodeURIComponent(env.GMAIL_USER)}/watch`, {
    method: "POST",
    body: JSON.stringify({ topicName: env.GMAIL_PUBSUB_TOPIC }),
  });
}

export async function getProfile(env: Env): Promise<{ historyId: string; emailAddress: string }> {
  return gmailFetch(env, `/users/${encodeURIComponent(env.GMAIL_USER)}/profile`);
}

// Gmail can confirm outbound messages both when a message enters the mailbox
// and when the SENT label is applied to an existing message (e.g. a draft).
export function historyCandidates(record: NonNullable<GmailHistoryResponse["history"]>[number]): string[] {
  const ids = new Set<string>();
  for (const entry of record.messagesAdded ?? []) {
    if (entry.message?.id) ids.add(entry.message.id);
  }
  for (const entry of record.labelsAdded ?? []) {
    if (entry.labelIds?.includes("SENT") && entry.message?.id) ids.add(entry.message.id);
  }
  return [...ids];
}

export async function listHistory(
  env: Env,
  startHistoryId: string,
): Promise<{ messageIds: string[]; latestHistoryId: string }> {
  const messageIds = new Set<string>();
  let pageToken: string | undefined;
  let latestHistoryId = startHistoryId;

  do {
    const params = new URLSearchParams({
      startHistoryId,
      maxResults: "500",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const page = await gmailFetch<GmailHistoryResponse>(
      env,
      `/users/${encodeURIComponent(env.GMAIL_USER)}/history?${params}`,
    );

    for (const record of page.history ?? []) {
      if (BigInt(record.id) > BigInt(latestHistoryId)) latestHistoryId = record.id;
      for (const id of historyCandidates(record)) messageIds.add(id);
    }

    if (page.historyId && BigInt(page.historyId) > BigInt(latestHistoryId)) {
      latestHistoryId = page.historyId;
    }
    pageToken = page.nextPageToken;
  } while (pageToken);

  return { messageIds: [...messageIds], latestHistoryId };
}

export async function getMessage(env: Env, messageId: string): Promise<GmailMessage> {
  const params = new URLSearchParams({
    format: "metadata",
    metadataHeaders: "From",
  });
  params.append("metadataHeaders", "To");
  params.append("metadataHeaders", "Cc");
  params.append("metadataHeaders", "Bcc");
  params.append("metadataHeaders", "Subject");
  params.append("metadataHeaders", "Message-ID");

  return gmailFetch(
    env,
    `/users/${encodeURIComponent(env.GMAIL_USER)}/messages/${encodeURIComponent(messageId)}?${params}`,
  );
}

export function header(message: GmailMessage, name: string): string {
  return message.payload?.headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export function extractSingleRecipient(message: GmailMessage): string | null {
  const raw = header(message, "To");
  if (!raw || raw.includes(",")) return null;
  const angle = raw.match(/<([^>]+)>/);
  const candidate = (angle?.[1] ?? raw).trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : null;
}

export function isSent(message: GmailMessage): boolean {
  return message.labelIds?.includes("SENT") ?? false;
}


export async function getThread(env: Env, threadId: string): Promise<GmailThread> {
  const params = new URLSearchParams({ format: "metadata" });
  params.append("metadataHeaders", "To");
  params.append("metadataHeaders", "From");
  params.append("metadataHeaders", "Subject");

  return gmailFetch(
    env,
    `/users/${encodeURIComponent(env.GMAIL_USER)}/threads/${encodeURIComponent(threadId)}?${params}`,
  );
}

export function threadHasPriorSent(thread: GmailThread, currentMessageId: string): boolean {
  return (thread.messages ?? []).some(
    (message) => message.id !== currentMessageId && (message.labelIds?.includes("SENT") ?? false),
  );
}


export async function getDraft(env: Env, draftId: string): Promise<GmailDraft> {
  return gmailFetch(
    env,
    `/users/${encodeURIComponent(env.GMAIL_USER)}/drafts/${encodeURIComponent(draftId)}?format=full`,
  );
}

export async function getFullMessage(env: Env, messageId: string): Promise<GmailMessage> {
  return gmailFetch(
    env,
    `/users/${encodeURIComponent(env.GMAIL_USER)}/messages/${encodeURIComponent(messageId)}?format=full`,
  );
}
