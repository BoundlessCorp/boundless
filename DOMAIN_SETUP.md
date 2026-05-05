# Domain Configuration Guide

## 🌐 Setting Up Your Custom Domain

Follow these steps to configure your website with your actual domain.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Update Your Domain in Configuration Files

You need to update your domain in **2 files**:

#### 1. **astro.config.mjs**
```javascript
// Line 44 - Update the 'site' value
export default defineConfig({
  site: 'https://yourdomain.com', // ← CHANGE THIS
  base: '',
  // ... rest of config
});
```

**Replace with your actual domain:**
- ✅ `https://boundless.ca`
- ✅ `https://www.boundless.com`
- ✅ `https://boundlesspainting.com`

**Important:**
- Include `https://` at the beginning
- Do NOT include a trailing slash (`/`)
- Use the exact domain visitors will see in their browser

#### 2. **public/robots.txt**
```txt
# Line 9 - Update the Sitemap URL
Sitemap: https://yourdomain.com/sitemap.xml
```

**Replace with your actual domain:**
- ✅ `https://boundless.ca/sitemap.xml`
- ✅ `https://www.boundless.com/sitemap.xml`

---

### Step 2: Restart Development Server

After updating the files:

```bash
# Stop the dev server (Ctrl+C)
# Then restart it:
npm run dev
```

---

### Step 3: Verify Configuration

1. **Check canonical URLs:**
   - Open your site in a browser
   - Right-click → **View Page Source**
   - Look for: `<link rel="canonical" href="https://yourdomain.com" />`
   - Should show YOUR domain now ✅

2. **Check sitemap:**
   - Visit: `http://localhost:3000/sitemap.xml`
   - URLs should use YOUR domain ✅

3. **Check robots.txt:**
   - Visit: `http://localhost:3000/robots.txt`
   - Sitemap URL should use YOUR domain ✅

---

## 🎯 For Google Analytics Setup

Now that your domain is configured, when setting up Google Analytics:

### Creating Your GA4 Data Stream:

1. Go to **https://analytics.google.com**
2. Create property
3. **Website URL:** Enter your FULL domain
   - Example: `https://boundless.ca`
   - Or: `https://www.boundless.com`

4. **Stream name:** Something descriptive
   - Example: `Boundless Main Site`
   - Or: `Production Website`

5. Click **"Create stream"**
6. Copy your **Measurement ID** (`G-XXXXXXXXXX`)

---

## 📋 Domain Examples

### Example 1: Without www
```javascript
// astro.config.mjs
site: 'https://boundless.ca',
```
```txt
// robots.txt
Sitemap: https://boundless.ca/sitemap.xml
```

### Example 2: With www
```javascript
// astro.config.mjs
site: 'https://www.boundless.com',
```
```txt
// robots.txt
Sitemap: https://www.boundless.com/sitemap.xml
```

### Example 3: Custom subdomain
```javascript
// astro.config.mjs
site: 'https://app.boundless.com',
```
```txt
// robots.txt
Sitemap: https://app.boundless.com/sitemap.xml
```

---

## 🔧 Common Issues & Solutions

### Issue: "www vs non-www"

**Question:** Should I use `www.boundless.com` or `boundless.com`?

**Answer:** Use whichever one visitors will see in their browser:
- If you redirect `boundless.com` → `www.boundless.com`, use `https://www.boundless.com`
- If you redirect `www.boundless.com` → `boundless.com`, use `https://boundless.com`
- Choose ONE and be consistent

**Tip:** Most modern sites skip the `www` for cleaner URLs:
- ✅ `https://boundless.com` (recommended)
- ⚠️ `https://www.boundless.com` (works, but longer)

---

### Issue: "I don't have a domain yet"

**Solution:** Keep the placeholder for now:
```javascript
site: 'https://yourdomain.com',
```

**When you get your domain:**
1. Update `astro.config.mjs` with real domain
2. Update `robots.txt` with real domain
3. Update GA4 data stream URL
4. Restart dev server
5. Redeploy to production

---

### Issue: "Multiple domains or subdomains"

**Question:** What if I have multiple domains?

