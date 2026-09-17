# TrivianEdge Website Redesign — Operator's Brand Evolution
**Built the Team. Run the System.** | Design + Animation Strategy

---

## Executive Summary

This document outlines the visual + animation strategy for TrivianEdge's complete site redesign. TrivianEdge is **not** a software company—it's an **operations platform builder**: we hire people (BPO/RPO), run their systems (compliance, payroll, 6 countries), and build custom software to make it work seamlessly.

The design must speak to three truths:
1. **We are operators**: we understand complexity, scale, and systems thinking
2. **We are technically excellent**: the site proves we can deliver (not just talk)
3. **We are trustworthy**: visual credibility matters when clients deposit $50k–$500k+ budgets with us

This redesign honors TrivianEdge's **existing brand** (teal #00C49A, Manrope/Fraunces, established component library) while elevating it to premium agency caliber through:
- Sophisticated micro-interactions that feel earned, not trendy
- Visual hierarchy that guides visitors through a 4-act story (People → Compliance → Software → Vision)
- Responsive animation that respects reduced-motion preferences
- Typography that commands attention without shouting

---

## Part 1: Design Direction — Refined for TrivianEdge

### Strategic Positioning: "Systems Operator, Premium Execution"

Your existing brand is **already strong**—teal is distinctive, Fraunces is uncommon and memorable, and the dark/light theme shows sophistication. The redesign is **not** a palette overhaul. It's an **elevation**: sharper hierarchy, more intentional whitespace, animation that communicates operational mastery.

**What stays (locked):**
- Primary accent: Teal `#00C49A` (proven, distinctive, trustworthy)
- Typeface system: Manrope (body/UI) + Fraunces (display/headings) — both already loaded
- Dark-first aesthetic (matches your home page, appeals to technical audiences)
- Component library (`.premium-button`, `.glass`, `.card-lift`, etc.)
- Accessibility baseline: `prefers-reduced-motion`, 44px mobile tap targets

**What evolves:**
- **Visual weight**: Fraunces gets more prominent, more confident sizing (hero headlines at 5.75rem+)
- **Whitespace**: Sections feel less packed; breathing room between content blocks
- **Animation restraint**: Fewer, more meaningful animations; timing feels deliberate, not frenetic
- **Contrast hierarchy**: Text/background ratios pushed to WCAG AAA; muted text gets better definition

### Visual Direction: "High-Confidence Operator"

**Core Aesthetic**: Think **Linear** (minimalist, micro-focused) meets **Stripe** (authoritative, technically sound) meets **your existing home page** (dark, sophisticated, honest).

**Design Principles:**
1. **Asymmetry with purpose** — Content grids break the mold (wide cards + narrow, staggered placement) to feel designed, not templated.
2. **Generous margins** — Between sections, between text and edge. Luxury is the *space between* things.
3. **Restrained animation** — Only animate what guides attention or confirms interaction. No perpetual motion.
4. **Teal as a control**, not decoration — Use it for CTAs, active states, glows, and key metrics. Avoid cyan text on light backgrounds (contrast fail).
5. **Fraunces for authority** — Headlines in display font; body stays Manrope. This keeps the two fonts from fighting.

**Mood**: Confident, systems-literate, technically proven. Visitors should think: *"These people understand operational complexity. I can trust them with my hiring and payroll."*

---

## Part 2: The 4-Act Narrative (Content Structure)

Your homepage is already structured as a narrative arc. Let's clarify it:

**Act 1 — Hero: "Build the Team. Run the System."**
Visual: Motion graphic showing three inputs (People, Compliance, Software) flowing into one output (Integrated Team)
Message: You solve the multi-vendor problem—hiring, payroll, and delivery are one contract.

**Act 2 — What We Do: Three Pillars**
1. **We Find the People** (RPO — 30 days to hire across 6 countries)
2. **We Handle the Paperwork** (BPO — compliance, payroll, taxes across all hubs)
3. **We Build Bespoke Software** (Custom delivery, 24/7 coverage, you own the code)

Message: Most vendors do one thing. We do three—under one roof.

**Act 3 — Proof: Real Work, Real Outcomes**
Case studies, testimonials, metrics.
Message: We're not promising. We're delivering.

**Act 4 — The Venture Thesis (Optional: Aria OS, Aether Logistics)**
AI ventures built on the back of operational expertise.
Message: We don't just hire developers. We build operating systems for the future.

---

## Part 3: Animation Strategy — Framer Motion Techniques

