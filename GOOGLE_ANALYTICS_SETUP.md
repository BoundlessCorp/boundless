# Google Analytics 4 Integration Guide

## ✅ What's Been Installed

Google Analytics 4 (GA4) has been fully integrated into your Boundless website with advanced tracking capabilities!

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Google Analytics Account

1. Go to **https://analytics.google.com**
2. Click **"Start measuring"**
3. Enter your account details:
   - Account name: `Boundless`
   - Country: `Canada`
   - Currency: `CAD - Canadian Dollar`

### Step 2: Create a Property

1. Property name: `Boundless Website`
2. Time zone: `(GMT-08:00) Pacific Time`
3. Currency: `CAD - Canadian Dollar`
4. Click **"Next"**

### Step 3: Configure Business Details

1. Industry: `Home Improvement` or `Professional Services`
2. Business size: Select your team size
3. How you plan to use Google Analytics:
   - ✅ Measure advertising ROI
   - ✅ Examine user behavior
   - ✅ Get to know your customers

### Step 4: Create Data Stream

1. Choose platform: **Web**
2. Website URL: `https://yourdomain.com` (or your actual domain)
3. Stream name: `Boundless Main Site`
4. Click **"Create stream"**

### Step 5: Get Your Measurement ID

1. After creating the stream, you'll see your **Measurement ID**
   - Format: `G-XXXXXXXXXX`
2. **Copy this ID** - you'll need it next!

### Step 6: Add Measurement ID to Your Website