**Answer:** Use your PRIMARY domain (the one you want in Google):
- Primary: `https://boundless.com` ← Use this in config
- Alias: `https://boundlesspainting.com` ← Redirect to primary
- Alias: `https://www.boundless.com` ← Redirect to primary

**Why?** 
- SEO benefits (one canonical URL)
- Consistent analytics
- Better user experience

---

## 🌐 DNS & Hosting Setup

### If You're Deploying to Cloudflare Workers (via Base44):

1. **Add your domain** in Base44 dashboard
2. **Update nameservers** at your domain registrar to point to Cloudflare
3. **Configure DNS** in Cloudflare:
   - Add an `A` record pointing to your Cloudflare Worker
   - Or add a `CNAME` record if using a subdomain

4. **Update these config files** with your domain
5. **Publish** your app from Base44 dashboard

### If You're Using a Different Host:

1. **Point your domain** to your hosting provider
2. **Configure SSL** (HTTPS certificate)
3. **Update these config files** with your domain
4. **Deploy** your built app

---

## 📱 Testing Your Domain Configuration

### Local Testing (Development):
```bash
npm run dev
# Visit http://localhost:3000
# Check page source for correct canonical URLs
```

### Production Testing (After Deployment):
```bash
# Visit your actual domain
https://yourdomain.com

# Check these:
1. Site loads correctly ✅
2. HTTPS works (padlock icon) ✅
3. View source → canonical URL is correct ✅
4. Visit /sitemap.xml → URLs use your domain ✅
5. Visit /robots.txt → sitemap uses your domain ✅
```

---

## 🎯 SEO Impact

Configuring your domain correctly helps with:

- ✅ **Canonical URLs** - Tells Google which URL is the "real" one
- ✅ **Sitemap** - Helps search engines find all your pages
- ✅ **Social Sharing** - Correct URLs in Open Graph tags
- ✅ **Analytics** - Proper tracking in GA4
- ✅ **Brand Consistency** - Same domain everywhere

---

## 📊 Google Analytics Integration

After setting your domain, when you create your GA4 data stream:

**Before (Placeholder):**
```
Website URL: https://boundless.com
Stream name: Boundless Main Site
```

**After (Your Domain):**
```
Website URL: https://yourdomain.com  ← YOUR ACTUAL DOMAIN
Stream name: Your Site Name
```

**This ensures:**
- Accurate traffic reports
- Proper referral tracking  
- Correct page URLs in reports
- Cross-domain tracking (if needed)

---

## ✅ Checklist

- [ ] Decide on your final domain (with or without www)
- [ ] Update `astro.config.mjs` → `site` value
- [ ] Update `public/robots.txt` → `Sitemap` URL
- [ ] Restart dev server
- [ ] Check page source for correct canonical URL
- [ ] Check `/sitemap.xml` for correct URLs
- [ ] Check `/robots.txt` for correct sitemap URL
- [ ] Create GA4 data stream with correct domain
- [ ] Deploy to production
- [ ] Verify production site uses correct domain

---

## 🚀 Quick Command Reference

```bash
# Update domain in config files
# (Use your text editor to change the files)

# Restart dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy (via Base44)
# Go to Base44 dashboard → Click "Publish"
```

---

## 📞 Need Help?

**If you're stuck:**

1. **Not sure which domain to use?**
   - Use the domain you registered (e.g., `boundless.com`)
   - Skip `www` for cleaner URLs
   - Make sure it has HTTPS

2. **Don't have a domain yet?**
   - Keep placeholder for now
   - Update later when you have domain
   - GA4 will work fine with any domain

3. **Multiple domains?**
   - Choose your primary/main domain
   - Redirect others to it
   - Use primary in all configs

---

## 🎉 You're All Set!

Once you've updated your domain in both files:

1. ✅ **Canonical URLs** will be correct
2. ✅ **Sitemap** will use your domain
3. ✅ **SEO** will be optimized
4. ✅ **Analytics** will track correctly
5. ✅ **Social sharing** will show proper URLs

**Ready to set up Google Analytics with your real domain!** 🚀

---

**Questions?** Just ask! 😄