### Core Animation Philosophy
**Principle**: Animations should feel like they're made by operators, not designers. Every motion has a **job**:
1. **Guide through the narrative** — show the viewer what matters (People → Compliance → Software)
2. **Establish trust** — responsive micro-interactions prove technical competence
3. **Confirm interaction** — buttons, forms, and CTAs should "breathe" on engagement
4. **Honor attention** — respect `prefers-reduced-motion` and never force animation on repeat viewers

**Timing**: Animations should feel **inevitable**, not inserted. If you notice it, it's probably too slow.

### Animation Techniques — TrivianEdge Edition

#### 1. **Hero Headline Reveal** (Sequence, Not Character)
**Use Case**: "Build the Team. Run the System." in hero section.

Don't animate character-by-character (feels slow). Instead, animate line-by-line with stagger:
```typescript
export const HeroHeadline = () => {
  return (
    <>
      <motion.span
        className="block text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Build the team.
      </motion.span>
      <motion.span
        className="block text-holo" // teal accent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
      >
        Run the system.
      </motion.span>
    </>
  );
};
```
**Rationale**: Line reveals feel paced and intentional. Two-line stagger (~150ms apart) guides eye naturally. No motion => still powerful.

#### 2. **Three-Pillar Card Stagger** (What We Do Section)
**Use Case**: Three service cards (Find People, Handle Paperwork, Build Software) reveal with timing.

```typescript
export const PillarCard = ({ title, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.55,
        delay: index * 0.08, // 80ms stagger
        ease: [0.16, 1, 0.3, 1], // custom easing
      }}
      className="card-glow rounded-2xl p-8 border border-border"
    >
      <h3 className="text-2xl font-bold text-text">{title}</h3>
      {/* content */}
    </motion.div>
  );
};
```
**Rationale**: Cards pop in bottom-up with slight stagger. Creates visual momentum. 8% scale offset (0.95→1) adds "pop" without being cartoonish.

#### 3. **Metric Counter Animation** (Stats Section)
**Use Case**: "30 days", "Up to 40%", "6 countries", "24/7" floating cards in hero.

```typescript
export const MetricCard = ({ value, unit, label }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 1.0 + i * 0.1 }}
      className="rounded-2xl border border-border bg-white/5 p-5"
    >
      <p className="text-xs uppercase text-white/50 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value}<span className="text-sm opacity-60">{unit}</span>
      </p>
    </motion.div>
  );
};
```
**Rationale**: Cards slide in from right with staggered delays. Confirms the hero messaging (speed, scale, coverage) without being loud.

---

#### 4. **Process Timeline Reveals** (How It Works Section)
```typescript
export const ProcessStep = ({ step, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      <span className="step-number">{step.number}</span>
      <h3 className="font-bold text-lg mb-3">{step.title}</h3>
      <p className="text-muted text-sm">{step.description}</p>
    </motion.div>
  );
};
```
**Rationale**: Steps pop in sequentially (100ms stagger). Reader flows through the 30-day process visually before reading copy.

#### 5. **Case Study Card Reveals** (Proof Section)
```typescript
export const CaseStudyCard = ({ study, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
      }}
      className="card-glow rounded-2xl border border-border p-7"
    >
      <span className="metric-pill">{study.sector}</span>
      <h3 className="text-xl font-bold mb-2">{study.client}</h3>
      <p className="text-muted text-xs mb-4">{study.challenge}</p>
      <div className="bg-cyan-400/10 rounded-lg p-4 mt-auto">
        <p className="text-xs uppercase text-cyan-500 font-bold mb-1">Outcome</p>
        <p className="text-sm">{study.outcome}</p>
      </div>
    </motion.article>
  );
};
```
**Rationale**: Case studies build proof visually. Each card's reveal confirms the previous one—by Act 5, audience is convinced.

#### 6. **Button Hover + Focus States** (CTA Trust Signal)
```typescript
// Your existing `.premium-button` class handles this, but document the motion:
// - On hover: scale 1.00 → 1.05, shadow intensifies (teal glow)
// - On focus: visible outline (focus-ring-2 focus-ring-cyan-500/50)
// - On active: scale 0.98 (press feedback)
```
**Rationale**: Responsive buttons = responsive company. Every interaction confirms technical competence.

### Animation Timing Guidelines
```
Hover/focus states:           200ms (fast, immediate)
Card/block reveals:           600–700ms (measured, intentional)
Process timeline stagger:     100ms between steps (flow without rush)
Page transitions:             400ms (fast enough to feel instant)
Scroll reveals margin:        -50px to -100px (start before viewport entry)
```

