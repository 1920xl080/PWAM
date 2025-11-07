# Authentication API

## Overview

Authentication is handled through Supabase Auth with Google OAuth provider.

**Domain Restriction:** Only `@std.stei.itb.ac.id` email addresses are allowed.

---

## Authentication Flow

```
1. User clicks "Sign in with Google"
2. Frontend calls supabase.auth.signInWithOAuth()
3. User redirected to Google login
4. User enters ITB credentials
5. Google redirects back with authorization code
6. Supabase exchanges code for JWT token
7. Server validates email domain (must be @std.stei.itb.ac.id)
8. Frontend receives JWT token and user data
9. Frontend stores session
10. User redirected to dashboard
```

---

## Endpoints

### Sign In with Google OAuth

**Frontend Implementation:**
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard`,
    queryParams: {
      hd: 'std.stei.itb.ac.id' // Hosted domain (frontend hint only)
    }
  }
});
```

**Response (Success):**
```typescript
{
  data: {
    provider: 'google',
    url: 'https://accounts.google.com/o/oauth2/v2/auth?...'
  },
  error: null
}
```

**Response (Error):**
```typescript
{
  data: { provider: null, url: null },
  error: {
    message: 'Error message',
    status: 400
  }
}
```

---

### Get Current User

**Endpoint:** `GET /auth/v1/user`

**Frontend Implementation:**
```typescript
const { data: { user }, error } = await supabase.auth.getUser();
```

**Response (Success):**
```typescript
{
  data: {
    user: {
      id: 'uuid',
      email: 'student@std.stei.itb.ac.id',
      user_metadata: {
        name: 'Student Name',
        avatar_url: 'https://...',
        email_verified: true
      },
      created_at: '2024-01-01T00:00:00.000Z'
    }
  },
  error: null
}
```

**Response (Not Authenticated):**
```typescript
{
  data: { user: null },
  error: null
}
```

---

### Sign Out

**Endpoint:** `POST /auth/v1/logout`

**Frontend Implementation:**
```typescript
const { error } = await supabase.auth.signOut();
```

**Response (Success):**
```typescript
{
  error: null
}
```

---

### Listen to Auth Changes

**Frontend Implementation:**
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session.user);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed');
  }
});
```

**Events:**
- `SIGNED_IN` - User successfully authenticated
- `SIGNED_OUT` - User signed out
- `TOKEN_REFRESHED` - JWT token refreshed
- `USER_UPDATED` - User metadata updated
- `PASSWORD_RECOVERY` - Password recovery initiated

---

## Email Domain Validation

**⚠️ CRITICAL: Frontend validation alone is NOT secure!**

### Frontend Validation (Current - Insecure)

```typescript
// ❌ This can be bypassed!
const email = user?.email;
if (!email?.endsWith('@std.stei.itb.ac.id')) {
  await supabase.auth.signOut();
  return false;
}
```

### Server-Side Validation (Required - Secure)

**Implement using Supabase Edge Function:**

```typescript
// supabase/functions/validate-email/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Get user from JWT
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')
  
  const { data: { user }, error } = await supabaseClient.auth.getUser(token)
  
  if (error || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }

  // Validate email domain
  const email = user.email
  if (!email || !email.endsWith('@std.stei.itb.ac.id')) {
    // Delete unauthorized user
    await supabaseClient.auth.admin.deleteUser(user.id)
    
    return new Response(
      JSON.stringify({ 
        error: 'Only ITB STEI students are allowed to access this platform.' 
      }),
      { status: 403 }
    )
  }

  return new Response(
    JSON.stringify({ success: true, user }),
    { status: 200 }
  )
})
```

**Database Trigger (Alternative - More Secure):**

```sql
-- Create function to validate email
CREATE OR REPLACE FUNCTION validate_itb_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@std.stei.itb.ac.id' THEN
    RAISE EXCEPTION 'Only ITB STEI email addresses are allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users table
CREATE TRIGGER check_itb_email
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION validate_itb_email();
```

---

## Session Management

### Get Session

```typescript
const { data: { session }, error } = await supabase.auth.getSession();
```

**Response:**
```typescript
{
  data: {
    session: {
      access_token: 'jwt-token',
      refresh_token: 'refresh-token',
      expires_at: 1234567890,
      user: { ... }
    }
  },
  error: null
}
```

### Refresh Session

```typescript
const { data: { session }, error } = await supabase.auth.refreshSession();
```

**Auto-refresh:**
Supabase automatically refreshes tokens before expiry.

---

## Protected Route Pattern

**Frontend:**
```typescript
// In App.tsx or route guard
const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  navigate('/auth');
  return null;
}

