import { nextProspectStatus, shouldAdvanceTimestamp } from "./policy";
import type { Env, GmailMessage, NotionPage, NotionQueryResponse } from "./types";
import { extractSingleRecipient, header } from "./gmail";

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
  const response = await notionFetch<NotionQueryResponse>(
    env,
    `/data_sources/${env.NOTION_COMPANIES_DATA_SOURCE_ID}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        filter: {
          property: "Primary Contact Email",
          email: { equals: email },
        },
        page_size: 3,
      }),
    },
  );

  if (response.results.length > 1) {
    throw new Error(
      `Company resolution is ambiguous for ${email}: found ${response.results.length} matches`,
    );
  }

  return response.results[0] ?? null;
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
  const sentAt = input.message.internalDate
    ? new Date(Number(input.message.internalDate)).toISOString()
    : new Date().toISOString();

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
    prospectStatus: propertySelect(company, "Prospect Status"),
    lastContact: propertyDate(company, "Last Contact"),
    draftReleaseStatus: propertySelect(company, "Draft Release Status"),
    canonicalDraftId: propertyText(company, "Canonical Draft ID"),
    qaPassedMessageId: propertyText(company, "QA Passed Message ID"),
    founderApprovedDraftId: propertyText(company, "Founder Approved Draft ID"),
    founderApprovedMessageId: propertyText(company, "Founder Approved Message ID"),
  };
}