**Core Principle**: If you notice the animation is happening, it's probably too slow or too obvious. Animations should feel *inevitable*, not inserted. Respect `prefers-reduced-motion`—reduce all durations to ~1-2ms (instant) for users who've set that preference.

---

## Part 4: Section-by-Section Breakdown — TrivianEdge Specific

### Hero Section
**Content Goal**: Establish the three-part promise: hire globally, handle compliance, build software—all through one partner.

**Current State**: Good baseline. Improve:
- **Eyebrow**: "Canada's BPO, RPO & Bespoke Software Partner" — stays, clear and credible
- **Headline**: "Build the team. / Run the system." — line-by-line reveal (Technique 1)
- **Copy**: Concise, direct. Current copy is strong; just add visual hierarchy via weight
- **CTAs**: "Start the conversation" (primary, teal) + "How it works" (secondary, outlined)
- **Metrics cards** (right side, desktop only): "30 days", "Up to 40%", "6 countries", "24/7"
  - Animate in with stagger (Technique 3)
  - Each metric tells a different story (speed, savings, scope, availability)
- **Background**: Network visual (already implemented, keep it)

**Animation Details**:
- Eyebrow: fade in (0.7s, no delay)
- Headline lines: slide up + fade (0.7s each, 150ms stagger)
- Copy: fade in (0.6s, delay 0.6s)
- Metric cards: slide right + fade (0.7s each, staggered 100ms)
- Buttons: scale on load (0.95→1, 0.5s, delay 0.9s), glow on hover

**Design Notes**:
- Hero stays dark (your existing hero-dark class)
- Fraunces headline at `clamp(2.75rem, 6.5vw, 5.75rem)` (your display-hero scale)
- Teal accent only in "Run the system" line (text-holo class)
- Metric cards inherit your existing card styling + glow

### "What We Do" / Three Pillars Section
**Content Goal**: Differentiate from multi-vendor competitors. Show that hiring + compliance + software all come from one partner.

**Structure** (your current bento layout is good—keep it):
- Wide card (top): "We Find the People" — RPO, 30 days, 6 countries
- Two narrow cards (below):
  - "We Handle the Paperwork" — BPO, compliance, payroll, taxes
  - "We Build Bespoke Software" — custom delivery, 24/7 coverage

**Animations**:
- **Headline**: Fade + slide left (0.7s)
- **Wide card**: Fade + scale (0.95→1) with stagger (Technique 2)
- **Two narrow cards**: Fade + scale, staggered 80ms apart
- **Icons**: Scale on hover (1→1.1), teal glow appears
- **Metric badges** ("~30 days", "6 countries", "24/7"): Fade in with card reveal

**Design Notes**:
- Cards inherit your `.card-glow` and `.glass` classes
- Icon background: gradient (teal to transparent)
- Icon container: border-cyan-400/25, bg-cyan-400/5 (your existing pattern)
- On hover: entire card scales slightly (1.02x), border glows to cyan-400/30
- Typography: Manrope body, Fraunces for card titles (h3)

### "How It Works" / Process Timeline Section
**Content Goal**: Show the 30-day deployment journey. Remove friction concerns ("How fast? How clear is the process?").

**Current State**: Your 4-step timeline is clear. Improve:
- Step icons: Use your icon library, teal accents
- Step titles: h3 in Fraunces (display-section scale)
- Description: Manrope, light weight, 1.6 line height
- Connector lines: Gradient from border to transparent (your neural-bg pattern)

**Animations**:
- Each step pops in bottom-up (Technique 4): fade + slide (0.6s, staggered 100ms)
- Hover: step box gains cyan-400/40 border, icon scales 1.1x
- Numbers: rotate in slightly (0deg→-5deg feedback on hover)

**Design Notes**:
- Grid: 4 columns desktop, 2 columns tablet, 1 mobile
- Connector lines between steps (visible on desktop only)
- No excessive animation—process clarity is the point

### "Proof" / Case Studies + Testimonials Section
**Content Goal**: Real outcomes. Real companies. Real trust.

**Case Study Cards** (4-card grid):
- Sector badge (e.g., "E-commerce")
- Client name (h3, Fraunces)
- Challenge (2 lines max)
- Outcome box (teal bg, highlighted result)
- Top accent stripe (cyan gradient, 4px)

