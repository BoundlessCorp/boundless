# Boundless Gmail ↔ Notion Sync Worker V0.1

Production-candidate, **not yet deployed**.

This Worker is intended to replace or backstop hourly chat-based Gmail → Notion reconciliation with an event-driven provider-backed path.

## Safety posture

V0.1 is deliberately conservative:

- **Never sends Gmail.**
- Processes **outbound SENT** events only by default.
- Inbound reply/bounce/DNC remains disabled until separately tested.
- Gmail Provider Message ID is the idempotency key.
- A message must resolve to **exactly one** Company by Primary Contact Email.
- A provider message may create **exactly one** Outreach Event.
- Existing advanced/terminal prospect states are not downgraded.
- QA Passed Message ID and Founder Approved IDs are asserted unchanged.
- V0.1 does **not** clear Canonical Draft ID or set Draft Release Status=SENT because exact draft→SENT lineage is not yet proven by an immutable pre-send snapshot.
- Ambiguous identity, multi-recipient SENT mail, Notion duplicates, auth errors, or read-back failures fail closed.
- A failed message prevents the Gmail history cursor from advancing; retries are safe because already-completed Provider Message IDs are idempotent.
- This Worker must remain isolated until controlled acceptance testing passes.

## Event flow

```text
Gmail mailbox
  ↓ users.watch
Google Cloud Pub/Sub topic
  ↓ authenticated push / OIDC
Cloudflare Worker /pubsub/gmail
  ↓ verify JWT + decode historyId
Gmail history.list(startHistoryId)
  ↓
Fetch each changed Gmail message
  ↓
Filter provider-confirmed SENT
  ↓
Resolve exactly one Company by Primary Contact Email
  ↓
Check Provider Message ID uniqueness in Notion
  ↓
D1 claim / lease
  ↓
Create exactly one Outreach Event
  ↓
Update safe Company fields (Prospect Status / Last Contact)
  ↓
Independent Notion read-back + duplicate check
  ↓
Mark D1 message succeeded
  ↓
Advance Gmail history cursor
```

## Why D1 exists

D1 stores durable sync state independent of Notion:

- Gmail history cursor.
- Gmail watch expiration.
- Provider Message ID processing state.
- Retry / lease state.
- Company/Event IDs written for each message.
- Pub/Sub delivery audit log.

This prevents a chat run, browser session, or Notion view from becoming the sole memory of reconciliation state.

## Worker routes

### `GET /health`

Returns current cursor, watch expiry, failed-message count, processing-message count, and enabled directions.

This route does not expose secrets.

### `POST /pubsub/gmail`

Google Pub/Sub push endpoint.

Requirements:

- Bearer JWT from the configured push service account.
- JWT issuer, audience, expiry, signature, service-account email, and email_verified are checked.
- Notification account must match `GMAIL_USER`.

Returns 5xx on reconciliation failure so Pub/Sub retries.

### `POST /admin/watch`

Admin-only watch initialization/renewal.

Header:

```
x-boundless-admin-token: <ADMIN_TOKEN>
```

Initial setup persists the watch response history ID as the starting cursor.
Renewal preserves the existing cursor so unprocessed history cannot be skipped.

A daily Cloudflare cron also renews the watch. Gmail requires renewal at least every seven days.

## Required Cloudflare secrets

Set these with Wrangler; never commit values:

```bash
wrangler secret put GMAIL_OAUTH_CLIENT_ID --config workers/gmail-notion-sync/wrangler.jsonc
wrangler secret put GMAIL_OAUTH_CLIENT_SECRET --config workers/gmail-notion-sync/wrangler.jsonc
wrangler secret put GMAIL_OAUTH_REFRESH_TOKEN --config workers/gmail-notion-sync/wrangler.jsonc
wrangler secret put NOTION_TOKEN --config workers/gmail-notion-sync/wrangler.jsonc
wrangler secret put ADMIN_TOKEN --config workers/gmail-notion-sync/wrangler.jsonc
```

## Google OAuth scope

Use the narrowest scope that supports reading Gmail history/messages and creating/renewing a mailbox watch.

The Worker has no Gmail send endpoint and should not be granted send authority.

## Google Cloud setup

1. Create a Pub/Sub topic, e.g. `boundless-gmail-events`.
2. Grant `gmail-api-push@system.gserviceaccount.com` permission to publish to the topic.
3. Create a push subscription to:
   `https://<worker-host>/pubsub/gmail`
