# 🚀 Stripe Quick Start Checklist

## ✅ Complete Setup in 10 Minutes

### 1️⃣ Create Stripe Account (2 min)
- [ ] Go to [stripe.com](https://stripe.com) and sign up
- [ ] Verify your email
- [ ] Complete business profile

### 2️⃣ Create Your 3 Products (3 min)

Go to [Stripe Products](https://dashboard.stripe.com/products) and create:

**Product 1: Starter Package**
```
Name: Starter Package
Price: $397
Billing: Monthly (recurring)
Description: Stop Losing Leads - CRM system setup and automation
```
→ Copy the **Price ID** (starts with `price_...`)

**Product 2: Growth Package**
```
Name: Growth Package  
Price: $1,200
Billing: Monthly (recurring)
Description: Consistent Leads & Booked Appointments
```
→ Copy the **Price ID**

**Product 3: Scale Package**
```
Name: Scale Package
Price: $2,500
Billing: Monthly (recurring)
Description: Fully Automated Growth Machine
```
→ Copy the **Price ID**

### 3️⃣ Get Your API Keys (1 min)
- [ ] Go to [Stripe API Keys](https://dashboard.stripe.com/apikeys)
- [ ] Copy your **Publishable key** (starts with `pk_test_...`)
- [ ] Reveal and copy your **Secret key** (starts with `sk_test_...`)

### 4️⃣ Update Environment Variables (2 min)

Add to your `.env` file:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

### 5️⃣ Update Price IDs in Code (2 min)

Open `src/components/PricingSection.tsx` and update:

```typescript
const packages = [
  {
    name: 'Starter',
    priceId: 'price_YOUR_STARTER_ID', // ← Paste your Starter price ID
    // ...
  },
  {
    name: 'Growth',
    priceId: 'price_YOUR_GROWTH_ID', // ← Paste your Growth price ID
    // ...
  },
  {
    name: 'Scale',
    priceId: 'price_YOUR_SCALE_ID', // ← Paste your Scale price ID
    // ...
  },
];
```

### 6️⃣ Test It! (2 min)
- [ ] Restart your dev server: `npm run dev`
- [ ] Go to your pricing section
- [ ] Click "Get Started" on any package
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Expiry: Any future date (e.g., `12/34`)
- [ ] CVC: Any 3 digits (e.g., `123`)
- [ ] Complete checkout
- [ ] See confetti on success page! 🎉

---

## 🧪 Test Card Numbers

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |
| `4000 0025 0000 3155` | 🔐 3D Secure |

---

## 🎯 What Happens After Purchase?

1. **Customer pays** → Stripe processes payment
2. **Redirects to success page** → Shows confirmation with confetti
3. **Email sent** → Stripe sends receipt to customer
4. **You get notified** → Check Stripe Dashboard for new subscription
5. **Customer books onboarding** → Link provided on success page

---

## 📊 Monitor Your Sales

- **Payments**: [dashboard.stripe.com/payments](https://dashboard.stripe.com/payments)
- **Subscriptions**: [dashboard.stripe.com/subscriptions](https://dashboard.stripe.com/subscriptions)
- **Customers**: [dashboard.stripe.com/customers](https://dashboard.stripe.com/customers)

---

## 🔴 Going Live

When ready for real payments:

1. **Activate your account** in Stripe Dashboard
2. **Get live API keys** from [API Keys page](https://dashboard.stripe.com/apikeys)
3. **Update `.env`** with live keys (`sk_live_...` and `pk_live_...`)
4. **Create live products** (same as test, but in live mode)
5. **Update price IDs** in code with live price IDs
6. **Deploy** and start accepting real payments! 💰

---

## 🆘 Need Help?

- **Full Guide**: See `STRIPE_SETUP_GUIDE.md`
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **Test Cards**: [stripe.com/docs/testing](https://stripe.com/docs/testing)

---

**You're all set! Start accepting payments in minutes! 🚀**
