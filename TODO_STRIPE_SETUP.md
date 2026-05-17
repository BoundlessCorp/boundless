# 📋 Stripe Integration TODO List

## ⚠️ REQUIRED BEFORE GOING LIVE

### Step 1: Stripe Account Setup
- [ ] Create Stripe account at [stripe.com](https://stripe.com)
- [ ] Verify email address
- [ ] Complete business profile
- [ ] Add bank account for payouts

### Step 2: Create Products in Stripe Dashboard
Go to: https://dashboard.stripe.com/products

- [ ] **Starter Package** - $397/month
  - [ ] Product created
  - [ ] Price ID copied: `_________________`
  
- [ ] **Growth Package** - $1,200/month
  - [ ] Product created
  - [ ] Price ID copied: `_________________`
  
- [ ] **Scale Package** - $2,500/month
  - [ ] Product created
  - [ ] Price ID copied: `_________________`

### Step 3: Get API Keys
Go to: https://dashboard.stripe.com/apikeys

**Test Mode (for development):**
- [ ] Publishable key copied: `pk_test_...`
- [ ] Secret key copied: `sk_test_...`

**Live Mode (for production):**
- [ ] Publishable key copied: `pk_live_...`
- [ ] Secret key copied: `sk_live_...`

### Step 4: Update Environment Variables
- [ ] Create/update `.env` file
- [ ] Add `STRIPE_SECRET_KEY=sk_test_...`
- [ ] Add `PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Restart dev server

### Step 5: Update Code with Price IDs
- [ ] Open `src/components/PricingSection.tsx`
- [ ] Replace `price_starter_monthly` with actual Starter price ID
- [ ] Replace `price_growth_monthly` with actual Growth price ID
- [ ] Replace `price_scale_monthly` with actual Scale price ID
- [ ] Save file

### Step 6: Test the Integration
- [ ] Run `npm run dev`
- [ ] Navigate to pricing section
- [ ] Click "Get Started" button
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete checkout
- [ ] Verify redirect to success page
- [ ] Check Stripe Dashboard for test payment

### Step 7: Customize (Optional)
- [ ] Update success page messaging (`src/pages/success.astro`)
- [ ] Customize email notifications in Stripe Dashboard
- [ ] Set up customer portal for subscription management
- [ ] Add webhook handlers for advanced features

### Step 8: Go Live
- [ ] Switch to live API keys in `.env`
- [ ] Create live products in Stripe (same as test)
- [ ] Update price IDs to live price IDs
- [ ] Test with real card (can refund immediately)
- [ ] Deploy to production
- [ ] Monitor first real payment

---

## 📝 Notes

**Current Status:** ⚠️ Integration code is complete, but requires Stripe account setup

**What's Working:**
- ✅ Stripe checkout API endpoint
- ✅ Success page with confetti
- ✅ Pricing section with purchase buttons
- ✅ Loading states and error handling
- ✅ Analytics tracking

**What You Need to Do:**
- ⚠️ Create Stripe account
- ⚠️ Create products and get price IDs
- ⚠️ Add API keys to environment variables
- ⚠️ Update price IDs in code
- ⚠️ Test and go live

---

## 🔗 Quick Links

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Create Products**: https://dashboard.stripe.com/products
- **API Keys**: https://dashboard.stripe.com/apikeys
- **Test Cards**: https://stripe.com/docs/testing
- **Documentation**: https://stripe.com/docs

---

## 📞 Support Resources

- **Quick Start Guide**: `STRIPE_QUICK_START.md`
- **Full Setup Guide**: `STRIPE_SETUP_GUIDE.md`
- **Stripe Support**: https://support.stripe.com
- **Stripe Docs**: https://stripe.com/docs

---

**Estimated Time to Complete:** 10-15 minutes

**Ready to accept payments!** 🚀����
