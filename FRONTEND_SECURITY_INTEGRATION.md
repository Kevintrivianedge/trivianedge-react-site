# Frontend Security Integration Guide

## Overview

Phase 4B Frontend Security Integration provides client-side implementation of the security features deployed on the backend. This guide explains how to integrate these utilities into your React components.

## Core Utilities

### 1. CSRF Token Management (`utils/csrf.ts`)

**Enhanced Functions**:
- `getCsrfToken()`: Get or create CSRF token for session
- `extractRotatedCsrfToken(response)`: Extract new token from response headers
- `addCsrfTokenToHeaders(headers)`: Add token to request headers
- `addCsrfTokenToFormData(data)`: Add token to form body

**How Token Rotation Works**:
```
1. Client requests resource with current token
2. Server validates token (one-time use defense)
3. Server rotates token and sends new one in X-CSRF-Token header
4. Client extracts new token from response header
5. Next request uses rotated token
```

**Usage Example**:
```typescript
import { getCsrfToken, extractRotatedCsrfToken } from '../utils/csrf';

// In component
const token = getCsrfToken();

// After fetch
const response = await fetch('/api/endpoint', {
  headers: { 'X-CSRF-Token': token }
});

// Extract rotated token
const newToken = extractRotatedCsrfToken(response);
// Token is automatically stored, next getCsrfToken() will return it
```

### 2. Request Signing (`utils/requestSigning.ts`)

**Purpose**: Optional HMAC-SHA256 signature for request integrity verification (admin endpoints only)

**Key Functions**:
- `generateRequestSignature(token, method, path, timestamp)`: Create HMAC signature
- `addSigningHeaders(headers, token, method, path)`: Add signature headers to request
- `signAdminRequest(request, token)`: Sign complete request object
- `setAdminToken(token)`: Store admin token securely
- `getAdminToken()`: Retrieve stored admin token
- `fetchAdminAPI(endpoint, options)`: Convenience wrapper for signed admin calls

**Usage Example**:
```typescript
import { setAdminToken, fetchAdminAPI } from '../utils/requestSigning';

// Store admin token (e.g., after login)
setAdminToken('your-admin-token-here');

// Make signed admin API call
const result = await fetchAdminAPI('/api/admin/venture-stats', {
  adminToken: 'your-admin-token',
  sign: true, // Enable HMAC signing
});

if (result.ok) {
  console.log('Admin data:', result.data);
} else {
  console.error('Error:', result.error);
}
```

### 3. Security Event Tracking (`utils/securityEventTracking.ts`)

**Purpose**: Track security-relevant events on client for analysis and debugging

