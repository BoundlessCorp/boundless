# Project Structure

```
src/
├── api/
│   └── base44Client.ts          # Base44 SDK client configuration
│
├── components/
│   ├── ui/                       # shadCN UI components (pre-installed)
│   ├── App.tsx                   # Main app wrapper with routing & auth
│   ├── Home.tsx                  # Home page component container
│   ├── Header.tsx                # Navigation header with smooth scroll
│   ├── ScrollProgress.tsx        # Page scroll progress indicator
│   ├── HeroSection.tsx           # Hero section with CTA
│   ├── ProblemSection.tsx        # Problem identification section
│   ├── SolutionSection.tsx       # Solution features section
│   ├── HowItWorks.tsx            # 3-step process section
│   ├── ResultsSection.tsx        # Results and statistics
│   ├── TestimonialsSection.tsx   # Customer testimonials
│   ├── OfferSection.tsx          # Pricing tiers
│   ├── CTASection.tsx            # Lead capture CTA
│   ├── Footer.tsx                # Footer with links
│   └── UserNotRegisteredError.tsx # Access denied page
│
├── lib/
│   ├── AuthContext.tsx           # Authentication context provider
│   ├── PageNotFound.tsx          # 404 error page
│   ├── app-params.ts             # App parameter handling
│   ├── query-client.ts           # React Query configuration
│   ├── base-url.ts               # Base URL helper (Astro)
│   └── utils.ts                  # Utility functions (Astro)
│
├── layouts/
│   └── main.astro                # Main layout wrapper
│
├── pages/
│   └── index.astro               # Entry point (renders React app)
│
├── site-components/              # Webflow Devlink components
│   ├── DevLinkProvider.jsx       # Devlink provider (if needed)
│   ├── Navigation.jsx            # Webflow navigation (if needed)
│   ├── Footer.jsx                # Webflow footer (if needed)
│   └── global.css                # Webflow component styles
│
└── styles/
    └── global.css                # Global styles & Boundless theme
```

## Key Files Explained

### Entry Points
- **`src/pages/index.astro`**: Astro page that renders the entire React app using `client:only="react"`
- **`src/components/App.tsx`**: React app root with authentication, routing, and providers

### Authentication Flow
1. `App.tsx` wraps everything in `AuthProvider`
2. `AuthContext.tsx` checks Base44 authentication
3. If auth required but not logged in → redirect to login
4. If user not registered → show `UserNotRegisteredError`
5. Otherwise → render the app

### Routing
- Uses `react-router-dom` inside the React app
- Routes defined in `App.tsx`:
  - `/` → `Home` component
  - `*` → `PageNotFound` component

### Styling Approach
1. **Global styles** in `src/styles/global.css`
   - TailwindCSS imports
   - Boundless brand theme (warm browns)
   - Custom fonts (Inter Tight, Inter, JetBrains Mono)
   - Custom scrollbar and selection styles

2. **Component styles**
   - Inline Tailwind classes
   - Theme variables (e.g., `bg-primary`, `text-foreground`)

3. **Webflow styles**
   - `generated/webflow.css` - Auto-generated variables
   - `src/site-components/global.css` - Devlink styles

### Data Flow
```
User visits page
    ↓
index.astro loads
    ↓
Renders <App /> with client:only="react"
    ↓
App.tsx initializes providers:
    - AuthProvider (authentication)
    - QueryClientProvider (data fetching)
    - Router (navigation)
    ↓
AuthenticatedApp checks auth status
    ↓
If authenticated → Home page
If not authenticated → Login redirect
If not registered → Error page
```

## Component Dependencies

### Home Page Sections (in order)
1. `ScrollProgress` - Top of page
2. `Header` - Fixed navigation
3. `HeroSection` - Hero with CTA
4. `ProblemSection` - Pain points (id="problem")
5. `SolutionSection` - Features (id="solution")
6. `HowItWorks` - Process (id="how-it-works")
7. `ResultsSection` - Stats (id="results")
8. `TestimonialsSection` - Reviews (id="testimonials")
9. `OfferSection` - Pricing
10. `CTASection` - Lead form (id="cta")
11. `Footer` - Footer links

### Shared Dependencies
- All components use Tailwind CSS classes
- Theme colors from `src/styles/global.css`
- shadCN UI components from `src/components/ui/`
- TypeScript for type safety

## Environment Variables

Required in `.env`:
```env
# Base44 Configuration
VITE_BASE44_APP_ID=""
VITE_BASE44_FUNCTIONS_VERSION=""
VITE_BASE44_APP_BASE_URL=""

# Webflow (auto-configured)
WEBFLOW_API_HOST=""
WEBFLOW_SITE_API_TOKEN=""
WEBFLOW_CMS_SITE_API_TOKEN=""
```

## Build Process

1. **Development** (`npm run dev`)
   - Astro dev server on port 3000
   - Hot module replacement (HMR)
   - React Fast Refresh

2. **Production** (`npm run build`)
   - Astro builds static/server files
   - Vite bundles React code
   - Optimized for Cloudflare Workers
   - Output in `dist/`

## Performance Optimizations

✅ **Code Splitting**
- React Router code splits by route
- Lazy loading for heavy components possible

✅ **Image Optimization**
- Use Unsplash with size parameters
- Replace with optimized images for production

✅ **CSS**
- TailwindCSS purges unused styles
- Minimal runtime CSS-in-JS

✅ **JavaScript**
- Client-side only React (no SSR overhead)
- Tree-shaking via Vite
- Minification in production

## Adding New Features

### New Section
1. Create component in `src/components/NewSection.tsx`
2. Import in `src/components/Home.tsx`
3. Add to render order
4. Add navigation link in `Header.tsx`
5. Update scroll targets

### New Page
1. Create component in `src/components/NewPage.tsx`
2. Add route in `src/components/App.tsx`:
   ```tsx
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add link in navigation

### New API Integration
1. Create new client in `src/api/`
2. Use React Query in `query-client.ts`
3. Call from components with `useQuery` or `useMutation`

## Testing Checklist

Before deployment:
- ✅ Base44 auth flow works
- ✅ All sections scroll smoothly
- ✅ Forms submit correctly
- ✅ Mobile responsive (test all breakpoints)
- ✅ Images load properly
- ✅ Links work
- ✅ 404 page displays
- ✅ Loading states show
- ✅ Error states handled

---

**Quick Start**: Run `npm run dev` and open `http://localhost:3000`
