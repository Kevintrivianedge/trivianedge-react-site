# TrivianEdge API Documentation

Complete API reference for TrivianEdge backend services running on Cloudflare Workers.

## Base URL

```
https://www.trivianedge.com/api
```

## Authentication

### Admin Token
Some endpoints require an admin token for access. Pass via header:

```
X-Admin-Token: <ADMIN_API_TOKEN>
```

### Bearer Token
Chat and AI endpoints may use bearer tokens:

```
Authorization: Bearer <TOKEN>
```

---

## Health & Status

### Health Check
Check if the API is operational.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-09-17T01:36:00Z",
  "version": "1.0.0"
}
```

**Rate Limit:** 100 req/min

---

## Chat & AI

### Send Chat Message (Stream)
Stream real-time responses from Aria chatbot.

**Endpoint:** `POST /api/chat`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What services do you offer?"
    }
  ],
  "sessionId": "uuid-string",
  "systemPrompt": "Optional custom system prompt",
  "maxTokens": 1024,
  "temperature": 0.7
}
```

**Response:**
```
Server-Sent Events (SSE) stream:

event: message
data: {"type":"message","content":"Hello! TrivianEdge offers..."}

event: done
data: {"type":"done","stopReason":"end_turn"}
```

**Rate Limit:** 5 req/min per IP
**Timeout:** 60 seconds

**Error Responses:**
- `400` - Invalid request format
- `401` - Missing or invalid API key
- `429` - Rate limited
- `500` - Server error

---

## Content Generation

### Generate Content
Single-request AI content generation (non-streaming).

**Endpoint:** `POST /api/generate`

**Request Body:**
```json
{
  "prompt": "Generate a job description for a senior developer",
  "type": "job_description|blog_post|email|other",
  "maxTokens": 2048
}
```

**Response:**
```json
{
  "success": true,
  "content": "Generated content here...",
  "tokensUsed": 450,
  "model": "claude-haiku-4-5-20251001"
}
```

**Rate Limit:** 5 req/min per IP

---

## Analytics

### Track Event
Record user interactions and events.

**Endpoint:** `POST /api/analytics/events`

**Request Body:**
```json
{
  "event": "button_click",
  "payload": {
    "buttonId": "cta-hero",
    "section": "hero"
  },
  "sessionId": "uuid-string"
}
```

**Response:**
```json
{
  "success": true
}
```

**Rate Limit:** 20 req/min per IP

---

### Track Performance Metric
Record Core Web Vitals and performance metrics.

**Endpoint:** `POST /api/analytics/metrics`

**Request Body:**
```json
{
  "type": "performance_metric",
  "metric": "LCP",
  "value": 2100,
  "rating": "good",
  "url": "https://www.trivianedge.com/services",
  "userAgent": "Mozilla/5.0..."
}
```

**Supported Metrics:**
- `LCP` - Largest Contentful Paint
- `CLS` - Cumulative Layout Shift
- `INP` - Interaction to Next Paint
- `FCP` - First Contentful Paint
- `TTFB` - Time to First Byte

**Ratings:**
- `good` - Metric within acceptable range
- `needs-improvement` - Metric slightly above target
- `poor` - Metric significantly above target

**Response:**
```json
{
  "success": true
}
```

**Rate Limit:** 20 req/min per IP

---

### Batch Analytics
Submit multiple events in a single request.

**Endpoint:** `POST /api/analytics/batch`

**Request Body:**
```json
{
  "type": "batch_events",
  "events": [
    {
      "eventName": "page_view",
      "properties": { "path": "/" }
    },
    {
      "eventName": "button_click",
      "properties": { "button": "cta" }
    }
  ],
  "timestamp": 1694923360000
}
```

**Response:**
```json
{
  "success": true,
  "eventsProcessed": 2
}
```

**Rate Limit:** 20 req/min per IP
**Max Events per Batch:** 100

---

## Forms & Submissions

### Contact/Inquiry
Submit a contact form inquiry.

**Endpoint:** `POST /api/inquiry`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "company": "Acme Corp",
  "service": "AI Development",
  "message": "We need help with AI chatbot development",
  "budget": "50000-100000",
  "timeline": "3-6 months"
}
```

**Response:**
```json
{
  "success": true,
  "referenceId": "INQ-20260917-001",
  "message": "Thank you for your inquiry. We'll be in touch soon."
}
```

**Rate Limit:** 20 req/min per IP

---

### Venture Studio Submission
Submit for Venture Studio program.

**Endpoint:** `POST /api/venture/submit`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@startup.com",
  "companyName": "AI Innovations Inc",
  "industry": "AI/ML",
  "description": "Building AI-powered analytics platform",
  "stage": "seed",
  "fundingAmount": 500000,
  "website": "https://aiinnovations.com",
  "linkedIn": "https://linkedin.com/company/aiinnovations"
}
```

**Stages:**
- `idea` - Concept stage
- `mvp` - MVP built
- `beta` - Beta testing
- `launched` - Product launched
- `scaling` - Growth stage

**Response:**
```json
{
  "success": true,
  "referenceId": "VENTURE-20260917-001",
  "message": "We're excited about your venture! Our team will review and contact you."
}
```

**Rate Limit:** 5 req/min per IP
**CRM Integration:** Automatically syncs to CRM system

---

### Early Access Signup
Sign up for early access program.

**Endpoint:** `POST /api/early-access`

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "company": "Tech Company",
  "interests": ["AI", "Automation"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome! Check your email for confirmation."
}
```

**Rate Limit:** 20 req/min per IP

---

## Admin Endpoints

### Venture Statistics
Get venture studio metrics and funnel stats.

**Endpoint:** `GET /api/admin/venture-stats`

**Headers:**
```
X-Admin-Token: <ADMIN_API_TOKEN>
```

**Query Parameters:**
- `days` - Number of days to analyze (default: 30)
- `metric` - Specific metric (submissions|views|conversions)

**Response:**
```json
{
  "period": "2026-08-17 to 2026-09-17",
  "submissions": {
    "total": 45,
    "qualified": 12,
    "conversionRate": 26.7
  },
  "averageResponseTime": "2.5 hours",
  "trending": "up"
}
```

**Rate Limit:** 10 req/min per IP

---

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": "Description of what went wrong",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_REQUEST` | 400 | Malformed request body |
| `VALIDATION_ERROR` | 400 | Invalid field values |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `API_ERROR` | 502 | Upstream API failure |

---

## Rate Limiting

Rate limits are enforced per IP address and reset every 60 seconds.

**Limit Headers:**
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1694923420
```

When rate limited, you'll receive:
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 45
}
```

---

## CORS Policy

Requests from the following origins are allowed:

- `https://www.trivianedge.com` (production)
- `http://localhost:3000` (development)

**CORS Headers:**
```
Access-Control-Allow-Origin: https://www.trivianedge.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token
```

---

## Security

### Data Protection
- All requests use HTTPS
- API keys are never logged
- Sensitive data is redacted in logs
- Rate limiting prevents abuse

### Best Practices
1. **Never commit API keys** to version control
2. **Use environment variables** for secrets
3. **Validate input** on the client side
4. **Use HTTPS only** for API calls
5. **Implement retry logic** with exponential backoff

---

## Changelog

### v1.0.0 (2026-09-17)
- Initial API release
- Chat endpoint with streaming
- Analytics tracking
- Venture studio integration
- Admin statistics endpoint

---

## Support

For API support:
- Email: api-support@trivianedge.com
- Status Page: https://status.trivianedge.com
- Documentation: https://docs.trivianedge.com

---

**Last Updated:** 2026-09-17
**API Version:** 1.0.0
