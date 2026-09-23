# TrivianEdge auth.md

Audience: AI agents and automated clients interacting with www.trivianedge.com.

## Registration

No agent registration is required or offered. TrivianEdge does not operate an OAuth authorization server, and there is no `/agent/auth` registration endpoint.

## Supported methods

- **Anonymous, unauthenticated access** is the only method. The public API ([/openapi.json](https://www.trivianedge.com/openapi.json), catalogued at [/.well-known/api-catalog](https://www.trivianedge.com/.well-known/api-catalog)) needs no credentials.
- All site content is readable without credentials. Send `Accept: text/markdown` to get pages as Markdown.

## Credential use

There are no credentials to get or present. Requests are rate-limited per IP; excess requests get HTTP `429`.

The website's contact, chat, and analytics endpoints are same-origin, CSRF-protected backends for the site's own pages. Agents should not call them. To reach TrivianEdge, use https://www.trivianedge.com/contact.