1. Open your `.env` file in the project
2. Add this line:
   ```env
   PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   *(Replace `G-XXXXXXXXXX` with your actual Measurement ID)*

3. Save the file and restart your dev server

---

## 🎯 What Gets Tracked Automatically

### ✅ Core Events
- **Page Views** - Every page visit
- **Scroll Depth** - 25%, 50%, 75%, 100%
- **Session Duration** - How long visitors stay
- **Traffic Sources** - Where visitors come from

### ✅ Lead Generation Events
- **CTA Clicks** - "Book a Call", "Get Started", etc.
- **Form Submissions** - Contact forms, booking forms
- **Email Captures** - When visitors submit their email
- **Phone Clicks** - When mobile users tap your phone number

### ✅ Conversion Tracking
- **Booking Started** - When someone clicks booking CTA
- **Lead Generated** - Form submission completed
- **Phone Contact** - Phone number clicked
- **Email Contact** - Email link clicked

### ✅ User Behavior
- **Button Clicks** - All CTA interactions
- **Navigation** - How users move through your site
- **Engagement** - Time on page, interactions

---

## 📊 Key Reports to Check

### 1. **Realtime Report**
- See live visitors on your site
- Path: `Reports → Realtime`
- **Use case:** Test if tracking works immediately

### 2. **Acquisition Report**
- Where your traffic comes from
- Path: `Reports → Acquisition → Traffic acquisition`
- **Use case:** See which marketing channels work best

### 3. **Engagement Report**
- Most visited pages
- Path: `Reports → Engagement → Pages and screens`
- **Use case:** Know which content resonates

### 4. **Conversions**
- Track lead generation
- Path: `Reports → Conversions`
- **Use case:** Measure form submissions and calls

### 5. **User Snapshot**
- Demographics and interests
- Path: `Reports → User → Demographics`
- **Use case:** Understand your audience

---

## 🔔 Set Up Custom Alerts (Recommended)

### Get Notified When:

1. **Traffic Spike** *(Good sign!)*
   - Admin → Custom alerts → New alert
   - Condition: Sessions increase by 50%
   - Notification: Email

2. **Traffic Drop** *(Needs attention)*
   - Condition: Sessions decrease by 50%
   - Check for issues immediately

3. **Conversion Event** *(New lead!)*
   - Set up email notifications for `generate_lead` event
   - Get instant alerts when someone books

---

## 🎯 Create Custom Conversions

Track these as conversions for better ROI measurement:

### 1. Lead Conversions
```
Event name: generate_lead
Description: Form submission
Counting method: Once per session
```

### 2. Phone Call Conversions
```
Event name: contact
Description: Phone number clicked
Counting method: Once per session
```

### 3. Booking Started
```
Event name: begin_checkout
Description: Booking CTA clicked
Counting method: Once per session
```

**How to set up:**
1. Go to **Admin → Events**
2. Click **"Mark as conversion"** for these events
3. They'll now appear in your Conversions report

---

## 📈 Connect Google Ads (Optional)

If you run Google Ads for lead generation:

1. In GA4, go to **Admin → Google Ads Links**
2. Click **"Link"**
3. Select your Google Ads account
4. Enable auto-tagging
5. Click **"Submit"**

**Benefits:**
- See which ads drive conversions
- Optimize ad spend
- Retarget website visitors

---

## 🔍 Advanced Tracking Events

Your site tracks these custom events automatically:

| Event Name | When It Fires | Data Collected |
|------------|--------------|----------------|
| `page_view` | Every page load | Path, title, referrer |
| `click` | CTA button clicked | Button text, location |
| `generate_lead` | Form submitted | Form name, timestamp |
| `contact` | Phone/email clicked | Method (phone/email) |
| `begin_checkout` | Booking started | Button text |
| `scroll` | User scrolls page | Depth percentage |
| `sign_up` | Email captured | Form name |

---

## 🛠️ Debugging & Testing

### Test Your Setup

1. **Open your website** in a browser
2. **Open browser console** (F12 → Console)
3. Look for this message:
   ```
   [Analytics] Google Analytics 4 initialized: G-XXXXXXXXXX
   ```

4. **Click buttons** and check for tracking events:
   ```
   [Analytics Event] { event: 'click', properties: {...} }
   ```

### Check Realtime Report

1. Go to **https://analytics.google.com**
2. Navigate to **Reports → Realtime**
3. Open your website in another tab
4. You should see **1 user** active
5. Click buttons/forms - events should appear instantly

### Troubleshooting

**Problem:** Events not showing in GA4

**Solutions:**
1. ✅ Check `.env` has correct Measurement ID
2. ✅ Restart dev server after adding ID
3. ✅ Disable ad blockers (they block GA)
4. ✅ Wait 24-48 hours for full reports (Realtime shows instantly)

**Problem:** Measurement ID not working

**Check:**
- Format is `G-XXXXXXXXXX` (capital G, hyphen)
- Added to `.env` with `PUBLIC_` prefix
- No quotes or extra spaces

---

## 📱 Enhanced E-commerce (Future)

When you add payment processing:

```typescript
// Track when payment is completed
analytics.trackConversion('purchase', {
  value: 5000,
  currency: 'CAD',
  transaction_id: 'TXN-12345'
});
```

This is already set up in your `analytics.ts` file!

---

## 🎨 Custom Dashboard (Quick Wins)

Create a dashboard for daily monitoring:

1. Go to **Explore** → **Blank**
2. Add these metrics:
   - **Users** (last 7 days)
   - **Sessions** (last 7 days)
   - **Conversions** (all time)
   - **Average engagement time**

3. Add these dimensions:
   - **Source/Medium** (traffic sources)
   - **Page path** (most visited pages)

4. Save as **"Boundless Daily Dashboard"**

---

## 🔐 Privacy & Compliance

### Already Configured:
- ✅ Cookie flags set to `SameSite=None;Secure`
- ✅ Email addresses are hashed (not stored plainly)
- ✅ IP anonymization ready (GA4 default)

### Recommended:
1. Add Cookie Consent Banner (Cookiebot, OneTrust)
2. Update Privacy Policy to mention Google Analytics
3. Add opt-out link for users who don't want tracking

---

## 📊 Sample Goals to Track

### Month 1:
- ✅ 500+ page views
- ✅ 50+ form submissions
- ✅ 20+ phone calls
- ✅ Average 2min engagement time

### Month 2:
- ✅ 1,000+ page views
- ✅ 100+ form submissions
- ✅ 40+ phone calls
- ✅ 5% conversion rate

### Month 3:
- ✅ 2,000+ page views
- ✅ 200+ form submissions
- ✅ 80+ phone calls
- ✅ 10% conversion rate

---

## 🚀 Next Steps

1. **Today:** Set up GA4 account and add Measurement ID
2. **This Week:** Check Realtime reports daily
3. **Week 2:** Review first week's data
4. **Week 3:** Set up custom alerts
5. **Month 2:** Create custom dashboard
6. **Month 3:** Connect Google Ads (if running ads)

---

## 📞 Quick Reference

**GA4 Dashboard:** https://analytics.google.com  
**Measurement ID Location:** Admin → Data Streams → Web  
**Realtime Report:** Reports → Realtime  
**Conversions:** Reports → Conversions  

**Environment Variable Format:**
```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🎯 Expected Benefits

- 📈 **Data-Driven Decisions** - Know what works
- 💰 **Better ROI** - Optimize marketing spend
- 🎯 **Audience Insights** - Understand your visitors
- 🔄 **Continuous Improvement** - A/B test everything
- 📊 **Prove Results** - Show growth over time

---

## ✅ Checklist

- [ ] Create Google Analytics account
- [ ] Set up GA4 property
- [ ] Create web data stream
- [ ] Copy Measurement ID
- [ ] Add to `.env` file (as `PUBLIC_GA_MEASUREMENT_ID`)
- [ ] Restart dev server
- [ ] Test in Realtime report
- [ ] Set up custom alerts
- [ ] Mark conversions
- [ ] Create dashboard
- [ ] Review weekly reports

---

**You're all set!** Google Analytics is now tracking your Boundless website automatically. 🎉

Questions? Check the console logs or Realtime report to verify tracking is working!
