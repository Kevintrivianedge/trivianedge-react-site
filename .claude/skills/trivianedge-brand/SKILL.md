---
name: trivianedge-brand
description: "TrivianEdge brand guidelines — colors, typography, logo usage, and the site's named component classes (premium-button, glass, card-lift, etc). Use when designing, building, or reviewing any UI on trivianedge-react-site: new pages/components, marketing sections, buttons, cards, dark mode, or anything that needs to look on-brand."
---

# TrivianEdge Brand Guidelines

Source of truth: [tailwind.config.js](../../../tailwind.config.js), [src/theme.css](../../../src/theme.css), [components/Logo.tsx](../../../components/Logo.tsx). If those files change, this skill is stale — re-derive from them rather than trusting memory.

## Color

Full spec (palette, states, gradients, contrast matrix): https://claude.ai/artifact/UsSquMUNQjzNDb5MKroymo. Tokens live in [src/te-tokens.css](../../../src/te-tokens.css) (imported globally). Adopted site-wide 2026-09-24.

**Everything derives from the logo mark:** `#60B46D` (leaf) → `#4DBC9F` (jade) → `#46C5B3` → `#40C9C8` (lagoon).

**Primary brand colour: jade `#4DBC9F`** (CSS var `--cyan`; Tailwind's whole `cyan-*` scale is overridden with a jade ramp, so `cyan-*` classes ARE brand classes):

| Tailwind | Hex | Use |
|---|---|---|
| cyan-300 | `#8FE3CB` | hover on dark, focus ring |
| cyan-400 | `#4DBC9F` | brand: CTAs, active states, accents on dark |
| cyan-500 | `#3FA88D` | pressed state |
| cyan-600 | `#247A65` | brand-coloured **text on white** (5.19:1) |
| cyan-700 | `#1F6655` | stronger text on white |

- **Brand fills take black text.** White on jade is 2.33:1 and fails WCAG.
- Secondary: lagoon `#40C9C8` for map connections, second chart series and gradient ends, never for links. Leaf `#60B46D` appears only inside gradients (Tailwind `emerald-400`).
- **Violet is retired.** It isn't in the logo; the `violet-*` scale is remapped to jade. Don't add purple.
- Status colours sit outside the brand hue band: success `#9BD86A`, warning `#F2B544`, error `#F47C70`, info `#7FAEF5`.

**Dark-first (OLED).** Dark is the default theme (`<html data-theme="dark">`); light remains a user choice.

| Token | Dark (default) | Light |
|---|---|---|
| `--background` | `#000000` | `#ffffff` |
| `--text` | `#EDEFEE` (not pure white) | `#0B1211` |
| `--text-muted` | `#B4BCBA` | `#3A4543` |
| `--surface` | `#111515` | `rgba(255,255,255,0.78)` |
| `--border` | `#232A29` | `rgba(11,18,17,0.09)` |
| `--btn-bg` / `--btn-text` | `#4DBC9F` / `#000000` | `#4DBC9F` / `#000000` |

Never hardcode theme colours in components. Use the `background`/`surface`/`text`/`muted`/`border`/`btn-bg`/`btn-text` Tailwind aliases, or `--te-*` tokens.

**Gradients and glow:** the text gradient (`.te-gradient-text`) goes on the homepage H1 only (at most one H1 per page). Hero glows stay at 6–10% and never animate. Allow at most one glowing element per viewport. Brand colour budget per viewport: about 6% jade and 2% lagoon/gradients; the rest is neutral.

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

1. Accent is logo jade `#4DBC9F` (`cyan-*` classes); brand fills use black text; no violet/purple.
2. Body/UI font is Manrope; headings use Fraunces via `--font-display` (already wired to `h1`–`h4`/`.display-*` — don't hand-apply it elsewhere). No new `Space_Grotesk` usage.
3. Colors reference the `background`/`surface`/`text`/`muted`/`border`/`btn-bg`/`btn-text` tokens, not hardcoded hex, so dark mode via `[data-theme="dark"]` works.
4. Reuse an existing named class (`.premium-button`, `.glass`, `.card-lift`, etc.) before writing new CSS for the same pattern.
5. Respect `prefers-reduced-motion` and the 44px mobile tap target minimum.
