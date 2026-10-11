CREATE TABLE IF NOT EXISTS sync_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS processed_messages (
  provider_message_id TEXT PRIMARY KEY,
  provider_thread_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  event_type TEXT NOT NULL,
  company_page_id TEXT,
  notion_event_page_id TEXT,
  gmail_internal_date TEXT,
  status TEXT NOT NULL CHECK(status IN ('processing','succeeded','failed')),
  lease_expires_at TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_processed_messages_status
  ON processed_messages(status, lease_expires_at);

CREATE TABLE IF NOT EXISTS delivery_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pubsub_message_id TEXT,
  notification_history_id TEXT,
  status TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_delivery_log_created_at
  ON delivery_log(created_at);


CREATE TABLE IF NOT EXISTS approved_drafts (
  approval_id TEXT PRIMARY KEY,
  company_page_id TEXT NOT NULL,
  gmail_draft_id TEXT NOT NULL,
  draft_message_id TEXT NOT NULL,
  provider_thread_id TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  content_fingerprint TEXT NOT NULL,
  qa_passed_message_id TEXT NOT NULL,
  founder_approved_draft_id TEXT NOT NULL,
  founder_approved_message_id TEXT NOT NULL,
  founder_approved_at TEXT,
  state TEXT NOT NULL CHECK(state IN ('approved','consumed','invalidated')),
  sent_message_id TEXT,
  captured_at TEXT NOT NULL,
  consumed_at TEXT,
  invalidated_at TEXT,
  invalidation_reason TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_approved_drafts_exact_version
  ON approved_drafts(company_page_id, gmail_draft_id, draft_message_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_approved_drafts_one_active_company
  ON approved_drafts(company_page_id)
  WHERE state = 'approved';

CREATE INDEX IF NOT EXISTS idx_approved_drafts_thread
  ON approved_drafts(provider_thread_id, state);


CREATE TABLE IF NOT EXISTS sync_observations (
  provider_message_id TEXT PRIMARY KEY,
  provider_thread_id TEXT NOT NULL,
  recipient TEXT NOT NULL,
  company_page_id TEXT NOT NULL,
  predicted_event_type TEXT NOT NULL,
  provider_sent_at TEXT,
  existing_notion_event_id TEXT,
  approval_snapshot_state TEXT NOT NULL,
  approval_id TEXT,
  detail TEXT,
  observation_count INTEGER NOT NULL DEFAULT 1,
  first_observed_at TEXT NOT NULL,
  last_observed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sync_observations_company
  ON sync_observations(company_page_id, last_observed_at);
