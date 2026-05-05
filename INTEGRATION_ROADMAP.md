# 🔌 Integration Roadmap - GoHighLevel, Google Analytics & Stripe

## Current Status: ✅ Frontend Ready for Integrations

Your site is now **integration-ready** with clean hooks for connecting your tech stack.

---

## 🎯 Planned Integrations

### 1. GoHighLevel (GHL) - CRM & Lead Management
**Purpose**: Capture and manage all leads automatically

**What you'll connect**:
- ✅ Booking form submissions → GHL contacts
- ✅ Phone call tracking → GHL activities
- ✅ Lead scoring and pipeline automation
- ✅ Email & SMS follow-up sequences

**Integration points in your code**:
```typescript
// File: src/components/CTASection.tsx
// Line 52: onSubmit handler

const handleSubmit = async (data: FormData) => {
  setIsSubmitting(true);
  
  // TODO: Send to GoHighLevel
  // POST to GHL webhook or API
  // const response = await fetch('YOUR_GHL_WEBHOOK_URL', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  
  setIsSubmitting(false);
  setShowConfetti(true);
};
```

**When to set up**:
- After GHL account is created
- After webhook URL is generated
- Before going live with ads

---

### 2. Google Analytics 4 - Conversion Tracking
**Purpose**: Measure traffic, conversions, and ROI

**What you'll track**:
- ✅ Page views (already set up!)
- ✅ CTA button clicks (already tracked!)
- ✅ Form submissions (already tracked!)
- ✅ Scroll depth
- ✅ Call button clicks (mobile)
- ✅ Revenue (with enhanced ecommerce)

**Integration points in your code**:
```typescript
// File: src/lib/analytics.ts
// Already scaffolded - just needs your GA4 ID

export const analytics = {
  trackPageView: (path: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
      });
    }
  },
  
  trackClick: (label: string, metadata?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'CTA',
        event_label: label,
        ...metadata,
      });
    }
  },
  
  // More tracking methods ready to use...
};
```

**Setup steps**:
1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `.env`:
   ```bash
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```
4. Add GA4 script to `src/layouts/main.astro`

---

### 3. Stripe - Payment Processing
**Purpose**: Accept deposits, payments, and recurring subscriptions

**What you'll enable**:
- ✅ Online deposit collection
- ✅ Invoice payments
- ✅ Recurring billing (maintenance plans)
- ✅ Secure checkout
- ✅ Payment links

**Integration approach**:
```typescript
// Option A: Stripe Payment Links (Easiest)
// No code needed - just generate links in Stripe dashboard
// Example:
<a href="https://buy.stripe.com/your_payment_link">
  Pay Deposit - $500
</a>

// Option B: Stripe Checkout (Recommended)
// File: src/pages/api/create-checkout-session.ts
import Stripe from 'stripe';

export const POST = async ({ request, locals }) => {
  const stripe = new Stripe(
    locals?.runtime?.env?.STRIPE_SECRET_KEY || 
    import.meta.env.STRIPE_SECRET_KEY
  );
  
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Project Deposit',
        },
        unit_amount: 50000, // $500.00
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${request.url}/success`,
    cancel_url: `${request.url}/cancel`,
  });
  
  return new Response(JSON.stringify({ url: session.url }));
};

// Option C: Stripe Elements (Advanced)
// Full custom checkout with card elements
// Already have @stripe/stripe-js installed!
```

**When to set up**:
- After deciding on payment flow
- Before launching paid services
- When ready to collect deposits

---

## 📋 Integration Checklist

### Pre-Launch (Do Before Going Live)

#### GoHighLevel Setup
- [ ] Create GHL account
- [ ] Set up pipeline stages
- [ ] Create custom fields (name, email, phone, project type, etc.)
- [ ] Generate webhook URL or API key
- [ ] Test form submission → GHL contact creation
- [ ] Set up automated follow-up sequences
- [ ] Configure SMS templates
- [ ] Set up email templates
- [ ] Test phone call logging

#### Google Analytics Setup
- [ ] Create GA4 property
- [ ] Get Measurement ID
- [ ] Add to environment variables
- [ ] Install GA4 script tag
- [ ] Set up conversion goals
- [ ] Test event tracking
- [ ] Configure enhanced ecommerce
- [ ] Set up custom reports
- [ ] Add team members
- [ ] Link Google Ads (if using)

#### Stripe Setup
- [ ] Create Stripe account
- [ ] Verify business details
- [ ] Get API keys (test & live)
- [ ] Add to environment variables
- [ ] Decide on payment flow
- [ ] Create products/prices
- [ ] Test payment flow
- [ ] Set up webhooks
- [ ] Configure email receipts
- [ ] Set up tax collection (if needed)

---

## 🔐 Environment Variables Reference

```bash
# .env file

# GoHighLevel
GHL_API_KEY=your_ghl_api_key_here
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/your_webhook_id

# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
# Optional: Google Ads conversion tracking
GOOGLE_ADS_ID=AW-XXXXXXXXXX
GOOGLE_ADS_CONVERSION_LABEL=your_conversion_label

# Stripe
STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXX  # Use pk_live_ for production
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXX  # Use sk_live_ for production
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXX

