import { nextProspectStatus, shouldAdvanceTimestamp } from "./policy";
import type { Env, GmailMessage, NotionPage, NotionQueryResponse } from "./types";
import { extractSingleRecipient, header, providerSentAt } from "./gmail";

const NOTION_API = "https://api.notion.com/v1";

async function notionFetch<T>(env: Env, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${NOTION_API}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.NOTION_TOKEN}`,
      "notion-version": env.NOTION_VERSION,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Notion API ${response.status}: ${await response.text()}`);
  }

  return response.json<T>();
}

function richText(value: string) {
  return { rich_text: value ? [{ type: "text", text: { content: value } }] : [] };
}

function title(value: string) {
  return { title: [{ type: "text", text: { content: value } }] };
}

function select(value: string) {
  return { select: { name: value } };
}

function relation(pageId: string) {
  return { relation: [{ id: pageId }] };
}

function date(value: string) {
  return { date: { start: value } };
}

function url(value: string) {
  return { url: value };
}

function propertyText(page: NotionPage, name: string): string {
  const prop = page.properties[name];
  if (!prop) return "";
  if (prop.type === "title") return prop.title?.map((x: any) => x.plain_text ?? "").join("") ?? "";
  if (prop.type === "rich_text") return prop.rich_text?.map((x: any) => x.plain_text ?? "").join("") ?? "";
  if (prop.type === "email") return prop.email ?? "";
  return "";
}

function propertySelect(page: NotionPage, name: string): string | null {
  return page.properties[name]?.select?.name ?? null;
}

function propertyDate(page: NotionPage, name: string): string | null {
  return page.properties[name]?.date?.start ?? null;
}

export async function findCompanyByPrimaryEmail(env: Env, email: string): Promise<NotionPage | null> {
  // A single exact-match filter is insufficient: a second Company might store
  // the same mailbox with different capitalization. Never guess in that case.
  const normalized = email.trim().toLowerCase();
  if (!normalized) throw new Error("Cannot resolve blank Company email");
  const matches: NotionPage[] = [];
  let cursor: string | null | undefined;
  let pages = 0;

  do {
    if (++pages > 100) throw new Error("Company lookup exceeded 100 pages; refusing incomplete identity check");
    const page = await notionFetch<NotionQueryResponse>(
      env,
      `/data_sources/${env.NOTION_COMPANIES_DATA_SOURCE_ID}/query`,
      {
        method: "POST",
        body: JSON.stringify({
          filter: { property: "Primary Contact Email", email: { is_not_empty: true } },
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
        }),
      },
    );

    for (const company of page.results) {
      if (propertyText(company, "Primary Contact Email").trim().toLowerCase() === normalized) {
        matches.push(company);
        if (matches.length > 1) {
          throw new Error(
            `Company resolution is ambiguous for ${email}: multiple case-insensitive matches`,
          );
        }
      }
    }

    if (page.has_more && !page.next_cursor) {
      throw new Error("Incomplete Notion Company lookup: pagination cursor missing");
    }
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);

  return matches[0] ?? null;
}

export async function findOutreachEventByProviderMessageId(
  env: Env,
  providerMessageId: string,
): Promise<NotionPage | null> {
  const response = await notionFetch<NotionQueryResponse>(
    env,
    `/data_sources/${env.NOTION_OUTREACH_EVENTS_DATA_SOURCE_ID}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        filter: {
          property: "Provider Message ID",
          rich_text: { equals: providerMessageId },
        },
        page_size: 2,
      }),
    },
  );

  if (response.results.length > 1) {
    throw new Error(`Duplicate Outreach Events already exist for provider message ${providerMessageId}`);
  }
  return response.results[0] ?? null;
}

export async function hasPriorOutboundInThread(env: Env, providerThreadId: string): Promise<boolean> {
  const response = await notionFetch<NotionQueryResponse>(
    env,
    `/data_sources/${env.NOTION_OUTREACH_EVENTS_DATA_SOURCE_ID}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        filter: {
          and: [
            { property: "Provider Thread ID", rich_text: { equals: providerThreadId } },
            { property: "Direction", select: { equals: "Outbound" } },
          ],
        },
        page_size: 1,
      }),
    },
  );
  return response.results.length > 0;
}

