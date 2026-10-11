#!/usr/bin/env bash
set -euo pipefail

: "${GCP_PROJECT_ID:?Set GCP_PROJECT_ID}"
: "${WORKER_BASE_URL:?Set WORKER_BASE_URL, e.g. https://boundless-gmail-notion-sync.<subdomain>.workers.dev}"

TOPIC="${PUBSUB_TOPIC:-boundless-gmail-events}"
SUBSCRIPTION="${PUBSUB_SUBSCRIPTION:-boundless-gmail-push}"
PUSH_SA_NAME="${PUBSUB_PUSH_SA_NAME:-boundless-gmail-push}"
PUSH_ENDPOINT="${WORKER_BASE_URL%/}/pubsub/gmail"
AUDIENCE="${PUBSUB_AUDIENCE:-$PUSH_ENDPOINT}"

command -v gcloud >/dev/null 2>&1 || {
  echo "gcloud CLI is required." >&2
  exit 1
}

gcloud config set project "$GCP_PROJECT_ID" >/dev/null

echo "Enabling required APIs..."
gcloud services enable   gmail.googleapis.com   pubsub.googleapis.com   iamcredentials.googleapis.com

PROJECT_NUMBER="$(gcloud projects describe "$GCP_PROJECT_ID" --format='value(projectNumber)')"
PUSH_SA_EMAIL="${PUSH_SA_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com"
PUBSUB_SERVICE_AGENT="service-${PROJECT_NUMBER}@gcp-sa-pubsub.iam.gserviceaccount.com"

if ! gcloud pubsub topics describe "$TOPIC" >/dev/null 2>&1; then
  gcloud pubsub topics create "$TOPIC"
fi

# Gmail must be able to publish mailbox-watch notifications to the topic.
gcloud pubsub topics add-iam-policy-binding "$TOPIC"   --member="serviceAccount:gmail-api-push@system.gserviceaccount.com"   --role="roles/pubsub.publisher" >/dev/null

if ! gcloud iam service-accounts describe "$PUSH_SA_EMAIL" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$PUSH_SA_NAME"     --display-name="Boundless Gmail PubSub Push"
fi

# Pub/Sub signs the authenticated push OIDC token via its service agent.
gcloud projects add-iam-policy-binding "$GCP_PROJECT_ID"   --member="serviceAccount:${PUBSUB_SERVICE_AGENT}"   --role="roles/iam.serviceAccountTokenCreator" >/dev/null

if gcloud pubsub subscriptions describe "$SUBSCRIPTION" >/dev/null 2>&1; then
  gcloud pubsub subscriptions modify-push-config "$SUBSCRIPTION"     --push-endpoint="$PUSH_ENDPOINT"     --push-auth-service-account="$PUSH_SA_EMAIL"     --push-auth-token-audience="$AUDIENCE"
else
  gcloud pubsub subscriptions create "$SUBSCRIPTION"     --topic="$TOPIC"     --push-endpoint="$PUSH_ENDPOINT"     --push-auth-service-account="$PUSH_SA_EMAIL"     --push-auth-token-audience="$AUDIENCE"
fi

cat <<EOF

Google Cloud bootstrap complete.

Use these Worker vars:
GMAIL_PUBSUB_TOPIC=projects/${GCP_PROJECT_ID}/topics/${TOPIC}
PUBSUB_AUDIENCE=${AUDIENCE}
PUBSUB_SERVICE_ACCOUNT_EMAIL=${PUSH_SA_EMAIL}

Push endpoint:
${PUSH_ENDPOINT}

If subscription creation reports iam.serviceAccounts.actAs permission denied,
grant the operator creating/updating the subscription Service Account User
(roles/iam.serviceAccountUser) on:
${PUSH_SA_EMAIL}
EOF
