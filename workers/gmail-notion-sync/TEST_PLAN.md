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
- treated as ordinary non-prospect mail
- no Outreach Event
- no Company mutation
- no failed-message poison state
- history range may advance after all relevant processing succeeds

## T08 — Multi-recipient SENT

Expected:
- safely skipped because V0.1 only reconciles controlled one-recipient outreach
- no Notion write
- no cursor poison

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

Precondition: Gmail thread contains a prior provider-confirmed SENT message other than the current message.

Expected:
- Event Type=Follow-Up from Gmail provider truth
- safe Company stage update
- Notion event history is not required to classify the touch

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

## T18 — Gmail history expiry

Force an invalid/out-of-date startHistoryId.

Expected:
- Gmail 404 records a visible `gmail_history_gap`
- cursor does not advance
- normal processing stays paused
- /admin/history/reseed refuses without explicit acknowledgment + audit note
- approved reseed stores the current provider cursor and clears the gap

## T19 — Approved-draft snapshot gate

Attempt snapshot capture with each invalid condition:
- QA != PASS
- release != APPROVED
- canonical draft mismatch
- QA message mismatch
- founder draft/message mismatch
- missing Founder Approved At
- recipient mismatch
- Cc/Bcc present
- Gmail draft-message ID changed after approval

Expected: no approved ledger row.

Then capture one exact valid approved version.

Expected:
- one active immutable approved snapshot
- exact draft/version/thread/recipient/subject/fingerprint/audit IDs stored

## T20 — Approved SENT mismatch

With an active approved snapshot, alter subject/content/thread/recipient before sending.

Expected:
- provider SENT may be visible
- release finalization is refused
- Draft Release Status / Canonical Draft ID remain unchanged
- mismatch becomes a visible processing failure

## T21 — Exact approved SENT with finalization disabled

With a matching snapshot and `FINALIZE_RELEASE_STATE=false`:

Expected:
- normal Outreach Event / Company reconciliation succeeds
- snapshot match verifies
- Draft Release Status and Canonical Draft ID remain unchanged
- snapshot remains active for later controlled finalization

## T22 — Exact approved SENT with finalization enabled

After T19–T21 pass, enable `FINALIZE_RELEASE_STATE=true` in staging only.

Expected:
- exact matching provider SENT transitions Draft Release Status → SENT
- Canonical Draft ID is cleared
- QA/founder audit fields remain byte-for-byte unchanged
- approved snapshot becomes consumed with SENT message ID

## T23 — Release-finalization partial failure replay

Simulate Notion successfully committing SENT/clear but D1 snapshot consumption failing.

Expected on retry:
- already-finalized Notion state is recognized as valid
- no duplicate Event
- no second destructive transition
- ledger consumption completes safely

## T24 — Parallel Lite shadow observation

Run V0.1 with `WRITE_MODE=observe` alongside Outbound Sync — Lite for controlled provider events.

Expected:
- V0.1 records D1 observations with predicted Company, event type, existing Notion event state, and approval-snapshot match state
- V0.1 creates zero Outreach Events
- V0.1 performs zero Company mutations
- Gmail history cursor still advances after successful observation
- predictions are compared against provider-backed Lite/Notion outcomes
- mismatches become test evidence before any apply-mode cutover

## Exit criterion

Base event-driven reconciliation is deployable only when T01–T18 pass and T24 has a documented cutover plan.

Release-state finalization must remain disabled until T19–T23 all pass in staging. Only then may `FINALIZE_RELEASE_STATE=true` be considered for production under explicit founder approval.
