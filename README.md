




# Boundless - Painting Contractor Growth Platform

**Transform your painting business with performance-driven lead generation and automation.**

## 🎨 About

Boundless is a comprehensive growth platform designed specifically for painting contractors in Vancouver. Built with Astro, React, and Cloudflare Workers, it features:

- **High-converting landing page** with social proof and testimonials
- **Automated booking system** with calendar integration
- **Lead tracking and analytics** with real-time counters
- **Responsive design** optimized for mobile and desktop
- **Base44 authentication** with OAuth integration and session management
- **Protected routes** with user authorization
- **React Query integration** for efficient data fetching
- **Backend integration** for authentication and data management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A Base44 account

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd [project-directory]
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Base44 Configuration
   BASE44_APP_ID=your_app_id
   BASE44_APP_BASE_URL=your_backend_url
   
   # Example:
   # BASE44_APP_ID=cbef744a8545c389ef439ea6
   # BASE44_APP_BASE_URL=https://boundless-app.base44.app
   
   # Webflow CMS (optional)
   WEBFLOW_CMS_SITE_API_TOKEN=your_webflow_token
   WEBFLOW_API_HOST=https://api.webflow.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
/
├── src/
│   ├── api/                # API layer
│   │   └── base44Client.ts # Axios client for Base44 API
│   ├── components/          # React components
│   │   ├── ui/             # shadCN UI components
│   │   ├── App.tsx         # Main app with authentication
│   │   ├── Header.tsx      # Navigation header
│   │   ├── HeroSection.tsx # Hero with 3D effects
│   │   ├── ProblemSection.tsx
│   │   ├── SolutionSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ResultsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── OfferSection.tsx
│   │   ├── CTASection.tsx  # Booking form
│   │   ├── Footer.tsx
│   │   └── UserNotRegisteredError.tsx
│   ├── layouts/
│   │   └── main.astro      # Main layout template
│   ├── pages/
│   │   └── index.astro     # Home page
│   ├── lib/
│   │   ├── AuthContext.tsx # Authentication provider
│   │   ├── query-client.ts # React Query configuration
│   │   ├── PageNotFound.tsx # 404 error page
│   │   ├── app-params.ts   # App configuration
│   │   ├── base-url.ts     # URL utilities
│   │   ├── analytics.ts    # Analytics tracking
│   │   └── utils.ts        # Helper functions
│   ├── site-components/    # Webflow Devlink components
│   └── styles/
│       └── global.css      # Global styles & theme
├── generated/
│   ├── webflow.css         # Webflow design tokens
│   └── fonts.css           # Font imports
├── astro.config.mjs        # Astro configuration
├── wrangler.jsonc          # Cloudflare Workers config
├── ENV_SETUP.md            # Environment variables guide
├── AUTHENTICATION_SETUP.md # Authentication system docs
└── package.json
```

## 🎨 Design System

The project uses a warm, earthy color palette centered around tan (#C4A574) and dark brown (#3D3328):

- **Primary**: Warm tan (#C4A574) - Used for CTAs and accents
- **Background**: Warm cream (#F9F7F4) - Main background
- **Foreground**: Dark brown (#3D3328) - Text and dark sections
- **Fonts**: 
  - Display: Plus Jakarta Sans (headings)
  - Body: Instrument Sans (text)
  - Mono: JetBrains Mono (labels)

All design tokens are defined in `src/styles/global.css` and `generated/webflow.css`.

## 🛠 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
npm run lint         # Lint code
npm run lint:fix     # Fix linting errors
npm run cf-typegen   # Generate Cloudflare types
```

## 📊 Analytics & Tracking

The site includes built-in analytics tracking for:

- Page views and navigation
- CTA button clicks  
- Form submissions and lead generation
- Phone call and email clicks
- Scroll depth (25%, 50%, 75%, 100%)
- User engagement metrics

### Google Analytics 4 Integration

The site is fully integrated with Google Analytics 4 for comprehensive tracking:

- **Automatic Event Tracking** - All user interactions tracked automatically
- **Conversion Tracking** - Forms, calls, and bookings marked as conversions
- **Real-time Reports** - See visitor activity as it happens
- **Custom Events** - Pre-configured for lead generation and engagement

**Setup Guide:** See `GOOGLE_ANALYTICS_SETUP.md` for complete setup instructions  
**Events Reference:** See `ANALYTICS_EVENTS_REFERENCE.md` for all tracked events

Analytics implementation: `src/lib/analytics.ts`

## 🌐 Deployment

### Deploy to Cloudflare Workers

The project is configured for Cloudflare Workers deployment:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy via Base44**
   - Open your project on [Base44.com](https://base44.com)
   - Click **Publish** to deploy to production
   - Your app will be live at your configured domain

### Deploy to Cloudflare (Direct)

```bash
npm run preview  # Test locally first
npx wrangler deploy
```

## 🔒 Environment Variables

Required environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `PUBLIC_APP_ID` | Your Base44 application ID | Yes |
| `PUBLIC_API_BASE_URL` | Base44 API endpoint (default: https://api.base44.com) | Yes |
| `PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX) | Optional |
| `WEBFLOW_CMS_SITE_API_TOKEN` | Webflow CMS API token | Optional |
| `WEBFLOW_API_HOST` | Webflow API host | Optional |

**See `ENV_SETUP.md` for detailed environment configuration.**

## 📚 Key Features

### 🔐 Authentication & Security
- Base44 OAuth integration
- Protected routes with session management
- User registration verification
- Automatic login redirects
- Secure API client with interceptors

### 🎯 Landing Page
- Auto-hiding header on scroll
- Animated hero section with 3D tilt effects
- Problem/Solution framework
- Interactive "How It Works" section
- Results showcase with metrics
- Social proof testimonials

### 📝 Booking System
- Integrated booking form in CTA section
- Calendar date picker
- Service selection
- Form validation with Zod
- Loading states and animations
- Success/error handling

### 📱 Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interactions
- Fast loading with optimized images

### 🔧 Technical Stack
- **Framework**: Astro 5.x
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadCN UI
- **Animations**: Framer Motion
- **Deployment**: Cloudflare Workers
- **Backend**: Base44

## 🤝 Support

- **Documentation**: [https://docs.base44.com](https://docs.base44.com)
- **Support**: [https://app.base44.com/support](https://app.base44.com/support)
- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)

## 📄 License

© 2024 Boundless. All rights reserved.

---

**Built with Base44** - The fastest way to build and deploy modern web apps.





