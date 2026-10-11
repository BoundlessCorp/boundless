# V0.1 Acceptance Test Plan

## Test record

For every test record:

- test ID
- timestamp
- Gmail provider message ID
- Gmail thread ID
- recipient
- expected Company page
- expected event type
- expected Company state
- expected immutable fields
- D1 processing state
- actual result
- PASS / FAIL
- evidence URLs / IDs
- remediation if failed

## T01 — Health before watch

Expected:

- `gmailHistoryId = null`
- no secret values returned
- failed/processing counts readable

## T02 — Admin auth

Incorrect admin token → rejected.

Correct token → watch response stored.

## T03 — Watch seed

Initial `/admin/watch`:

- persists Gmail watch historyId
- persists expiration
- does not process historical mailbox blindly

Second watch renewal:

- updates expiration
- does not move the existing persisted history cursor

## T04 — Invalid Pub/Sub identity

Push with:
- wrong issuer
- wrong audience
- wrong service account
- expired token
- invalid signature

Expected: rejected, no Gmail/Notion mutation.

## T05 — Wrong Gmail account notification

Expected: rejected and delivery log records the account mismatch.

## T06 — Non-SENT mailbox change

Expected:
- no Notion Event
- no Company mutation
- cursor may advance after entire history range succeeds

## T07 — Unknown SENT recipient

Expected:
- message marked failed in D1
- no Event
- no Company mutation
- cursor does not advance
- Pub/Sub receives 5xx for retry / operator attention

## T08 — Multi-recipient SENT

Expected: fail closed; no Notion write.

## T09 — Valid first touch

Preconditions:
- exactly one Company with matching Primary Contact Email
- no existing Provider Message ID event
- no prior outbound event in Gmail thread

Expected:
- one First Touch Outreach Event
- Direction=Outbound
- Channel=Email
- exact Provider Message ID / Thread ID / provider timestamp
- correct Company relation
- Company Prospect Status advances to Contacted unless protected
- Last Contact reflects Gmail provider timestamp
- immutable QA/founder fields unchanged
- D1 status=succeeded

## T10 — Valid follow-up

Precondition: prior outbound Outreach Event exists in same Gmail thread.

Expected Event Type=Follow-Up and safe Company stage update.

## T11 — Advanced-stage preservation

Company already Responded / Qualified / Discovery Booked / DNC etc.

Expected:
- Event may reconcile if otherwise valid
- existing advanced/terminal Prospect Status remains unchanged

## T12 — Duplicate provider event already exists

Expected:
- no second Notion Event
- D1 may record existing reconciliation
- no duplicate mutation

## T13 — Replay same history

Expected:
- zero duplicate Events
- zero harmful state churn
- D1 identifies already-succeeded Provider Message ID

## T14 — Failure after Event creation

Force Company/read-back failure after event create.

Expected:
- D1 failed
- history cursor not advanced
- retry discovers existing Provider Message ID instead of creating duplicate
- operator can reconcile partial state safely

## T15 — Notion duplicate corruption

Create two Events with same Provider Message ID in test data.

Expected: worker fails and refuses to guess.

## T16 — Immutable field invariant

Snapshot before:
- QA Passed Message ID
- Founder Approved Draft ID
- Founder Approved Message ID

Expected after reconciliation: exact equality.

## T17 — Cursor safety

One message succeeds and one fails in same Gmail history range.

Expected:
- succeeded message remains deduped
- cursor remains at prior history ID
- retry safely replays range
- failed message can succeed later without duplicating first message

## T18 — Parallel Lite observation

For one controlled approved send:
- Worker and Outbound Sync — Lite run in observation-compatible setup
- compare resulting provider/event/company evidence
- do not permit both systems to create the same event without idempotency protection

## Exit criterion

V0.1 is deployable only when T01–T17 pass and T18 has a documented cutover plan.

V0.1 does not own Draft Release Status / Canonical Draft ID cleanup until approved-draft snapshot lineage is implemented and separately tested.
