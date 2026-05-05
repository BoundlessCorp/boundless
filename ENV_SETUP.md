


# Environment Setup Guide

This guide will help you configure the necessary environment variables for the Boundless application.

## Quick Start

1. Copy `.env.example` to `.env` (if not already done)
2. Fill in the required values from your Base44 and Resend accounts
3. Restart the development server

## Environment Variables

### Base44 Configuration

The application uses Base44 for authentication and user management. You'll need:

```env
PUBLIC_BASE44_APP_ID=your_app_id_here
PUBLIC_BASE44_ENVIRONMENT=development  # or 'production' for live
```

**How to get these values:**

1. Go to [Base44 Dashboard](https://base44.ai)
2. Navigate to your app's settings
3. Copy your App ID
4. Set the environment based on whether you're developing locally or deploying to production

### Resend Email Configuration

The application uses Resend for transactional emails (lead notifications, auto-responders). You'll need:

```env
RESEND_API_KEY=re_your_api_key_here
```

**How to get this value:**

1. Go to [Resend Dashboard](https://resend.com)
2. Sign up or log in to your account
3. Navigate to API Keys
4. Create a new API key or copy an existing one
5. Paste it into your `.env` file

**What this is used for:**

- Sending lead notification emails to `jason@boundlesscorp.ca`
- Sending auto-responder emails to new leads
- VIP list signup notifications
- Strategy call booking confirmations

**Email sender domain:**

- Current sender: `noreply@boundlesscorp.ca` and `jason@boundlesscorp.ca`
- You can verify this domain in your Resend dashboard under "Domains"
- For testing, Resend allows you to send emails without domain verification (limited to your own email)

### Optional: Analytics

### Google Analytics 4 Configuration

The application supports Google Analytics 4 for tracking user behavior, conversions, and marketing ROI. You'll need:

```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**How to get this value:**

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new GA4 property (or use existing)
3. Set up a web data stream
4. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
5. Paste it into your `.env` file

**What this tracks:**

- Page views and navigation
- Form submissions and lead generation
- Phone call clicks
- CTA button interactions
- Scroll depth and engagement
- Traffic sources and campaign performance

**See detailed setup guide:** `GOOGLE_ANALYTICS_SETUP.md`

## Variable Descriptions

### Webflow Variables
- **WEBFLOW_API_HOST**: Webflow API endpoint (default: https://api.webflow.com)
- **WEBFLOW_SITE_API_TOKEN**: Your Webflow site API token
- **WEBFLOW_CMS_SITE_API_TOKEN**: Your Webflow CMS collection API token

### Base44 Variables
- **PUBLIC_APP_ID**: Your Base44 app ID (from Base44 dashboard)
- **PUBLIC_API_BASE_URL**: Base44 API endpoint (default: https://api.base44.com)

### Analytics Variables
- **PUBLIC_GA_MEASUREMENT_ID**: Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)

## Getting Your Tokens

### Webflow Tokens
1. Go to your Webflow site settings
2. Navigate to Apps & Integrations
3. Generate site and CMS API tokens

### Base44 App ID
1. Log in to your Base44 dashboard
2. Find your app in the apps list
3. Copy your app ID from the app settings

## Security Notes

⚠️ **Never commit your `.env` file to version control!**

- The `.env` file is already in `.gitignore`
- Only share tokens through secure channels
- Rotate tokens if they're exposed
- Use different tokens for development and production