// Validate email domain
if (!session.user.email?.endsWith('@std.stei.itb.ac.id')) {
  await supabase.auth.signOut();
  navigate('/auth');
  return null;
}
```

**Component Pattern:**
```typescript
export function ProtectedPage({ authContext }: Props) {
  const { user } = authContext;
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (!user.email?.endsWith('@std.stei.itb.ac.id')) {
      authContext.logout();
      navigate('/auth');
    }
  }, [user, navigate, authContext]);
  
  if (!user) return null;
  
  return <div>{/* Protected content */}</div>;
}
```

---

## Error Handling

### Common Errors

**Invalid Email Domain:**
```typescript
{
  error: {
    message: 'Only ITB STEI students are allowed',
    code: 'EMAIL_DOMAIN_NOT_ALLOWED',
    status: 403
  }
}
```

**User Not Found:**
```typescript
{
  error: {
    message: 'User not found',
    code: 'USER_NOT_FOUND',
    status: 404
  }
}
```

**Session Expired:**
```typescript
{
  error: {
    message: 'Session expired',
    code: 'SESSION_EXPIRED',
    status: 401
  }
}
```

**OAuth Callback Error:**
```typescript
{
  error: {
    message: 'OAuth callback failed',
    code: 'OAUTH_CALLBACK_ERROR',
    status: 400
  }
}
```

---

## Security Best Practices

### 1. Server-Side Email Validation

✅ **DO:**
- Implement Edge Function validation
- Use database triggers
- Validate on every request

❌ **DON'T:**
- Rely on frontend validation only
- Trust `hd` parameter in OAuth
- Skip validation after initial login

### 2. Token Storage

✅ **DO:**
- Use Supabase's built-in session management
- Let Supabase handle token refresh
- Use httpOnly cookies in production

❌ **DON'T:**
- Store tokens in localStorage
- Expose tokens in URL
- Share tokens between users

### 3. Rate Limiting

✅ **DO:**
- Limit login attempts (10/minute)
- Track failed attempts
- Block suspicious IPs

❌ **DON'T:**
- Allow unlimited attempts
- Ignore failed login patterns

### 4. CORS Configuration

```typescript
// In Supabase dashboard or edge function
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-app.vercel.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

---

## Google OAuth Setup

### 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

### 2. Supabase Configuration

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Enter Client ID and Client Secret
4. Save configuration

### 3. Domain Restriction (Google Workspace)

If ITB uses Google Workspace:
1. Go to Google Cloud Console → OAuth consent screen
2. Set "Internal" (ITB only)
3. Or use `hd` parameter (less secure)

---

## Testing

### Local Testing

```typescript
// Mock authentication for development
const mockUser = {
  id: 'test-user-id',
  email: 'test@std.stei.itb.ac.id',
  user_metadata: {
    name: 'Test Student'
  }
};

// Use in development only
if (import.meta.env.DEV) {
  setUser(mockUser);
}
```

### Production Testing

1. Create test account: `test@std.stei.itb.ac.id`
2. Test full OAuth flow
3. Verify email validation
4. Test session persistence
5. Test logout functionality

---

## Complete Implementation Example

```typescript
// /lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// /App.tsx
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Validate email domain
        if (session.user.email?.endsWith('@std.stei.itb.ac.id')) {
          setUser(session.user);
        } else {
          supabase.auth.signOut();
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        if (session.user.email?.endsWith('@std.stei.itb.ac.id')) {
          setUser(session.user);
        } else {
          supabase.auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          hd: 'std.stei.itb.ac.id',
        },
      },
    });

    if (error) {
      console.error('Login error:', error);
      return false;
    }

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const authContext = {
    user,
    loginWithGoogle,
    logout,
  };

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with authContext */}
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Migration Checklist

- [ ] Set up Google OAuth in Google Cloud Console
- [ ] Configure Google provider in Supabase
- [ ] Implement server-side email validation
- [ ] Test OAuth flow
- [ ] Update frontend authentication logic
- [ ] Remove mock authentication
- [ ] Test session persistence
- [ ] Test protected routes
- [ ] Deploy and test in production
- [ ] Monitor authentication errors

---

**Last Updated:** November 5, 2025  
**Status:** Template - Implementation required  
**Security Level:** Critical