export async function createOutboundEvent(
  env: Env,
  input: {
    message: GmailMessage;
    company: NotionPage;
    eventType: "First Touch" | "Follow-Up";
  },
): Promise<NotionPage> {
  const sentAt = providerSentAt(input.message);

  const companyName = propertyText(input.company, "Company Name") || "Company";
  const recipient = extractSingleRecipient(input.message);
  const subject = header(input.message, "Subject");

  return notionFetch<NotionPage>(env, "/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "data_source_id", data_source_id: env.NOTION_OUTREACH_EVENTS_DATA_SOURCE_ID },
      properties: {
        Event: title(`${input.eventType} — ${companyName} — ${sentAt.slice(0, 10)}`),
        "Event Type": select(input.eventType),
        Direction: select("Outbound"),
        Channel: select("Email"),
        Company: relation(input.company.id),
        "Event Date": date(sentAt),
        "Provider Message ID": richText(input.message.id),
        "Provider Thread ID": richText(input.message.threadId),
        "Provider URL": url(`https://mail.google.com/mail/u/0/#all/${input.message.id}`),
        Notes: richText(
          `Event-driven reconciliation of provider-confirmed Gmail SENT. Recipient=${recipient ?? "unknown"}; subject=${subject || "(none)"}. No send authority exercised by sync worker.`,
        ),
      },
    }),
  });
}

const NON_DOWNGRADABLE_PROSPECT_STATUSES = new Set([
  "Responded",
  "Qualified",
  "Discovery Booked",
  "Not Interested",
  "Not a Fit",
  "No Response",
  "Do Not Contact",
  "Future Opportunity",
]);

