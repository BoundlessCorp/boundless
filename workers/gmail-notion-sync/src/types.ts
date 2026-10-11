export interface Env {
  SYNC_DB: D1Database;

  GMAIL_USER: string;
  GMAIL_PUBSUB_TOPIC: string;
  PUBSUB_AUDIENCE: string;
  PUBSUB_SERVICE_ACCOUNT_EMAIL: string;

  NOTION_VERSION: string;
  NOTION_COMPANIES_DATA_SOURCE_ID: string;
  NOTION_OUTREACH_EVENTS_DATA_SOURCE_ID: string;

  PROCESS_OUTBOUND: string;
  PROCESS_INBOUND: string;
  FINALIZE_RELEASE_STATE: string;

  GMAIL_OAUTH_CLIENT_ID: string;
  GMAIL_OAUTH_CLIENT_SECRET: string;
  GMAIL_OAUTH_REFRESH_TOKEN: string;
  NOTION_TOKEN: string;
  ADMIN_TOKEN: string;
}

export interface PubSubPushBody {
  message?: {
    data?: string;
    messageId?: string;
    publishTime?: string;
  };
  subscription?: string;
}

export interface GmailNotification {
  emailAddress: string;
  historyId: string;
}

export interface GmailMessagePart {
  partId?: string;
  mimeType?: string;
  filename?: string;
  headers?: Array<{ name: string; value: string }>;
  body?: {
    attachmentId?: string;
    size?: number;
    data?: string;
  };
  parts?: GmailMessagePart[];
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  internalDate?: string;
  snippet?: string;
  payload?: GmailMessagePart;
}

export interface GmailDraft {
  id: string;
  message: GmailMessage;
}

export interface GmailHistoryResponse {
  history?: Array<{
    id: string;
    messagesAdded?: Array<{ message: { id: string; threadId: string } }>;
  }>;
  nextPageToken?: string;
  historyId?: string;
}

export interface NotionPage {
  id: string;
  url?: string;
  properties: Record<string, any>;
}

export interface NotionQueryResponse {
  results: NotionPage[];
  has_more?: boolean;
  next_cursor?: string | null;
}


export interface GmailThread {
  id: string;
  historyId?: string;
  messages?: GmailMessage[];
}


export interface ApprovedDraftSnapshot {
  approvalId: string;
  companyPageId: string;
  gmailDraftId: string;
  draftMessageId: string;
  providerThreadId: string;
  recipient: string;
  subject: string;
  contentFingerprint: string;
  qaPassedMessageId: string;
  founderApprovedDraftId: string;
  founderApprovedMessageId: string;
  founderApprovedAt: string | null;
  state: "approved" | "consumed" | "invalidated";
  sentMessageId?: string | null;
  capturedAt: string;
}
