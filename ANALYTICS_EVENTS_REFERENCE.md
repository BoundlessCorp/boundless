# Google Analytics Events Reference

Quick reference guide for all tracked events in your Boundless website.

---

## 🎯 Automatic Events (No Code Needed)

These events fire automatically when users interact with your site:

### Core Navigation Events

| Event Name | When It Fires | Properties Tracked |
|------------|--------------|-------------------|
| `page_view` | Every page load | `page_path`, `page_title`, `page_location`, `referrer` |
| `scroll` | User scrolls to 25%, 50%, 75%, 100% | `depth` (25/50/75/100) |

### Lead Generation Events

| Event Name | When It Fires | Properties Tracked |
|------------|--------------|-------------------|
| `click` | Any button/link clicked | `element`, `text`, `href` |
| `generate_lead` | Form submitted | `form_name`, timestamp |
| `contact` | Phone/email clicked | `method` (phone/email), contact info |
| `sign_up` | Email captured | `method` (email), `form_name` |
| `begin_checkout` | Booking CTA clicked | `button_text` |

### Engagement Events

| Event Name | When It Fires | Properties Tracked |
|------------|--------------|-------------------|
| `select_content` | Specific content clicked | `content_type` (button), `item_id` |
| `form_submit` | Any form submission | `form_name` |

---

## 📊 Where to Find These in GA4

### Real-time Tracking
**Path:** Reports → Realtime → Event count by Event name

**Shows:** Live events as they happen

**Use case:** Test if tracking works immediately

### Historical Data
**Path:** Reports → Engagement → Events

**Shows:** All events over time with metrics

**Use case:** Analyze trends and patterns

### Conversion Tracking
**Path:** Reports → Conversions

**Shows:** Events marked as conversions

**Use case:** Measure business goals

---

## 🎯 Recommended Conversion Events

Mark these as conversions in GA4:

1. **`generate_lead`** - Form submission
2. **`contact`** - Phone/email clicked  
3. **`begin_checkout`** - Booking started
4. **`sign_up`** - Email captured

**How to mark:**
1. Go to Admin → Events
2. Find the event
3. Toggle "Mark as conversion"

---

## 📱 Event Examples

### Example 1: User Books a Call
```
1. page_view → /
2. scroll → depth: 50
3. click → element: "cta_button"
4. begin_checkout → button_text: "Book Your Free Call"
5. generate_lead → form_name: "booking_form"
```

### Example 2: User Clicks Phone Number
```
1. page_view → /
2. contact → method: "phone", phone_number: "+1-604-XXX-XXXX"
```

### Example 3: User Submits Email
```
1. page_view → /
2. scroll → depth: 75
3. sign_up → method: "email", form_name: "vip_list"
```

---

## 🔍 Custom Properties Tracked

Every event includes these additional properties:

- **url** - Full page URL
- **userAgent** - Browser/device info
- **timestamp** - When event occurred
- **referrer** - Where user came from

---

## 🛠️ Testing Your Events

### Console Method
1. Open browser console (F12)
2. Navigate your site
3. Look for: `[Analytics Event] {...}`
4. Check properties match expected values

### Realtime Report Method
1. Open GA4 Realtime report
2. Open your site in another tab
3. Perform actions (click buttons, submit forms)
4. See events appear instantly in Realtime

### Debug View Method
1. Install [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Enable the debugger
3. Navigate your site
4. See detailed event data in console

---

## 📈 Key Metrics to Monitor

### Daily Checks
- ✅ Total page views
- ✅ New users vs returning
- ✅ Lead generation events (forms)
- ✅ Phone/email contacts

### Weekly Reviews
- ✅ Traffic sources (where leads come from)
- ✅ Top performing pages
- ✅ Conversion rate trends
- ✅ Engagement time average

### Monthly Analysis
- ✅ Month-over-month growth
- ✅ Campaign performance
- ✅ Device breakdown (mobile vs desktop)
- ✅ Geographic distribution

---

## 🎯 Event Goals & Benchmarks

### Lead Generation Goals

| Event | Target/Day | Target/Week | Target/Month |
|-------|-----------|-------------|--------------|
| Form Submissions | 3-5 | 20-30 | 80-120 |
| Phone Calls | 2-3 | 10-15 | 40-60 |
| Email Signups | 5-10 | 30-50 | 120-200 |

### Engagement Goals

| Metric | Target | Good | Excellent |
|--------|--------|------|-----------|
| Avg. Session Duration | 2min | 3min | 5min+ |
| Pages per Session | 2 | 3 | 5+ |
| Scroll to 75% | 30% | 50% | 70%+ |
| Bounce Rate | <60% | <40% | <25% |

---

## 🔔 Recommended Alerts

Set up these custom alerts in GA4:

### 1. Traffic Spike Alert
```
Alert name: Traffic Spike
Condition: Sessions increase 50%
Period: Day over previous day
Action: Email notification
```

### 2. Conversion Drop Alert
```
Alert name: Lead Drop
Condition: generate_lead decreases 30%
Period: Day over previous day
Action: Email notification
```

### 3. Zero Traffic Alert
```
Alert name: No Traffic
Condition: Sessions equals 0
Period: Last hour
Action: Email notification
```

---

## 🎨 Custom Dimensions (Future)

These can be added later for deeper insights:

- **user_type** - New vs returning
- **device_type** - Mobile, tablet, desktop
- **campaign_source** - Which ad/campaign
- **page_category** - Home, pricing, services
- **lead_quality** - Hot, warm, cold

---

## 📞 Quick Debug Checklist

Event not showing up?

- [ ] Check `.env` has `PUBLIC_GA_MEASUREMENT_ID`
- [ ] Restart dev server after adding ID
- [ ] Disable ad blockers (they block GA)
- [ ] Check browser console for errors
- [ ] Verify event name matches exactly
- [ ] Wait 24-48 hours for full reports (Realtime is instant)

---

## 💡 Pro Tips

1. **Use Realtime for Testing** - See events instantly
2. **Create Custom Dashboards** - Daily monitoring
3. **Set Up Weekly Email Reports** - Stay informed
4. **Compare Time Periods** - Track growth
5. **Filter by Source/Medium** - ROI per channel
6. **Export Data** - Deeper analysis in Excel

---

## 🚀 Next Level Tracking

Once comfortable with basic tracking:

1. **Enhanced E-commerce** - Track revenue (if selling online)
2. **User ID Tracking** - Follow users across devices
3. **Cross-domain Tracking** - Multiple websites
4. **Google Ads Integration** - Campaign performance
5. **Search Console Integration** - SEO performance

---

**All events are automatically tracked!** No additional code needed. Just add your Measurement ID and start collecting data. 📊
