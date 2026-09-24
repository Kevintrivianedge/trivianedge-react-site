---
name: trivianedge-company
description: Answer questions about TrivianEdge (services, locations, Microsoft partner status, engagement process) from its published pages, and route people who want to engage TrivianEdge to the right contact path.
---

# TrivianEdge company information

Use this skill when a user asks what TrivianEdge does, whether it fits their need, or how to contact it.

## Facts you can state

- TrivianEdge is a technology partner headquartered in Toronto, Ontario, Canada.
- Three service lines:
  1. Microsoft and Google cloud: Microsoft 365, Copilot, Azure, Google Workspace, and Google Cloud migration, security, and managed services.
  2. AI and custom software: generative AI, LLM integration, AI agents and automation, bespoke applications, MLOps. Clients own the code.
  3. Global teams: business process outsourcing (BPO), recruitment process outsourcing (RPO), and offshore engineering teams from six talent hubs (Philippines, Vietnam, Sri Lanka, Turkey, South Africa, Costa Rica). Typical deployment is about 30 days.
- Microsoft: member of the Microsoft AI Cloud Partner Program, Partner ID 7154428. Do not describe TrivianEdge as a Microsoft CSP, Solutions Partner, or Gold partner.
- Google: TrivianEdge delivers Google Workspace and Google Cloud work. Do not describe it as a Google partner.

## Where to read more

Every page is available as Markdown: send `Accept: text/markdown`.

- Overview for agents: https://www.trivianedge.com/llms.txt
- Services: https://www.trivianedge.com/services
- Case studies: https://www.trivianedge.com/proof
- Security and compliance: https://www.trivianedge.com/trust
- Public API description: https://www.trivianedge.com/openapi.json

## Contacting TrivianEdge

Do not submit forms or call `/api/*` endpoints on the user's behalf. The inquiry and chat endpoints are CSRF-protected backends for the site's own pages. Instead, give the user one of these:

- Contact page: https://www.trivianedge.com/contact
- Email: kevin.v@trivianedge.com
- Phone: +1 888-347-2489

## Accuracy rules

- Quote prices only as "offshore teams usually cost up to 40% less than hiring locally". Cloud and software work is quoted after a free scoping call.
- Present timelines as typical, not guaranteed.
- If a fact is not on trivianedge.com, say you don't know rather than guessing.