# Base44 (Already configured)
VITE_BASE44_WORKSPACE_ID=your_workspace_id
VITE_BASE44_APP_ID=your_app_id
```

---

## 🚀 Quick Start Guides

### GoHighLevel Integration (When Ready)

1. **Get your webhook URL**:
   - GHL Dashboard → Settings → Webhooks
   - Create new webhook
   - Copy URL

2. **Update booking form**:
   ```typescript
   // File: src/components/CTASection.tsx
   
   const handleSubmit = async (data: FormData) => {
     setIsSubmitting(true);
     
     try {
       const response = await fetch(import.meta.env.GHL_WEBHOOK_URL, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           name: data.name,
           email: data.email,
           phone: data.phone,
           projectType: data.projectType,
           timeline: data.timeline,
           message: data.message,
           source: 'Website Booking Form',
           tags: ['Website Lead', 'Painting Project'],
         }),
       });
       
       if (response.ok) {
         setShowConfetti(true);
         toast.success('Booking submitted! We\'ll call you within 24 hours.');
       }
     } catch (error) {
       toast.error('Something went wrong. Please call us directly.');
     } finally {
       setIsSubmitting(false);
     }
   };
   ```

3. **Test with live data**

---

### Google Analytics Integration (When Ready)

1. **Add GA4 script to layout**:
   ```astro
   <!-- File: src/layouts/main.astro -->
   
   <head>
     <!-- Existing head content -->
     
     <!-- Google Analytics -->
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXXXX');
     </script>
   </head>
   ```

2. **Events are already tracked**:
   - ✅ CTA clicks
   - ✅ Form submissions
   - ✅ Mobile call button
   - ✅ Scroll depth

3. **Verify in GA4**:
   - Realtime → Events
   - See clicks, page_views, form_submits

---

### Stripe Integration (When Ready)

**Option 1: Payment Links (Fastest)**
```tsx
// Add to confirmation email or booking flow
<a 
  href="https://buy.stripe.com/your_payment_link"
  className="btn-primary"
>
  Pay Your Deposit ($500)
</a>
```

**Option 2: Stripe Checkout (Recommended)**
```typescript
// 1. Create API route
// File: src/pages/api/create-checkout.ts

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const POST: APIRoute = async ({ request, locals }) => {
  const stripe = new Stripe(
    locals?.runtime?.env?.STRIPE_SECRET_KEY || 
    import.meta.env.STRIPE_SECRET_KEY
  );
  
  const { amount, description } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: description },
        unit_amount: amount * 100, // Convert to cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${new URL(request.url).origin}/payment-success`,
    cancel_url: `${new URL(request.url).origin}/booking`,
  });
  
  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// 2. Call from your component
const handlePayment = async () => {
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 500,
      description: 'Painting Project Deposit',
    }),
  });
  
  const { url } = await response.json();
  window.location.href = url;
};
```

---

## 🎯 Recommended Setup Order

### Week 1: Analytics
1. ✅ Set up Google Analytics
2. ✅ Verify tracking works
3. ✅ Create conversion goals
4. ✅ Add team members

**Why first**: You want data from day 1

---

### Week 2: Lead Capture
1. ✅ Set up GoHighLevel
2. ✅ Connect booking form
3. ✅ Test lead flow
4. ✅ Set up automations

**Why second**: Capture every lead from launch

---

### Week 3: Payments (Optional)
1. ✅ Set up Stripe
2. ✅ Create payment flow
3. ✅ Test transactions
4. ✅ Set up invoicing

**Why third**: Only needed after booking clients

---

## 📊 What's Already Built (Ready for Integrations)

### Analytics Tracking (src/lib/analytics.ts)
✅ Page view tracking  
✅ Click tracking  
✅ Form submit tracking  
✅ Custom event tracking  
✅ User identification  

### Form Handling (src/components/CTASection.tsx)
✅ Full booking form with validation  
✅ Loading states  
✅ Success animations  
✅ Error handling  
✅ Analytics events  

### Mobile Conversions (src/components/MobileCallButton.tsx)
✅ Click-to-call button  
✅ Analytics tracking  
✅ Scroll behavior  
✅ Responsive design  

---

## 🔒 Security Best Practices

### API Keys
```bash
# ❌ NEVER commit API keys to git
# ❌ NEVER expose secret keys in frontend code
# ✅ ALWAYS use environment variables
# ✅ ALWAYS use different keys for test/production

# Good:
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

# Bad:
const stripe = new Stripe('sk_live_abc123xyz'); // DON'T DO THIS!
```

### Environment Variables
```bash
# Local development (.env)
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXX

# Production (Cloudflare Workers)
# Add via: wrangler secret put STRIPE_SECRET_KEY
# Or in Cloudflare dashboard: Workers → Your App → Settings → Variables
```

---

## 💡 Pro Tips

### GoHighLevel
- Use custom fields for project type, timeline, budget
- Set up lead scoring based on form responses
- Create automated follow-up sequences (email + SMS)
- Tag leads by source (organic, paid, referral)

### Google Analytics
- Set up conversion goals ($$ value for each booking)
- Create custom reports for lead sources
- Use UTM parameters in ads
- Enable enhanced measurement

### Stripe
- Use test mode until ready to go live
- Set up automatic tax collection
- Enable email receipts
- Consider Stripe Terminal for in-person payments

---

## 📞 When You're Ready

Just let me know when you want to connect any of these:

**GoHighLevel**: "Connect GoHighLevel webhook"  
**Google Analytics**: "Add Google Analytics tracking"  
**Stripe**: "Set up Stripe payments"  

I'll guide you through the exact steps! 🚀

---

## Summary

✅ **Your site is integration-ready**  
✅ **Analytics hooks are in place**  
✅ **Form is ready for GHL**  
✅ **Stripe dependencies installed**  
✅ **No integrations connected yet** (waiting for your accounts)

When your GHL, GA4, and Stripe accounts are ready, we'll connect them in ~30 minutes total! 💪
