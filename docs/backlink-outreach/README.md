# Backlink outreach pipeline

What this is, and — just as important — what it isn't.

**What it automates:** research and drafting. Every listing description, pitch
template, and commentary angle in this folder is pre-written from TrivianEdge's
real facts (case studies, founder bio, service lines) so submitting to a
directory or answering a journalist query takes a copy-paste, not a fresh
write-up each time.

**What it deliberately does not automate:** the actual submission. Every
backlink here is earned because a real person at Clutch, GoodFirms, or a
journalist's inbox makes their own editorial decision to include TrivianEdge.
Scripting that step — auto-submitting, auto-commenting, auto-emailing at
scale — is what Google's spam policies call a link scheme, and it's what gets
sites penalized rather than ranked. So the loop stays: research and draft here
(automated), a human sends and follows up (not automated).

## Files

- **`directory-listings.md`** — six real, relevant B2B/BPO directories, ranked
  by trust value, each with ready-to-paste company profile copy and a direct
  submission link.
- **`journalist-queries.md`** — four active journalist-quote platforms (the
  legitimate, editorially-vetted replacement for HARO) plus six pre-written
  expert-commentary angles and a boilerplate bio, so responding to a matching
  query is a five-minute job instead of a from-scratch pitch.
- **`tracker.csv`** — one row per prospect. Open in Sheets/Excel; update
  `status` as things move.

## Suggested cadence

1. **Once:** submit to all six directories in `directory-listings.md`. Maybe
   an hour of work total, one link each, most last indefinitely.
2. **Weekly (~15 min):** skim Qwoted + Featured's digest emails (they email
   you, no scraping needed) for a query matching one of the six angles below;
   paste the relevant boilerplate, personalize the opening line, send.
3. **Update `tracker.csv`** whenever a listing goes live or a quote gets
   published, so status is visible without re-checking every site.

## If you want this pushed further automatically

Qwoted and Featured both offer email digests already — no login automation
needed to receive queries. What I can add on top, once you're ready:
- A scheduled check-in (via the `schedule` skill) that reminds you on the
  weekly cadence above.
- If you forward a matching query, I can draft the response against the six
  angles instantly in that conversation, so the manual step really is just
  "paste and send."

What I won't build: anything that logs into these platforms and submits
without you reading it first — that's the point where "automated" quietly
becomes "spam," even with good intentions behind it.
