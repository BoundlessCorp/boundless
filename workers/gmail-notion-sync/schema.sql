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