**Animations** (Technique 5):
- Cards stagger in (fade + scale 0.95→1), 80ms between
- Hover: card scales to 1.02x, shadow intensifies
- Top stripe glows on hover

**Testimonials** (2-card grid below case studies):
- Quote (Manrope, light, serif-like treatment via font-weight)
- Author footer: avatar + name + title
- Hover: card gains teal glow, quote text color shifts slightly to teal

**Design Notes**:
- Reuse your `.quote-card` and `.micro-lift-card` classes
- Avatar: gradient teal (cyan-400 to cyan-600)
- Bottom border on footer (thin, teal-tinted)

### Contact / CTA Section
**Content Goal**: Convert. No friction. Fast.

**Current State**: Your dark section + form is solid. Improve:
- Headline: Fraunces, large (display-section scale), white
- Form background: White card on dark section, shadow glow
- Button: Your `.premium-button` class
- Email/phone fallback: Light text with hover teal underline

**Animations**:
- Headline: slide + fade (0.7s)
- Form card: fade + scale (0.95→1) after headline
- Button hover: scale 1.05x, glow intensifies
- Form fields: subtle focus glow (border-cyan-400/30)

**Design Notes**:
- Form inherits section-dark styling
- CTA button: Large, prominent (your premium-button-secondary for outline variant)
- Email/phone links: Underline on hover (teal, 2px)

### Talent Hubs / World Map Section
**Content Goal**: Show geographic reach. Build confidence in sourcing quality.

**Current State**: Map + hub cards is good. Improve:
- Map container: Round border (3rem), subtle cyan border/glow
- Hover pins: Expand slightly, teal highlight
- Hub cards (3-column grid): Icon + country + talent count + link
- On card hover: Link text color to teal, card scales 1.02x

**Animations**:
- Map fades in (scroll reveal)
- Hub cards stagger in (fade + scale), 100ms stagger
- Pin hover: scale 1.1x, glow intensifies
- Link hover: color shift to teal, underline slide (Technique 6 pattern)

**Design Notes**:
- Cards inherit your `.glass` style
- Icons: 48×48px, teal accent
- Responsive: Map full-width on all sizes

---

## Part 5: Tech Stack — Your Existing Setup

### You Already Have the Right Stack
- **React** + Vite (fast, lean, modern)
- **Framer Motion** (already installed—use it!)
- **Tailwind CSS** (existing design tokens, dark mode working)
- **TypeScript** (strict mode enforced)
- **React Router** (navigation handled)

**Do not refactor to Next.js.** Your current stack is production-ready and performant. Focus on animation + visual refinement, not infrastructure changes.

### Animation Best Practices (Framer Motion)
```typescript
// DO: Use transform & opacity (GPU-accelerated)
<motion.div animate={{ scale: 1.05, opacity: 1 }} />

// DON'T: Animate layout properties
<motion.div animate={{ width: 200, padding: 10 }} /> // laggy

// DO: Respect prefers-reduced-motion
const shouldReduce = useReducedMotion();
transition={{ duration: shouldReduce ? 0.01 : 0.6 }}

// DO: Use viewport for scroll-triggered animations
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.25 }}

// DO: Lazy-load heavy components
const TalentHubModal = lazy(() => import('./components/TalentHubModal'));
```

### Performance Targets
```
Lighthouse Score: > 90 (all audits)
LCP (Largest Contentful Paint): < 2.5s
CLS (Cumulative Layout Shift): < 0.1
FID (First Input Delay): < 100ms

Bundle (gzipped):
  - JS: < 100KB (you're likely already there)
  - CSS: < 20KB (Tailwind is small)
  - Images: Optimize/compress all assets

Animation Performance:
  - Target 60 FPS (DevTools > Performance tab)
  - Disable animations on reduced-motion preference
  - Test on mid-range devices (not just MacBook Pro)
```

### Tooling (No Changes Needed)
- ESLint + Prettier (already configured)
- TypeScript strict mode (keep it)
- Vitest/Jest for unit tests (existing)
- Playwright for E2E tests (optional but recommended)

### Monitoring
- Vercel Analytics (if deployed to Vercel)
- Sentry for error tracking (production only)
- Web Vitals monitoring (vercel/analytics package)

---

## Part 6: Reference Inspiration — Operators & SaaS Leaders

Study these sites for how they communicate **operational competence** and **technical authority**:

### 1. **Linear** (linear.app)
**Why**: Minimalist, dark, high-confidence. Everything is responsive, micro-interactions feel earned. Purple accent is distinctive but restrained.
**Study**: Hover states (scale + color shift), loading states, sidebar interactions
**For TrivianEdge**: How to feel premium without being flashy

