-- Per-message idempotency, retry ledger, and single-process lease.
CREATE TABLE IF NOT EXISTS sync_messages (
  message_id TEXT PRIMARY KEY NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_ms INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_ms INTEGER NOT NULL,
  updated_ms INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sync_messages_pending ON sync_messages(status,next_attempt_ms,created_ms);
CREATE TABLE IF NOT EXISTS sync_lock (
  id INTEGER PRIMARY KEY CHECK (id=1),
  lease_until INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO sync_lock(id,lease_until) VALUES(1,0);