4. Configure Pub/Sub push authentication using a dedicated service account.
5. Set the Worker vars:
   - `GMAIL_PUBSUB_TOPIC`
   - `PUBSUB_AUDIENCE`
   - `PUBSUB_SERVICE_ACCOUNT_EMAIL`
6. Ensure the Pub/Sub push audience exactly matches `PUBSUB_AUDIENCE`.

## D1 setup

Create a dedicated database:

```bash
wrangler d1 create boundless-gmail-notion-sync
```

Copy the resulting database ID into `workers/gmail-notion-sync/wrangler.jsonc`.

Initialize schema:

```bash
cd workers/gmail-notion-sync
npm install
npm run d1:init:remote
```

## Notion integration requirements

The integration must have access to:

- DB • Companies
- DB • Outreach Events

Configured data source IDs:

- Companies: `5e25023c-6c34-41ee-94cd-319d0b957c60`
- Outreach Events: `a872e9d9-2cef-4465-b636-b04ed0026368`

V0.1 writes only:

### Outreach Events
- Event
- Event Type
- Direction
- Channel
- Company
- Event Date
- Provider Message ID
- Provider Thread ID
- Provider URL
- Notes

### Companies
- Prospect Status, subject to non-downgrade rules
- Last Contact, only when the provider timestamp is newer

It intentionally preserves:

- Draft Release Status
- Canonical Draft ID
- QA Passed Message ID / timestamp
- Founder Approved Draft ID / Message ID / timestamp
- suppression / DNC state
- advanced/terminal Prospect Status

## Acceptance gates before production

Do not deploy as a production replacement merely because the code deploys.

### Gate 1 — Local / staging
- Typecheck passes.
- D1 schema applies.
- Health endpoint works.
- Pub/Sub JWT invalid requests are rejected.
- Admin watch route rejects incorrect admin tokens.

### Gate 2 — Synthetic Gmail history
- Non-SENT changes are ignored.
- Multi-recipient SENT fails closed.
- Unknown recipient fails closed.
- One matching recipient resolves exactly one Company.
- Existing Provider Message ID creates no duplicate.
- Retry after partial failure does not duplicate successful events.

### Gate 3 — Notion read-back
For a controlled SENT:
- exactly one Outreach Event by Provider Message ID;
- correct Company relation;
- correct provider timestamp and thread;
- Company Last Contact updated;
- lower prospect stage advances appropriately;
- advanced/terminal stage is preserved;
- QA / founder approval fields are byte-for-byte unchanged.

### Gate 4 — Idempotency
Replay the same Pub/Sub history range:
- zero duplicate Outreach Events;
- zero duplicate Company mutations;
- D1 shows the message as succeeded.

### Gate 5 — Controlled parallel run
Run V0.1 in observation/controlled mode alongside Outbound Sync — Lite.
Compare provider-backed outputs before changing production ownership.

### Gate 6 — Production cutover
Only after Jason approves:
- decide whether Lite remains fallback or is disabled;
- enable V0.1 production processing;
- update Gmail ↔ Notion heartbeat definition;
- document rollback.

## Known deliberate V0.1 limitation

### Draft release / canonical cleanup

The current chat-based sync can sometimes clear Canonical Draft ID and set Draft Release Status=SENT using chat context about the exact approved draft.

An event-driven worker must not guess this lineage.

V0.1 therefore leaves those fields untouched.

V0.2 should introduce an **immutable approved-draft snapshot ledger** captured before send, containing at minimum:

- Company page ID
- canonical Gmail draft ID
- draft message ID
- Gmail thread ID
- recipient
- subject
- approved timestamp
- QA-passed message ID
- founder-approved message ID
- optional normalized body hash

Only an exact matching provider SENT should be allowed to transition release/canonical state.

## Failure model

The Worker fails closed.

Examples:

- Gmail history cursor missing → 500 / no processing.
- Gmail history expired → no cursor advancement; requires explicit recovery.
- Notion company match 0 or >1 → fail message.
- Existing duplicate provider events → fail message.
- Notion write/read-back mismatch → fail message.
- Immutable QA/founder fields changed unexpectedly → fail message.
- Pub/Sub identity mismatch → reject.
- Retry while a live lease exists → fail/retry later.

## Production principle

Provider truth first.

A Gmail SENT message is real only because Gmail says it is SENT.
A CRM reconciliation is complete only after Notion read-back proves the unique Event and Company state.
A successful one-off does not make the entire system healthy until repeated operation and exception state support that conclusion.
