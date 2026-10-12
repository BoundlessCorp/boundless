# Boundless Gmail → Notion integration — review-ready, NOT deployed

This is an isolated Cloudflare Worker, not the live Boundless website. It only READS Gmail (gmail.readonly) and synchronizes actual SENT messages to existing Notion Company and Outreach Event records. It NEVER sends an email or changes existing QA/founder approval fields.

## Current state
The October 8–9 ChatGPT scheduled automations failed to write new Notion events and disabled themselves. The Oct 9 YZ email was manually reconciled on Oct 11 after the failure was confirmed. Do NOT count it as an unattended-sync success. All other 18 held drafts remain unsent; Pixo/Fixolution are STOP.

## Architecture
- Cloudflare cron every 10 minutes scans Gmail SENT AFTER a deliberately selected go-live Unix timestamp. No historical backfill by default.
- D1 stores a unique provider message ID ledger, atomic per-run lease, retry attempts, exponential backoff, failure descriptions.
- Exact recipient primary-email match must resolve to one Notion Company. No fuzzy matches, no new Company creation.
- New Notion Events use actual Gmail SENT provider ID and thread, direction Outbound, accurate timestamp and Company relation.
- On partial failure, retry looks up provider ID to avoid duplicate events. Company updates preserve advanced stages and all founder QA/approval IDs.
- Canonical drafts are cleared only when the stored QA/founder version evidence agrees AND the associated draft has disappeared from Gmail. Ambiguous situations require manual review.
- Default WRITES_ENABLED=false: dry-run logs and D1 only; no changes to Notion. Cloudflare logs and optional trusted alert webhook capture errors.

## What you need to do privately
1. In Cloudflare, authorize a standalone Worker and D1 database named boundless-gmail-notion-sync. No changes to boundlesscorp.ca's existing deployment.
2. In Google Cloud Console, enable Gmail API; set up OAuth consent and a client for Boundless, with gmail.readonly scope, authorize jason@boundlesscorp.ca, and obtain an OFFLINE refresh token. A testing-mode OAuth application may issue short-lived refresh tokens; configure/publish appropriately. The ChatGPT Gmail connection cannot supply these credentials to your independent Worker.
3. In Notion, create a least-privilege internal integration with read/insert/update content capabilities and grant it access to the existing DB • Companies and DB • Outreach Events. Obtain the integration token.
4. Store GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN and NOTION_TOKEN only as Cloudflare Worker secrets, not in this repository or chat. Optional ALERT_WEBHOOK_URL is a user-controlled trusted endpoint for notifications.
5. Before enabling writes, review the dry-run logs and D1 rows, then approve go-live. A NEW, individually approved email must be used to prove autonomous Notion Event + Company write followed by read-back, idempotency, and retry behavior.

## Commands (run from repository root with authenticated Cloudflare account)
Copy ops/gmail-notion-sync/wrangler.example.jsonc to ops/gmail-notion-sync/wrangler.jsonc. Edit the copied file locally: enter the real D1 database UUID and a NEW go-live START_AFTER_UNIX timestamp. Do not alter the root website wrangler.jsonc.

  cd ops/gmail-notion-sync
  npx wrangler d1 create boundless-gmail-notion-sync
  # paste the returned D1 UUID into your local wrangler.jsonc
  npx wrangler d1 migrations apply boundless-gmail-notion-sync --remote --config wrangler.jsonc
  npx wrangler secret put GOOGLE_CLIENT_ID --config wrangler.jsonc
  npx wrangler secret put GOOGLE_CLIENT_SECRET --config wrangler.jsonc
  npx wrangler secret put GOOGLE_REFRESH_TOKEN --config wrangler.jsonc
  npx wrangler secret put NOTION_TOKEN --config wrangler.jsonc
  npx wrangler deploy --config wrangler.jsonc
  npx wrangler tail boundless-gmail-notion-sync --config wrangler.jsonc

Do not recreate a preexisting D1 database. The Worker has no public HTTP endpoint. Unit tests run from the repo root using: node --test ops/gmail-notion-sync/src/worker.test.mjs.

## Go-live checks
Dry-run (WRITES_ENABLED=false) must show successful Gmail and Notion authentication, selected published company identities, zero permission errors, and zero unexpected duplicates. Set WRITES_ENABLED=true only after independent review; redeploy. One new approved real SENT message must generate exactly one Notion Event and correct Company Contacted/Follow-Up, Last Contact, SENT draft state when supported by exact approval evidence, and preserve original QA/founder IDs. Run again and confirm no duplicate. Test transient Notion failure and retry in staging. No bulk sending from this Worker.

## Failure handling and limits
Pause cron trigger immediately if errors appear; inspect D1 failed message IDs and Notion exact Provider Message ID before any manual repair. The Worker intentionally leaves unresolved matches and canonical-draft ambiguity for review. Google Gmail polling is not instantaneous push delivery. D1 lease reduces concurrent creates, but Notion has no uniqueness constraint: deploy only a single writer and keep an audit. Email replies, bounces and DNC updates are OUT OF SCOPE; retain the separate Reply & Suppression Watch.

## Inspected source IDs
NOTION_COMPANIES_SOURCE=5e25023c-6c34-41ee-94cd-319d0b957c60
NOTION_EVENTS_SOURCE=a872e9d9-2cef-4465-b636-b04ed0026368
Notion API version 2025-09-03, Google OAuth Gmail readonly.

STATUS: CODE AND DOCS ONLY. No Worker, D1, Google OAuth, or external Notion integration has been provisioned or deployed through ChatGPT.