import type { Env, GmailNotification, PubSubPushBody } from "./types";
import { assertAdmin, verifyPubSubJwt } from "./auth";
import { getProfile, renewWatch } from "./gmail";
import { reconcileFromHistory } from "./reconcile";
import { clearState, getState, healthSnapshot, logDelivery, setState } from "./state";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function decodeNotification(data: string): GmailNotification {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return JSON.parse(atob(padded)) as GmailNotification;
}

async function initializeOrRenewWatch(env: Env): Promise<Record<string, string>> {
  const watch = await renewWatch(env);
  const existingHistory = await getState(env, "gmail_history_id");

  // Initial setup seeds the cursor from watch.historyId. Renewals DO NOT jump the
  // cursor forward because doing so could skip unprocessed history.
  if (!existingHistory) {
    await setState(env, "gmail_history_id", watch.historyId);
  }
  await setState(env, "gmail_watch_expiration", watch.expiration);
  return {
    watchHistoryId: watch.historyId,
    persistedHistoryId: existingHistory ?? watch.historyId,
    expiration: watch.expiration,
  };
}

async function handlePubSub(request: Request, env: Env): Promise<Response> {
  await verifyPubSubJwt(request, env);

  const body = await request.json<PubSubPushBody>();
  if (!body.message?.data) return json({ error: "Missing Pub/Sub message.data" }, 400);

  const notification = decodeNotification(body.message.data);
  if (notification.emailAddress.toLowerCase() !== env.GMAIL_USER.toLowerCase()) {
    await logDelivery(
      env,
      body.message.messageId ?? null,
      notification.historyId ?? null,
      "rejected",
      `Unexpected Gmail account: ${notification.emailAddress}`,
    );
    return json({ error: "Unexpected Gmail account" }, 403);
  }

  try {
    const summary = await reconcileFromHistory(env, notification.historyId);
    await logDelivery(
      env,
      body.message.messageId ?? null,
      notification.historyId,
      "succeeded",
      JSON.stringify(summary),
    );
    return json({ ok: true, summary });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    await logDelivery(
      env,
      body.message.messageId ?? null,
      notification.historyId,
      "failed",
      detail,
    );

    // 5xx tells Pub/Sub to retry. Idempotency prevents duplicate Notion writes.
    return json({ ok: false, error: detail }, 500);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        service: "boundless-gmail-notion-sync",
        mode: {
          outbound: env.PROCESS_OUTBOUND === "true",
          inbound: env.PROCESS_INBOUND === "true",
        },
        ...(await healthSnapshot(env)),
      });
    }

    if (request.method === "POST" && url.pathname === "/pubsub/gmail") {
      return handlePubSub(request, env);
    }

    if (request.method === "POST" && url.pathname === "/admin/watch") {
      try {
        assertAdmin(request, env);
        return json({ ok: true, ...(await initializeOrRenewWatch(env)) });
      } catch (error) {
        return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 401);
      }
    }

    if (request.method === "POST" && url.pathname === "/admin/history/reseed") {
      try {
        assertAdmin(request, env);
        const gap = await getState(env, "gmail_history_gap");
        if (!gap) return json({ ok: false, error: "No Gmail history gap is currently recorded" }, 409);

        const body = await request.json<{ acknowledgeHistoryGap?: boolean; note?: string }>();
        const note = body.note?.trim() ?? "";
        if (body.acknowledgeHistoryGap !== true || note.length < 12) {
          return json(
            {
              ok: false,
              error:
                "Explicit acknowledgeHistoryGap=true and an audit note of at least 12 characters are required",
            },
            400,
          );
        }

        const profile = await getProfile(env);
        await setState(env, "gmail_history_id", profile.historyId);
        await clearState(env, "gmail_history_gap");
        await logDelivery(
          env,
          null,
          profile.historyId,
          "history_gap_reseeded",
          JSON.stringify({ note, priorGap: JSON.parse(gap) }),
        );

        return json({
          ok: true,
          reseededHistoryId: profile.historyId,
          warning:
            "Reseed acknowledges that the unavailable Gmail history range was reviewed outside this endpoint. It does not reconstruct the missing range.",
        });
      } catch (error) {
        return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 500);
      }
    }

    return json({ error: "Not found" }, 404);
  },

  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    // Gmail requires watch renewal at least every 7 days; daily renewal gives margin.
    // Renewal intentionally preserves an existing unprocessed history cursor.
    await initializeOrRenewWatch(env);
  },
};
