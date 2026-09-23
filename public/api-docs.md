# TrivianEdge Public API

Base URL: `https://www.trivianedge.com`

Machine-readable spec: [/openapi.json](https://www.trivianedge.com/openapi.json) (OpenAPI 3.1).
API catalog: [/.well-known/api-catalog](https://www.trivianedge.com/.well-known/api-catalog) (RFC 9727).

## GET /api/health

Returns `200` with `{"status": "ok", "timestamp": <epoch ms>}` while the service is operational. Rate-limited per IP; excess requests get `429`.

## Other endpoints

The website's contact, chat, and analytics endpoints are same-origin, CSRF-protected backends for the site's own pages and are not a public API. To reach TrivianEdge, use https://www.trivianedge.com/contact.