export async function reconcileCompanyAfterOutbound(
  env: Env,
  company: NotionPage,
  eventType: "First Touch" | "Follow-Up",
  sentAt: string,
): Promise<void> {
  const currentStatus = propertySelect(company, "Prospect Status");
  const currentLastContact = propertyDate(company, "Last Contact");

  const properties: Record<string, unknown> = {};

  const nextStatus = nextProspectStatus(currentStatus, eventType);
  if (nextStatus) {
    properties["Prospect Status"] = select(nextStatus);
  }

  if (shouldAdvanceTimestamp(currentLastContact, sentAt)) {
    properties["Last Contact"] = date(sentAt);
  }

  // V0.1 deliberately does NOT mutate Draft Release Status, Canonical Draft ID,
  // QA Passed Message ID, or Founder Approved fields. Exact draft->SENT lineage
  // requires an immutable approved-draft snapshot before those fields may be changed safely.

  if (Object.keys(properties).length === 0) return;

  await notionFetch(env, `/pages/${company.id}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });
}

export async function fetchPage(env: Env, pageId: string): Promise<NotionPage> {
  return notionFetch(env, `/pages/${pageId}`);
}

export async function verifyReconciliation(
  env: Env,
  input: {
    providerMessageId: string;
    companyPageId: string;
    eventPageId: string;
    sentAt: string;
  },
): Promise<void> {
  const [event, company] = await Promise.all([
    fetchPage(env, input.eventPageId),
    fetchPage(env, input.companyPageId),
  ]);

  if (propertyText(event, "Provider Message ID") !== input.providerMessageId) {
    throw new Error("Read-back failed: Outreach Event provider message ID mismatch");
  }

  const companyRelation = event.properties.Company?.relation ?? [];
  if (!companyRelation.some((r: any) => r.id === input.companyPageId)) {
    throw new Error("Read-back failed: Outreach Event company relation mismatch");
  }

  const lastContact = propertyDate(company, "Last Contact");
  if (!lastContact || new Date(lastContact).getTime() < new Date(input.sentAt).getTime()) {
    throw new Error("Read-back failed: Company Last Contact is older than provider SENT");
  }

  const duplicate = await findOutreachEventByProviderMessageId(env, input.providerMessageId);
  if (!duplicate || duplicate.id !== input.eventPageId) {
    throw new Error("Read-back failed: provider message ID uniqueness check failed");
  }
}

export function companyAuditSnapshot(company: NotionPage) {
  return {
    companyName: propertyText(company, "Company Name"),
    primaryContactEmail: propertyText(company, "Primary Contact Email"),
    prospectStatus: propertySelect(company, "Prospect Status"),
    lastContact: propertyDate(company, "Last Contact"),
    outreachQaStatus: propertySelect(company, "Outreach QA Status"),
    draftReleaseStatus: propertySelect(company, "Draft Release Status"),
    canonicalDraftId: propertyText(company, "Canonical Draft ID"),
    qaPassedMessageId: propertyText(company, "QA Passed Message ID"),
    founderApprovedDraftId: propertyText(company, "Founder Approved Draft ID"),
    founderApprovedMessageId: propertyText(company, "Founder Approved Message ID"),
    founderApprovedAt: propertyDate(company, "Founder Approved At"),
  };
}

export function assertCompanyApprovalForDraft(
  company: NotionPage,
  input: {
    draftId: string;
    draftMessageId: string;
    recipient: string;
  },
) {
  const snapshot = companyAuditSnapshot(company);
  const errors: string[] = [];

  if (snapshot.outreachQaStatus !== "PASS") errors.push("Outreach QA Status must be PASS");
  if (snapshot.draftReleaseStatus !== "APPROVED") errors.push("Draft Release Status must be APPROVED");
  if (snapshot.canonicalDraftId !== input.draftId) errors.push("Canonical Draft ID mismatch");
  if (snapshot.qaPassedMessageId !== input.draftMessageId) errors.push("QA Passed Message ID mismatch");
  if (snapshot.founderApprovedDraftId !== input.draftId) errors.push("Founder Approved Draft ID mismatch");
  if (snapshot.founderApprovedMessageId !== input.draftMessageId) {
    errors.push("Founder Approved Message ID mismatch");
  }
  if (!snapshot.founderApprovedAt) errors.push("Founder Approved At is missing");
  if (snapshot.primaryContactEmail.trim().toLowerCase() !== input.recipient.trim().toLowerCase()) {
    errors.push("Primary Contact Email does not match Gmail draft recipient");
  }

  if (errors.length) {
    throw new Error(`Approval snapshot refused: ${errors.join("; ")}`);
  }

  return snapshot;
}

export async function finalizeCompanyReleaseAfterExactSent(
  env: Env,
  input: {
    companyPageId: string;
    gmailDraftId: string;
    draftMessageId: string;
    qaPassedMessageId: string;
    founderApprovedDraftId: string;
    founderApprovedMessageId: string;
    founderApprovedAt: string | null;
  },
): Promise<void> {
  const company = await fetchPage(env, input.companyPageId);
  const before = companyAuditSnapshot(company);

  const auditMatches =
    before.qaPassedMessageId === input.qaPassedMessageId &&
    before.founderApprovedDraftId === input.founderApprovedDraftId &&
    before.founderApprovedMessageId === input.founderApprovedMessageId &&
    before.founderApprovedAt === input.founderApprovedAt;

  if (!auditMatches) {
    throw new Error("Release-state safety invariant failed: approval audit fields no longer match snapshot");
  }

  // Idempotent recovery: Notion may have committed the release transition even
  // if D1 consumption failed immediately afterward.
  if (before.draftReleaseStatus === "SENT" && before.canonicalDraftId === "") {
    return;
  }

  assertCompanyApprovalForDraft(company, {
    draftId: input.gmailDraftId,
    draftMessageId: input.draftMessageId,
    recipient: before.primaryContactEmail,
  });

  await notionFetch(env, `/pages/${input.companyPageId}`, {
    method: "PATCH",
    body: JSON.stringify({
      properties: {
        "Draft Release Status": select("SENT"),
        "Canonical Draft ID": richText(""),
      },
    }),
  });

  const after = companyAuditSnapshot(await fetchPage(env, input.companyPageId));
  if (after.draftReleaseStatus !== "SENT" || after.canonicalDraftId !== "") {
    throw new Error("Release-state read-back failed after exact approved SENT");
  }

  if (
    input.qaPassedMessageId !== after.qaPassedMessageId ||
    input.founderApprovedDraftId !== after.founderApprovedDraftId ||
    input.founderApprovedMessageId !== after.founderApprovedMessageId ||
    input.founderApprovedAt !== after.founderApprovedAt
  ) {
    throw new Error("Release-state safety invariant failed: approval audit fields changed");
  }
}