**Initialization** (in your app's main component or entry point):
```typescript
import { initializeSecurityTracking } from '../utils/securityEventTracking';

// In useEffect or componentDidMount
useEffect(() => {
  initializeSecurityTracking();
  
  return () => {
    destroySecurityTracking();
  };
}, []);
```

**Available Events**:
- `csrf_token_rotated`: Token rotation from server
- `csrf_token_expired`: Local token expired
- `request_signed`: Admin request signed
- `signature_error`: Signing failed
- `auth_attempt`: Authentication succeeded
- `auth_failed`: Authentication failed
- `rate_limit_detected`: 429 response
- `security_header_missing`: Missing security header

**Convenience Tracking Functions**:
```typescript
import {
  trackCsrfTokenRotation,
  trackRequestSigned,
  trackAuthAttempt,
  trackRateLimitDetected,
} from '../utils/securityEventTracking';

// Track CSRF rotation
trackCsrfTokenRotation({ endpoint: '/api/chat' });

// Track request signing
trackRequestSigned('/api/admin/stats');

// Track auth attempts
trackAuthAttempt('/api/admin/stats', true); // success
trackAuthAttempt('/api/admin/stats', false); // failure

// Track rate limiting
trackRateLimitDetected('/api/chat', 60);
```

### 4. Secure API Hook (`hooks/useSecureAPI.ts`)

**Purpose**: Unified hook for making secure API calls with automatic CSRF handling and error tracking

**Available Hooks**:
- `useSecureAPI()`: Generic hook for full control
- `useSecurePOST()`: POST requests with CSRF protection
- `useSecureGET()`: GET requests

**Usage - useSecurePOST**:
```typescript
import { useSecurePOST } from '../hooks/useSecureAPI';

function MyComponent() {
  const { post, isLoading } = useSecurePOST();
  
  const handleSubmit = async (data) => {
    const result = await post('/api/inquiry', data);
    
    if (result.error) {
      console.error('Failed:', result.error);
    } else {
      console.log('Success:', result.data);
    }
  };
  
  return (
    <button onClick={() => handleSubmit({ name: 'John' })} disabled={isLoading}>
      {isLoading ? 'Sending...' : 'Send'}
    </button>
  );
}
```

**Usage - useSecureAPI with Admin**:
```typescript
import { useSecureAPI } from '../hooks/useSecureAPI';

function AdminStats() {
  const { call, isLoading } = useSecureAPI();
  
  const loadStats = async () => {
    const result = await call(
      '/api/admin/venture-stats',
      {
        method: 'GET',
        adminToken: true,      // Use admin authentication
        sign: true,             // Enable request signing
        onError: (error, status) => {
          if (status === 401) alert('Unauthorized');
          else alert(`Error: ${error}`);
        }
      }
    );
    
    if (result.data) {
      console.log('Stats:', result.data);
    }
  };
  
  return <button onClick={loadStats} disabled={isLoading}>Load Stats</button>;
}
```

### 5. Streaming Requests (`utils/secureStream.ts`)

**Purpose**: Handle streaming responses (SSE) with CSRF rotation and security tracking

**Usage**:
```typescript
import { secureStreamFetch } from '../utils/secureStream';
import { addCsrfTokenToFormData, getCsrfToken } from '../utils/csrf';

async function streamChat(message) {
  let fullResponse = '';
  
  const success = await secureStreamFetch(
    '/api/chat',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        addCsrfTokenToFormData({ message })
      ),
    },
    {
      onChunk: (chunk) => {
        // Process each chunk as it arrives
        console.log('Received:', chunk);
        fullResponse += chunk;
      },
      onError: (error, status) => {
        if (status === 429) {
          alert('Rate limited, please wait');
        } else {
          alert(`Error: ${error}`);
        }
      },
      onComplete: () => {
        console.log('Stream complete:', fullResponse);
      }
    }
  );
  
  return success;
}
```

### 6. Security Status Indicator (`components/SecurityStatusIndicator.tsx`)

**Purpose**: Display current security status to users (admin-only)

**Features**:
- Shows security status (healthy/warning/critical)
- Expandable details panel with metrics
- Fetches from `/api/security/health` endpoint
- Color-coded severity indicators

**Usage**:
```typescript
import SecurityStatusIndicator from '../components/SecurityStatusIndicator';

function AdminDashboard() {
  return (
    <div>
      {/* Simple indicator */}
      <SecurityStatusIndicator status="healthy" />
      
      {/* With expandable details */}
      <SecurityStatusIndicator 
        status="warning" 
        showDetails 
        className="mb-4"
      />
    </div>
  );
}
```

## Integration Examples

### Example 1: Form Submission with CSRF Protection

**Before** (without security utilities):
```typescript
const handleSubmit = async (formData) => {
  const response = await fetch('/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      csrf_token: getCsrfToken(), // Manual token management
    }),
  });
  
  // Manual error handling
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};
```

**After** (with useSecureAPI):
```typescript
import { useSecurePOST } from '../hooks/useSecureAPI';

function InquiryForm() {
  const { post, isLoading } = useSecurePOST();
  
  const handleSubmit = async (formData) => {
    const result = await post('/api/inquiry', formData, false);
    
    if (result.error) {
      alert(result.error);
    } else {
      console.log('Success');
    }
  };
  
  return <button onClick={() => handleSubmit({})}>Submit</button>;
}
```

**What's improved**:
- ✅ CSRF token automatically included and rotated
- ✅ Security headers verified
- ✅ Rate limit detection
- ✅ Security events tracked
- ✅ Error handling standardized
- ✅ Automatic token rotation from response headers

### Example 2: Admin Operations with Request Signing

**Before**:
```typescript
const loadAdminStats = async (token) => {
  const response = await fetch('/api/admin/venture-stats', {
    method: 'GET',
    headers: {
      'X-Admin-Token': token,
      'Content-Type': 'application/json',
    },
  });
  
  if (response.status === 401) {
    // Handle auth error
  }
  
  return response.json();
};
```

**After** (with optional signing):
```typescript
import { useSecureAPI } from '../hooks/useSecureAPI';
import { setAdminToken } from '../utils/requestSigning';

function AdminPanel() {
  const { call, isLoading } = useSecureAPI();
  
  // On login
  useEffect(() => {
    setAdminToken(adminToken);
  }, [adminToken]);
  
  const loadStats = async () => {
    const result = await call('/api/admin/venture-stats', {
      method: 'GET',
      adminToken: true,
      sign: true, // Add HMAC signature
      onError: (error, status) => {
        if (status === 401) alert('Login expired');
      }
    });
    
    return result.data;
  };
  
  return <button onClick={loadStats}>Load Stats</button>;
}
```

**What's improved**:
- ✅ Request signing prevents tampering
- ✅ Timestamp-based replay attack prevention
- ✅ Unified authentication handling
- ✅ Security event tracking
- ✅ Automatic error mapping

### Example 3: Streaming Chat with Security

**Before**:
```typescript
const sendMessage = async (msg) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: msg,
      csrf_token: getCsrfToken(),
    }),
  });
  
  const reader = response.body.getReader();
  // ... manual stream processing
};
```

**After** (with secureStreamFetch):
```typescript
import { secureStreamFetch } from '../utils/secureStream';
import { addCsrfTokenToFormData } from '../utils/csrf';

function ChatComponent() {
  const sendMessage = async (msg) => {
    await secureStreamFetch(
      '/api/chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addCsrfTokenToFormData({ message: msg })),
      },
      {
        onChunk: (chunk) => {
          // Process SSE chunks
          console.log('Chunk:', chunk);
        },
        onError: (error, status) => {
          console.error(`Error (${status}):`, error);
        },
      }
    );
  };
  
  return <button onClick={() => sendMessage('Hello')}>Send</button>;
}
```

**What's improved**:
- ✅ CSRF token rotation from SSE response
- ✅ Rate limiting detection on streams
- ✅ Unified error handling
- ✅ Security header verification
- ✅ Event tracking for all interactions

## Configuration

### Setting Up Admin Token

The request signing utilities require admin token configuration:

```typescript
import { setAdminToken, getAdminToken } from '../utils/requestSigning';

// On login
function handleLogin(credentials) {
  const token = await authenticate(credentials);
  setAdminToken(token);
}

// On logout
function handleLogout() {
  clearAdminToken();
}

// Check if authenticated
const isAuthenticated = !!getAdminToken();
```

### Initializing Security Tracking

In your app's root component:

```typescript
import { useEffect } from 'react';
import { 
  initializeSecurityTracking, 
  destroySecurityTracking 
} from '../utils/securityEventTracking';

function App() {
  useEffect(() => {
    // Initialize on mount
    initializeSecurityTracking();
    
    // Cleanup on unmount
    return () => destroySecurityTracking();
  }, []);
  
  return <YourAppContent />;
}
```

## Error Handling

All secure API utilities provide consistent error handling:

```typescript
const result = await post('/api/endpoint', data);

if (result.error) {
  // result.error: string message
  // result.status: optional HTTP status code
  
  if (result.status === 429) {
    // Rate limited
  } else if (result.status === 401) {
    // Unauthorized
  } else {
    // Other error
  }
}
```

## Security Best Practices

### Do's

✅ **Do** use `useSecureAPI` hook for all authenticated endpoints
✅ **Do** enable request signing for sensitive admin operations
✅ **Do** initialize security tracking in app root
✅ **Do** handle rate limit errors (429) gracefully
✅ **Do** update admin token on login/logout
✅ **Do** verify security headers in development

### Don'ts

❌ **Don't** store admin tokens in localStorage
❌ **Don't** skip CSRF token rotation
❌ **Don't** ignore 401/429 responses
❌ **Don't** hardcode API endpoints without security utilities
❌ **Don't** disable request signing for production admin operations

## Testing Security Features

### Unit Tests

```typescript
import { getCsrfToken, extractRotatedCsrfToken } from '../utils/csrf';

describe('CSRF Token Rotation', () => {
  it('should extract token from response header', () => {
    const response = new Response(null, {
      headers: { 'X-CSRF-Token': 'new-token-123' }
    });
    
    const token = extractRotatedCsrfToken(response);
    expect(token).toBe('new-token-123');
  });
});
```

### Integration Tests

```typescript
describe('Secure API', () => {
  it('should include CSRF token in request', async () => {
    const { post } = useSecurePOST();
    await post('/api/endpoint', { test: true });
    
    // Verify request included X-CSRF-Token header
  });
});
```

## Migration Guide

### Migrating Existing Components

1. **Identify API calls**: Find all `fetch()` calls to protected endpoints
2. **Replace with hook**: Replace with `useSecureAPI`, `useSecurePOST`, or `useSecureGET`
3. **Update error handling**: Use standardized error response format
4. **Add tracking**: Add optional security event tracking
5. **Test thoroughly**: Verify CSRF token rotation works end-to-end

### Example Migration

**Before**:
```typescript
const handleInquiry = async (data) => {
  const response = await fetch('/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      csrf_token: getCsrfToken(),
    }),
  });
  
  if (!response.ok) {
    setError(`HTTP ${response.status}`);
    return;
  }
  
  setSuccess(true);
};
```

**After**:
```typescript
import { useSecurePOST } from '../hooks/useSecureAPI';

function InquiryForm() {
  const { post, isLoading } = useSecurePOST();
  
  const handleInquiry = async (data) => {
    const result = await post('/api/inquiry', data);
    
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };
  
  return <form onSubmit={() => handleInquiry({})}>...</form>;
}
```

## Troubleshooting

### CSRF Token Not Rotating

**Symptom**: Same token used for multiple requests
**Solution**:
1. Verify `extractRotatedCsrfToken` is called after each response
2. Check that server is sending `X-CSRF-Token` header
3. Verify sessionStorage is enabled in browser

### Admin Requests Failing with 401

**Symptom**: Unauthorized error on admin endpoints
**Solution**:
1. Verify admin token is set: `getAdminToken()` returns value
2. Check token hasn't expired on server
3. If using signing, verify timestamp is within 5-minute window

### Rate Limit Errors Not Detected

**Symptom**: No 429 handling
**Solution**:
1. Verify server is returning 429 status
2. Check `onError` callback is provided
3. Ensure server sends `Retry-After` header

## Performance Considerations

- CSRF token generation: <1ms (crypto.getRandomValues)
- Token storage: sessionStorage access <1ms
- HMAC signing: ~5-10ms per request (async crypto.subtle)
- Security event batching: 50 events or 60s, automatic flush
- Header verification: <1ms (string comparison)

**Impact**: <50ms per request with all security features enabled.

## Support & Documentation

- Security architecture: See `SECURITY_MONITORING.md`
- API endpoints: See `constants/api.ts`
- Backend implementation: See `src/worker.ts`
- Examples: See individual component files with security integration

## Changelog

### Phase 4B Features

- ✅ CSRF token rotation from response headers
- ✅ HMAC-SHA256 request signing for admin endpoints
- ✅ Security event tracking and batching
- ✅ Unified secure API hooks
- ✅ Streaming request support
- ✅ Security status indicator component
- ✅ Comprehensive error handling
- ✅ Rate limit detection and handling
