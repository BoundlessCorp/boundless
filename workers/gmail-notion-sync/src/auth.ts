import type { Env } from "./types";

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

export async function getGoogleAccessToken(env: Env): Promise<string> {
  const now = Date.now();
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60_000) {
    return cachedAccessToken.token;
  }

  const body = new URLSearchParams({
    client_id: env.GMAIL_OAUTH_CLIENT_ID,
    client_secret: env.GMAIL_OAUTH_CLIENT_SECRET,
    refresh_token: env.GMAIL_OAUTH_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(`Google OAuth refresh failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json<{ access_token: string; expires_in: number }>();
  cachedAccessToken = {
    token: json.access_token,
    expiresAt: now + json.expires_in * 1000,
  };
  return json.access_token;
}

function decodeBase64UrlJson<T>(part: string): T {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return JSON.parse(atob(padded)) as T;
}

function base64UrlToBytes(part: string): Uint8Array {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export async function verifyPubSubJwt(request: Request, env: Env): Promise<void> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    throw new Error("Missing Pub/Sub bearer token");
  }

  const jwt = auth.slice("Bearer ".length);
  const [headerPart, payloadPart, signaturePart] = jwt.split(".");
  if (!headerPart || !payloadPart || !signaturePart) {
    throw new Error("Malformed Pub/Sub JWT");
  }

  const header = decodeBase64UrlJson<{ alg?: string; kid?: string }>(headerPart);
  const payload = decodeBase64UrlJson<{
    iss?: string;
    aud?: string;
    exp?: number;
    email?: string;
    email_verified?: boolean;
  }>(payloadPart);

  if (header.alg !== "RS256" || !header.kid) throw new Error("Unexpected Pub/Sub JWT algorithm");
  if (!["accounts.google.com", "https://accounts.google.com"].includes(payload.iss ?? "")) {
    throw new Error("Unexpected Pub/Sub JWT issuer");
  }
  if (payload.aud !== env.PUBSUB_AUDIENCE) throw new Error("Pub/Sub JWT audience mismatch");
  if (!payload.exp || payload.exp * 1000 <= Date.now()) throw new Error("Expired Pub/Sub JWT");
  if (payload.email !== env.PUBSUB_SERVICE_ACCOUNT_EMAIL || payload.email_verified !== true) {
    throw new Error("Pub/Sub service account mismatch");
  }

  const jwksResponse = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  if (!jwksResponse.ok) throw new Error("Unable to load Google JWKS");
  const jwks = await jwksResponse.json<{ keys: Array<JsonWebKey & { kid?: string }> }>();
  const jwk = jwks.keys.find((key) => key.kid === header.kid);
  if (!jwk) throw new Error("Pub/Sub JWT signing key not found");

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const data = new TextEncoder().encode(`${headerPart}.${payloadPart}`);
  const signature = base64UrlToBytes(signaturePart);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, data);
  if (!valid) throw new Error("Invalid Pub/Sub JWT signature");
}

export function assertAdmin(request: Request, env: Env): void {
  const token = request.headers.get("x-boundless-admin-token");
  if (!token || token !== env.ADMIN_TOKEN) throw new Error("Unauthorized admin request");
}
