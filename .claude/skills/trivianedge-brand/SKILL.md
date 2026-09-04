---
name: trivianedge-brand
description: "TrivianEdge brand guidelines — colors, typography, logo usage, and the site's named component classes (premium-button, glass, card-lift, etc). Use when designing, building, or reviewing any UI on trivianedge-react-site: new pages/components, marketing sections, buttons, cards, dark mode, or anything that needs to look on-brand."
---

# TrivianEdge Brand Guidelines

Source of truth: [tailwind.config.js](../../../tailwind.config.js), [src/theme.css](../../../src/theme.css), [components/Logo.tsx](../../../components/Logo.tsx). If those files change, this skill is stale — re-derive from them rather than trusting memory.

## Color

**Primary brand color — teal `#00C49A`** (CSS var `--cyan`, also aliased over Tailwind's built-in `cyan-*` scale):

| Token | Hex | Tailwind |
|---|---|---|
| cyan-400 (brand) | `#00C49A` | `cyan-400`, `bg-cyan-400`, etc. |
| cyan-500 (hover) | `#00A882` | `cyan-500` |
| cyan-600 | `#008C6B` | `cyan-600` |
| cyan-700 | `#007158` | `cyan-700` |

Use `#00C49A` as the single accent for CTAs, links, active states, glows, and highlights. Don't introduce a second accent hue for the same purpose.

**Secondary accent — violet `#6366f1`** (CSS var `--violet`). Reserved deliberately for **one surface only: the chat launcher/Aria widget**. Do not spread violet into buttons, links, or general UI — that dilutes the single-accent system the rest of the site relies on.

**Theme tokens** (swap automatically via `[data-theme="dark"]` on a root element, not `prefers-color-scheme`):

| Token | Light | Dark |
|---|---|---|
| `--background` | `#ffffff` | `#020203` |
| `--text` | `#0f172a` | `#ffffff` |
| `--text-muted` | `#334155` | `#9ca3af` |
| `--surface` | `rgba(255,255,255,0.78)` | `rgba(255,255,255,0.05)` |
| `--border` | `rgba(15,23,42,0.08)` | `rgba(255,255,255,0.1)` |
| `--btn-bg` | `#00C49A` | `#ffffff` |
| `--btn-text` | `#ffffff` | `#000000` |

Never hardcode `#0f172a`/`#ffffff`/etc. directly in new components — use the `background`/`surface`/`text`/`muted`/`border`/`btn-bg`/`btn-text` Tailwind color aliases (they map to these CSS vars) so dark mode works automatically.

**Logo mark only** uses its own 4-stop gradient, distinct from the primary teal — don't reuse these outside the logo SVG: `#60B46D → #4DBC9F → #46C5B3 → #40C9C8`.

## Typography

**Body/UI font: Manrope** (`--font-body`, weights 400–800), loaded from Google Fonts. Use for all body text, nav, buttons, form controls — this is the default and should not be overridden in new components.

**Display font: Fraunces** (`--font-display`, variable weight 300–800, optical size axis), loaded from Google Fonts alongside Manrope in [index.html](../../../index.html). Applies to `h1`–`h4`, `.display-hero`, and `.display-section` only — every heading level, consistently, so it reads as a designed system rather than a one-off hero flourish. **Never apply Fraunces outside a heading element or `.display-*` class** — body copy, nav links, buttons, and UI chrome stay on Manrope. Added 2026-09 as the site's typographic signature (chosen for Awwwards-caliber distinctiveness — see `feedback_50k_agency_design_bar` and `project_award_nomination` memory).

**Known exception — Space Grotesk**: appears only in [components/Logo.tsx](../../../components/Logo.tsx) (wordmark), [components/Preloader.tsx](../../../components/Preloader.tsx), and the "Aria" heading in [components/ChatSidebar.tsx](../../../components/ChatSidebar.tsx). This is a deliberate legacy carve-out, not a second brand font — a regression test (`__tests__/components/PremiumDesign.test.tsx`) explicitly asserts nav links do NOT use it. **Do not add `font-['Space_Grotesk']` to any new component.** The same non-spreading discipline now applies to Fraunces — it stays confined to headings, not because of a test, but by the same principle: an uncontrolled second (or third) display face is how sites drift back into looking templated.

Display/heading scale uses `clamp()` for fluid sizing plus shared tracking/leading vars — reuse these rather than picking arbitrary sizes:
- `--tracking-hero: -0.03em` (`.display-hero`), `--tracking-section: -0.02em` (`.display-section`), `--tracking-heading: -0.01em` (`h1`–`h4`) — tracking scales with size rather than one flat value
- `--leading-display: 1.02`
- `.display-hero` — `clamp(2.75rem, 6.5vw, 5.75rem)`
- `.display-section` — `clamp(2rem, 5.4vw, 4.5rem)`

## Spacing

Section and stack rhythm is driven by shared clamp() vars — reuse them instead of ad hoc padding:
- `--space-section-y: clamp(4rem, 6.5vw, 7rem)` → apply via `.section-shell`
- `--space-stack-lg: clamp(1.5rem, 2.5vw, 2.25rem)`
- `--space-stack-md: clamp(1rem, 1.6vw, 1.4rem)`

## Named component classes

Prefer these existing utility classes over inventing new ad hoc styles for the same pattern:

| Class | Use for |
|---|---|
| `.premium-button` / `.premium-button-secondary` | Primary/secondary CTA buttons (glow, sheen, hover lift) |
| `.glass` | Glassmorphic panels/cards (has light/dark variants built in) |
| `.card-lift` | Hover-lift for content link cards (RelatedLinks, IndustryPage) |
| `.hover-neon-glow` | Hover-lift for blog cards and the scroll-to-top button |
| `.section-label` | Small uppercase pill/chip label above a section heading |
| `.metric-pill` | Inline stat/metric badge (teal-tinted) |
| `.quote-card` | Testimonial/pull-quote card with decorative quotation mark |
| `.text-gradient` / `.text-holo` | Solid teal text-emphasis spans (no longer gradient — flagged as an AI-slop tell and fixed 2026-09) |
| `.hero-dark`, `.hero-mesh`, `.section-dark`, `.section-tint` | Full-bleed section background treatments (cinematic dark vs. tinted light) |
| `.bento-grid` / `.bento-grid-2` | Bento-style grid layouts |
| `.skip-link` | Accessibility skip-to-content link — required on any new page shell |

Micro-interaction/accessibility conventions already encoded in [src/theme.css](../../../src/theme.css) — don't break these when adding UI:
- All hover-transform effects are disabled under `@media (hover: none)` and `@media (prefers-reduced-motion: reduce)`.
- Buttons/links get `min-height: 44px` on mobile (`@media (max-width: 640px)`).
- Transitions on color/background use `0.3s ease` consistently; don't introduce a different easing curve for the same kind of interaction without reason.

## Quick checklist before shipping new UI

1. Accent color is teal `#00C49A` only (violet stays confined to the chat widget).
2. Body/UI font is Manrope; headings use Fraunces via `--font-display` (already wired to `h1`–`h4`/`.display-*` — don't hand-apply it elsewhere). No new `Space_Grotesk` usage.
3. Colors reference the `background`/`surface`/`text`/`muted`/`border`/`btn-bg`/`btn-text` tokens, not hardcoded hex, so dark mode via `[data-theme="dark"]` works.
4. Reuse an existing named class (`.premium-button`, `.glass`, `.card-lift`, etc.) before writing new CSS for the same pattern.
5. Respect `prefers-reduced-motion` and the 44px mobile tap target minimum.
