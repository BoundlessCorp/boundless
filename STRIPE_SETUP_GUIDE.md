# Stripe Integration Setup Guide

## ✅ What's Been Implemented

Your website now has full Stripe payment integration! Here's what's ready:

### 1. **Stripe Checkout API** (`src/pages/api/create-checkout-session.ts`)
- Creates secure checkout sessions for each package
- Handles subscription payments
- Redirects to success page after payment
- Includes metadata tracking for analytics

### 2. **Success Page** (`src/pages/success.astro`)
- Beautiful confirmation page with confetti animation 🎉
- Clear next steps for customers
- Links to schedule onboarding call
- Tracks conversion in Google Analytics

### 3. **Updated Pricing Section** (`src/components/PricingSection.tsx`)
- "Get Started", "Get More Clients", and "Scale My Business" buttons now trigger Stripe checkout
- Loading states while processing
- Error handling for failed checkouts

---

## 🚀 Setup Instructions

### Step 1: Create Your Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete your business profile

### Step 2: Create Your Products & Prices in Stripe

1. **Go to Stripe Dashboard** → [Products](https://dashboard.stripe.com/products)

2. **Create Product #1: Starter Package**
   - Click "Add product"
   - Name: `Starter Package`
   - Description: `Stop Losing Leads - CRM system setup, lead capture, and automation`
   - Pricing model: `Recurring`
   - Price: `$397`
   - Billing period: `Monthly`
   - Click "Save product"
   - **Copy the Price ID** (starts with `price_...`)

3. **Create Product #2: Growth Package**
   - Click "Add product"
   - Name: `Growth Package`
   - Description: `Consistent Leads & Booked Appointments - Full funnel and automation system`
   - Pricing model: `Recurring`
   - Price: `$1,200`
   - Billing period: `Monthly`
   - Click "Save product"
   - **Copy the Price ID** (starts with `price_...`)

4. **Create Product #3: Scale Package**
   - Click "Add product"
   - Name: `Scale Package`
   - Description: `Fully Automated Growth Machine - Complete ad management and automation`
   - Pricing model: `Recurring`
   - Price: `$2,500`
   - Billing period: `Monthly`
   - Click "Save product"
   - **Copy the Price ID** (starts with `price_...`)

### Step 3: Get Your API Keys

1. Go to [Stripe API Keys](https://dashboard.stripe.com/apikeys)
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...` or `pk_live_...`)
   - **Secret key** (starts with `sk_test_...` or `sk_live_...`) - Click "Reveal test key"

⚠️ **Important**: 
- Use **test keys** (`pk_test_...` and `sk_test_...`) for development
- Use **live keys** (`pk_live_...` and `sk_live_...`) for production
- Never commit your secret keys to Git!

### Step 4: Update Your Environment Variables

1. Open your `.env` file (create one if it doesn't exist)
2. Add these variables:

```env
# Stripe Payment Integration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

### Step 5: Update Price IDs in Code

Open `src/components/PricingSection.tsx` and replace the placeholder price IDs with your actual Stripe Price IDs:

```typescript
const packages = [
  {
    name: 'Starter',
    // ... other fields
    priceId: 'price_YOUR_STARTER_PRICE_ID', // ← Replace this
  },
  {
    name: 'Growth',
    // ... other fields
    priceId: 'price_YOUR_GROWTH_PRICE_ID', // ← Replace this
  },
  {
    name: 'Scale',
    // ... other fields
    priceId: 'price_YOUR_SCALE_PRICE_ID', // ← Replace this
  },
];
```

### Step 6: Install Stripe CLI (Optional - for Testing)

For local testing with webhooks:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

---

## 🧪 Testing Your Integration

### Test Mode (Recommended First)

1. Make sure you're using **test API keys** (starting with `sk_test_` and `pk_test_`)
2. Visit your pricing page
3. Click any "Get Started" button
4. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0025 0000 3155`
   - Use any future expiry date (e.g., `12/34`)
   - Use any 3-digit CVC (e.g., `123`)
   - Use any ZIP code (e.g., `12345`)

5. Complete the checkout
6. You should be redirected to the success page with confetti! 🎉

### Live Mode (Production)

1. Switch to **live API keys** in your `.env` file
2. Update the price IDs to your live product price IDs
3. Deploy your changes
4. Test with a real card (you can refund it immediately after)

---

## 📊 Monitoring Payments

### Stripe Dashboard
- View all payments: [https://dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)
- View subscriptions: [https://dashboard.stripe.com/subscriptions](https://dashboard.stripe.com/subscriptions)
- View customers: [https://dashboard.stripe.com/customers](https://dashboard.stripe.com/customers)

### Analytics Tracking
- Successful purchases are automatically tracked in Google Analytics 4
- Event name: `purchase`
- Category: `Ecommerce`

---

## 🔒 Security Best Practices

✅ **DO:**
- Keep your secret key (`sk_...`) in environment variables only
- Use test mode for development
- Enable Stripe Radar for fraud protection
- Set up webhook signature verification (for advanced usage)

❌ **DON'T:**
- Never commit API keys to Git
- Never expose secret keys in client-side code
- Never use live keys in development

---

## 🎨 Customization Options

### Change Success Page
Edit `src/pages/success.astro` to customize:
- Messaging
- Next steps
- Branding
- Confetti colors

### Change Checkout Behavior
Edit `src/pages/api/create-checkout-session.ts` to:
- Add custom fields
- Enable promotion codes (already enabled!)
- Collect shipping address
- Add trial periods
- Set up payment plans

### Update Pricing Display
Edit `src/components/PricingSection.tsx` to:
- Change package features
- Update pricing
- Modify button text
- Add new packages

---

## 🆘 Troubleshooting

### "Stripe is not configured" Error
- Make sure `STRIPE_SECRET_KEY` is set in your `.env` file
- Restart your dev server after adding environment variables

### Checkout Session Not Creating
- Check that your price IDs are correct
- Verify your API key is valid
- Check browser console for errors

### Redirect Not Working
- Ensure `BASE_URL` is set correctly in your environment
- Check that success/cancel URLs are accessible

### Payment Not Showing in Dashboard
- Make sure you're looking at the correct mode (test vs. live)
- Check that the API key matches the mode

---

## 📞 Support

- **Stripe Documentation**: [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: [https://support.stripe.com](https://support.stripe.com)
- **Test Cards**: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## ✨ Next Steps

1. ✅ Set up your Stripe account
2. ✅ Create your products and prices
3. ✅ Add API keys to `.env`
4. ✅ Update price IDs in code
5. ✅ Test with test cards
6. ✅ Go live with real keys!

**Your payment system is ready to accept customers! 🚀**
