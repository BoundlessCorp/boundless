# Authentication System Setup

## Overview

Your Astro app now includes a full authentication system with:

- ✅ Base44 authentication integration
- ✅ User session management
- ✅ Protected routes
- ✅ Error handling for unauthorized/unregistered users
- ✅ React Query for data fetching
- ✅ React Router for client-side routing

## Architecture

### Files Created/Updated

```
src/
├── api/
│   └── base44Client.ts          # Axios client with Base44 API configuration
├── lib/
│   ├── AuthContext.tsx           # Authentication context provider
│   ├── query-client.ts           # React Query configuration
│   ├── PageNotFound.tsx          # 404 error page
│   └── app-params.ts             # App configuration helper
├── components/
│   ├── App.tsx                   # Main app with auth routing (UPDATED)
│   └── UserNotRegisteredError.tsx # Unregistered user error page
```

## How It Works

### 1. Authentication Flow

```typescript
// On app load:
App.tsx
  └─> AuthProvider (wraps entire app)
      └─> Checks authentication status
          ├─> Loading state (spinner)
          ├─> Authenticated → Show app routes
          ├─> Not authenticated → Redirect to login
          └─> Not registered → Show error page
```

### 2. User States

| State | Behavior |
|-------|----------|
| **Loading** | Show spinner while checking auth |
| **Authenticated** | User can access all app routes |
| **Not Authenticated** | Redirect to Webflow OAuth login |
| **Not Registered** | Show registration error with instructions |

### 3. Protected Routes

All routes in your app are automatically protected by the `AuthenticatedApp` component:

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="*" element={<PageNotFound />} />
</Routes>
```

## Usage

### Accessing Auth State

Use the `useAuth()` hook in any component:

```tsx
import { useAuth } from '@/lib/AuthContext';

function MyComponent() {
  const { user, logout, navigateToLogin } = useAuth();

  return (
    <div>
      <p>Welcome, {user?.name || user?.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Requests

Use the `base44Client` for authenticated requests:

```tsx
import { base44Client } from '@/api/base44Client';

// GET request
const response = await base44Client.get('/api/data');

// POST request
await base44Client.post('/api/data', { name: 'value' });
```

### Using React Query

Fetch data with React Query:

```tsx
import { useQuery } from '@tanstack/react-query';
import { base44Client } from '@/api/base44Client';

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['myData'],
    queryFn: async () => {
      const response = await base44Client.get('/api/my-data');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

## Configuration

### Required Environment Variables

Add to your `.env` file (see `ENV_SETUP.md` for details):

```bash
PUBLIC_APP_ID=your-base44-app-id
PUBLIC_API_BASE_URL=https://api.base44.com
```

### Customizing Auth Behavior

Edit `src/lib/AuthContext.tsx` to customize:

- Auth check endpoints
- Error handling
- Loading states
- User data structure

## Error Handling

### Authentication Errors

The system handles three error types:

1. **`auth_required`**: User needs to log in
   - Automatically redirects to Webflow OAuth

2. **`user_not_registered`**: User not registered for this app
   - Shows `UserNotRegisteredError` component

3. **`unknown`**: Other errors
   - Logged to console for debugging

### Example Error Handling

```tsx
const { authError } = useAuth();

if (authError) {
  console.log('Error type:', authError.type);
  console.log('Error message:', authError.message);
}
```

## Testing

### Test Authentication States

1. **Logged Out**: Clear cookies and reload
2. **Logged In**: Authenticate via Webflow OAuth
3. **Not Registered**: Test with user not in Base44 app

### Mock Authentication (Development)

For development without Base44, you can mock the auth:

```tsx
// In AuthContext.tsx, replace checkAuth with:
const checkAuth = async () => {
  setIsLoadingAuth(false);
  setUser({ id: '1', email: 'dev@example.com', name: 'Dev User' });
};
```

## Deployment

Your authentication system works seamlessly with:

- ✅ **Cloudflare Workers** (already configured)
- ✅ **Webflow Apps** (OAuth integration ready)
- ✅ **Base44 Platform** (API client configured)

No additional deployment steps needed!

## Troubleshooting

### Issue: Infinite redirect loop
**Solution**: Check that `PUBLIC_APP_ID` is set correctly

### Issue: 401 Unauthorized errors
**Solution**: Verify Base44 API endpoint and credentials

### Issue: User always shows as not registered
**Solution**: Ensure user is added to your Base44 app in the dashboard

## Next Steps

1. ✅ Set up environment variables (`.env`)
2. ✅ Test authentication flow locally
3. ✅ Deploy to Cloudflare Workers
4. ✅ Configure Base44 app OAuth settings
5. ✅ Test in production environment

---

🎉 **Your authentication system is fully configured and ready to use!**
