import type { GmailMessage, GmailMessagePart } from "./types";

const STABLE_HEADERS = ["to", "cc", "bcc", "subject", "in-reply-to", "references"];

function normalizedHeaderValue(message: GmailMessage, name: string): string {
  return (
    message.payload?.headers?.find((h) => h.name.toLowerCase() === name)?.value
      ?.trim()
      .replace(/\s+/g, " ") ?? ""
  );
}

function flattenPayload(part: GmailMessagePart | undefined): Array<Record<string, unknown>> {
  if (!part) return [];

  const here = {
    mimeType: part.mimeType ?? "",
    filename: part.filename ?? "",
    size: part.body?.size ?? 0,
    data: part.body?.data ?? "",
    attachment: part.body?.attachmentId ? true : false,
  };

  return [here, ...(part.parts ?? []).flatMap(flattenPayload)];
}

export function canonicalMessageContent(message: GmailMessage): string {
  return JSON.stringify({
    threadId: message.threadId,
    headers: Object.fromEntries(
      STABLE_HEADERS.map((name) => [name, normalizedHeaderValue(message, name)]),
    ),
    payload: flattenPayload(message.payload),
  });
}

export async function contentFingerprint(message: GmailMessage): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalMessageContent(message));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