### 2. **Stripe** (stripe.com)
**Why**: Restraint. Parallax hero, simple card reveals, world-class typography hierarchy. Conveys global scale through calm design.
**Study**: Hero parallax, asymmetrical grids, animation timing (never > 700ms)
**For TrivianEdge**: How to communicate "we handle complexity worldwide"

### 3. **Calendly** (calendly.com)
**Why**: B2B SaaS with operational focus. Clear value prop upfront. Animations underscore, not distract. Case studies prove execution.
**Study**: How scheduling/process is visualized, proof section layout
**For TrivianEdge**: Process timelines (your "How It Works" section)

### 4. **Retool** (retool.com)
**Why**: Developer-to-operator messaging. Dark theme, code examples, operational intelligence shown visually.
**Study**: How technical credibility is visual, not just text
**For TrivianEdge**: Make your software delivery capability visual

### 5. **Notion** (notion.com)
**Why**: Systems thinker's tool. Whitespace, generous margins, hierarchy through size not color. Playful but professional.
**Study**: Asymmetric layouts, generous whitespace, how complexity is explained simply
**For TrivianEdge**: How to explain "hiring + compliance + software" simply

---

## Part 7: Implementation Roadmap

You have a strong foundation. Focus on **polish + animation**, not rebuilds.

### Phase 1: Animation Foundation (Week 1)
- [ ] Audit current Framer Motion usage (check component code)
- [ ] Create animation primitives:
  - `<RevealBlock>` (fade + slide on scroll)
  - `<StaggerList>` (card reveal with delay)
  - `<HoverGlow>` (teal glow on hover, reusable)
- [ ] Test `prefers-reduced-motion` across all animations
- [ ] Measure baseline performance (Lighthouse, FCP, LCP)

### Phase 2: Hero → What We Do (Week 2)
- [ ] Hero headline: line-by-line reveals (Technique 1)
- [ ] Hero metric cards: staggered from right (Technique 3)
- [ ] Three-pillar cards: fade + scale reveals with stagger (Technique 2)
- [ ] All hover states: scale + teal glow
- [ ] Mobile: collapse metric cards into 2×2 grid

### Phase 3: Process → Proof (Week 3)
- [ ] Process timeline: step-by-step reveals (Technique 4)
- [ ] Case study cards: staggered reveals (Technique 5)
- [ ] Testimonial cards: same reveal + hover glow
- [ ] World map: fade in with hub card stagger
- [ ] Test scroll performance on mobile

### Phase 4: Refinement & Accessibility (Week 4)
- [ ] Button hover/focus states (your `.premium-button` class)
- [ ] Form field focus states (subtle teal glow)
- [ ] Link underline animations (Technique 6 pattern)
- [ ] Accessibility pass: focus outlines, ARIA labels, contrast ratios
- [ ] Lighthouse audit (target 90+ on all metrics)
- [ ] Cross-browser testing (Chrome, Safari, Firefox, mobile)

### Phase 5: Polish & Deployment (Week 5)
- [ ] Image optimization (compress, WebP, lazy-load)
- [ ] CSS cleanup (remove unused utility classes)
- [ ] TypeScript strict mode check
- [ ] Final animation review (timing, stagger, prefers-reduced-motion)
- [ ] Deploy to Vercel
- [ ] Set up Web Vitals monitoring
- [ ] A/B test CTA button wording/placement (optional)

### Post-Launch
- [ ] Monitor Lighthouse scores weekly
- [ ] Gather user feedback (clarity, CTAs, mobile experience)
- [ ] Iterate on animation timing if users report distraction

---

## Performance Checklist

Before launch, verify every item:

```
Lighthouse Scores (both desktop & mobile):
  ☐ Performance: > 90
  ☐ Accessibility: > 95
  ☐ Best Practices: > 90
  ☐ SEO: > 95

Core Web Vitals:
  ☐ LCP (Largest Contentful Paint): < 2.5s
  ☐ FID (First Input Delay): < 100ms
  ☐ CLS (Cumulative Layout Shift): < 0.1

Animation:
  ☐ 60 FPS on mid-range device (DevTools > Performance)
  ☐ prefers-reduced-motion respected (all animations off for users who set it)
  ☐ No animation lasts > 1s on scroll reveals
  ☐ All animations GPU-accelerated (transform + opacity only)

Images & Assets:
  ☐ All images optimized (< 200KB for hero, < 100KB for smaller)
  ☐ WebP format with fallbacks
  ☐ Lazy-loading enabled (`loading="lazy"`)
  ☐ Responsive srcset for all hero/case study images

Bundle Size (gzipped):
  ☐ JavaScript: < 100KB
  ☐ CSS: < 20KB
  ☐ Total: < 150KB

Accessibility (axe or similar):
  ☐ WCAG AA minimum (AAA preferred for headings)
  ☐ Color contrast: 4.5:1 (text), 3:1 (UI)
  ☐ Focus outlines visible (not removed)
  ☐ Tab order logical
  ☐ ARIA labels on icons/buttons
  ☐ Form error messages associated with inputs

Mobile:
  ☐ Tested on 375px–768px–1440px widths
  ☐ Touch targets 44px minimum
  ☐ No horizontal scroll
  ☐ Forms readable (font > 16px to prevent zoom)

SEO:
  ☐ Meta title, description, OG image on all pages
  ☐ H1 on each page (once)
  ☐ Internal links to services, blog, proof sections
  ☐ Schema markup (Organization, LocalBusiness already in place)

Browsers:
  ☐ Chrome (latest)
  ☐ Safari (latest)
  ☐ Firefox (latest)
  ☐ Mobile Safari (iOS 16+)
  ☐ Chrome Android
```

---

## Accessibility + Inclusivity

You're an operator—treat accessibility like SLA compliance, not a nice-to-have.

```
Color Contrast:
  - Text on background: 4.5:1 minimum (WCAG AA)
  - Your teal #00C49A on dark #020203: ~9:1 (passes AAA)
  - On light backgrounds: test with contrast checker

Motion:
  - Respect prefers-reduced-motion (set duration to 1-2ms for those users)
  - Never autoplay video (users control playback)
  - Never make animation the only way to convey info

Focus & Navigation:
  - Keyboard-only users should be able to reach all CTAs
  - Tab order should match visual left-to-right, top-to-bottom
  - Focus outline visible (never remove with outline: none)
  - Skip to main content link on page load

Forms:
  - All inputs have associated <label>
  - Error messages linked to input with aria-describedby
  - Loading state communicated (spinner + text)
  - Success state clear (message or visual feedback)

Images:
  - All img tags have descriptive alt text (not "image" or empty)
  - Logos: alt="TrivianEdge"
  - Case study images: alt="[Client name]: [brief result]"
  - Decorative SVGs: aria-hidden="true"
```

---

## Launch Checklist (Final)

Before deploying:
- [ ] Commit strategy document to repo
- [ ] All animations tested with DevTools throttling (slow 4G)
- [ ] Prefers-reduced-motion tested in browser settings
- [ ] Form submission works (email received in inbox)
- [ ] Contact page redirects/thanks message appears
- [ ] All links internal/external working (check for 404s)
- [ ] Cookie banner appears (if applicable)
- [ ] Analytics tracking installed (if used)
- [ ] Error tracking (Sentry) configured
- [ ] Deploy to Vercel or host of choice
- [ ] DNS, SSL certificate active
- [ ] Performance baseline captured for future comparison

---

## Your Competitive Edge

TrivianEdge isn't a software company or a BPO firm or a recruiter. You're an **operational systems builder**. The design must communicate:

1. **We understand complexity** — not through busy visuals, but through clear, intentional hierarchy
2. **We execute with precision** — animations that respond immediately, forms that validate clearly, processes explained step-by-step
3. **We're trustworthy** — authority through restraint, not flash; proof through case studies, not promises
4. **We scale globally** — world map, 6 countries, 24/7 coverage visualized clearly

Let the design *prove* your operational excellence. Every animation should feel like it's made by engineers who understand timing, every button press should feel responsive, every form field should confirm the user's action.

**Excellence is not shouting. It's being heard the first time.**

---

## Next Steps (As Your CTO)

1. **Approve this strategy** — or iterate (this is collaborative)
2. **Create animation primitives** — reusable components (RevealBlock, StaggerList, HoverGlow)
3. **Start with Hero → What We Do** — these two sections set the visual tone
4. **Ship Phase 1 + 2** — then gather feedback before moving to Phases 3–5
5. **Monitor performance** — weekly Lighthouse checks, user feedback on mobile

You have the right stack, the right content, and the right brand. Execute this strategy with discipline, and your site will stand out.

**Built for what's next.** Design that proves it.
