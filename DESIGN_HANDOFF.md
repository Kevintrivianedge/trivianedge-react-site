# TrivianEdge Design Handoff Guide

A comprehensive guide for designers, developers, and stakeholders to understand the premium design system, animation implementation, and development practices for TrivianEdge.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Visual Language](#visual-language)
3. [Component Anatomy](#component-anatomy)
4. [Animation Specifications](#animation-specifications)
5. [Implementation Patterns](#implementation-patterns)
6. [Developer Handoff](#developer-handoff)
7. [Quality Assurance](#quality-assurance)
8. [Deployment & Monitoring](#deployment--monitoring)

---

## Design Philosophy

### Kinetic Minimalism

The TrivianEdge design system embodies three core principles:

- **Confident**: Forward-thinking operator's dashboard aesthetic that inspires trust
- **Premium**: Minimal color palette, generous whitespace, purposeful motion
- **Accessible**: All animations respect user preferences; WCAG 2.1 AA compliance

### Design Goals

- Communicate professionalism and technical excellence
- Guide user attention through purposeful animation
- Maintain accessibility without sacrificing visual impact
- Deliver 60 FPS animations on all devices
- Support both dark and light modes seamlessly

---

## Visual Language

### Color Palette

| Name | Hex | Usage | RGB |
|------|-----|-------|-----|
| **Brand Teal** | #00C49A | Primary accent, CTAs, logo | 0, 196, 154 |
| **Accent Cyan** | #00FFE0 | Glows, highlights, animated elements | 0, 255, 224 |
| **Primary Dark** | #0A0E17 | Main background (premium darkness) | 10, 14, 23 |
| **Text Light** | #FFFFFF | Primary text (WCAG AAA contrast) | 255, 255, 255 |
| **Secondary Dark** | #151A28 | Card backgrounds, elevated surfaces | 21, 26, 40 |
| **Tertiary** | #1E2639 | Hover states, borders | 30, 38, 57 |
| **Muted Text** | #B0B6CC | Secondary text at 60% opacity | 176, 182, 204 |

### Typography

#### Display (Headlines)
- **Font**: Fraunces (serif, prestige)
- **Weight**: 400-600
- **Sizes**: 48px (hero), 36px (section), 28px (subsection)
- **Line Height**: 1.2
- **Letter Spacing**: -0.02em

#### Body/UI
- **Font**: Manrope (sans-serif, modern)
- **Weight**: 400-600
- **Sizes**: 16px (body), 14px (caption)
- **Line Height**: 1.6
- **Letter Spacing**: normal

### Shadows & Depth

```css
/* Subtle card elevation */
box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);

/* Premium glow on hover */
box-shadow: 0 0 24px rgba(0, 196, 154, 0.3);

/* Button glow (CTAs) */
box-shadow: 0 0 40px rgba(0, 196, 154, 0.4);

/* Large shadow for prominence */
box-shadow: 0 8px 32px rgba(0, 196, 154, 0.06);
```

### Spacing

- **Base unit**: 4px
- **Common gaps**: 8px, 12px, 16px, 24px, 32px, 48px, 64px
- **Section padding**: 64px vertical (desktop), 40px vertical (mobile)
- **Container max-width**: 1280px

---

## Component Anatomy

### Service/Product Cards

**Variants**: Single column (full-width) | Two-column | Asymmetric bento

**Structure**:
```
┌─────────────────────────┐
│  Icon [scale 1.1 hover] │
│  Title                  │
│  Description            │
│  [Optional] Badge/Tag   │
└─────────────────────────┘
```

**Interactive States**:
- **Rest**: opacity 1, scale 1, shadow subtle
- **Hover**: scale 1.02, shadow glow (0 0 24px teal), icon scale 1.1
- **Active/Focus**: Same as hover + outline

**Asymmetric Bento Layout**:
```
[Wide Card - Full Width]
[Card] [Card]
```

- Wide card: `md:col-span-2` on 2-column grid
- Animation duration: 0.65s (wide), 0.55s (narrow)
- Stagger: 80ms between items

### Case Study Cards

**Structure**:
```
┌──────────────────────┐
│  Featured Image      │
│  Category Badge      │
│  Title               │
│  Brief Description   │
│  Read More Link      │
└──────────────────────┘
```

**Animations**:
- Entrance: opacity 0 → 1, scale 0.95 → 1, y-slide 24px
- Duration: 0.65s
- Stagger: 100ms between cards
- Hover: scale 1.02 + glow

### Testimonial Cards

**Structure**:
```
┌──────────────────────┐
│  Blockquote          │
│  Author Name         │
│  Company/Title       │
│  Star Rating         │
└──────────────────────┘
```

**Styling**:
- Background: Secondary dark (#151A28)
- Border: 1px teal accent on left edge
- Hover: Scale 1.02 + glow

### Timeline/Process Steps

**Structure**:
```
Step 1 ← Connector ← Step 2 ← Connector ← Step 3
```

**Elements**:
- Numbered circle badge
- Icon (animated on hover)
- Title & description
- Optional connector line (with animation)

**Animations**:
- Icon hover: scale 1.1 (0.2s)
- Connector reveal: line-draw effect
- Stagger: 100ms between steps

---

## Animation Specifications

### Custom Easing Curve

All animations use this cubic-bezier for premium feel:

```
[0.16, 1, 0.3, 1]
cubic-bezier(0.16, 1, 0.3, 1)
```

**Characteristics**: Fast start, natural deceleration, polished feel

### Animation Timing Standards

| Element | Duration | Delay | Easing | Notes |
|---------|----------|-------|--------|-------|
| Hover effects | 0.2s | 0ms | easeOut | Instant feedback |
| Button entrance | 0.55s | 0.15s | [0.16, 1, 0.3, 1] | Premium feel |
| Card stagger | 0.65s | idx × 0.1s | [0.16, 1, 0.3, 1] | Natural flow |
| Icon hover | 0.2s | 0ms | easeOut | Responsive |
| Page transition | 0.4s | 0ms | [0.16, 1, 0.3, 1] | Seamless navigation |
| Section reveal | 0.7s | 0-0.35s | [0.16, 1, 0.3, 1] | Deliberate entrance |
| Text reveal (line) | 0.8s | 0.3s stagger | [0.16, 1, 0.3, 1] | Narrative flow |

### Parallax Effects

**Background parallax**: Subtle offset slower than foreground
- Offset: 20-50% scroll delta
- Apply to: Hero background, section backgrounds
- Avoid: Text layers (causes jank on mobile)

### Entrance Animations

**Scroll-triggered (whileInView)**:
- Initial state: opacity 0, slide 20-30px, scale 0.95 (optional)
- Animate to: opacity 1, slide 0, scale 1
- Trigger: Element 25% in viewport
- Fire once: Yes (don't re-animate on scroll)

**Page transition**:
- Entrance: opacity 0 → 1, slide up 12px
- Exit: opacity 1 → 0, slide down 12px
- Duration: 0.4s
- Between pages: Seamless fade + subtle movement

### Hover Effects

**Cards**:
- Scale: 1.02 (subtle, confident)
- Shadow glow: 0 0 24px rgba(0, 196, 154, 0.3)
- Duration: 0.2s
- Easing: easeOut

**Buttons**:
- Scale: 1.05
- Glow: 0 0 40px rgba(0, 196, 154, 0.4)
- Tap (mobile): scale 0.98 for tactile feedback
- Duration: 0.2s

**Icons**:
- Scale: 1.1 (secondary animation)
- Duration: 0.2s

### Stagger Guidelines

For grids (cards, items):
- **Stagger delay**: 80-100ms between items
- **Optimal range**: 0.08-0.1s
- **Too tight** (<0.05s): Looks rushed
- **Too loose** (>0.15s): Drags on
- **Formula**: `delay: idx * 0.08`

---

## Implementation Patterns

### Scroll-Triggered Fade + Slide

```typescript
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.25 }}
  transition={{
    duration: 0.7,
    delay: 0.2,
    ease: [0.16, 1, 0.3, 1]
  }}
>
  Content here
</motion.div>
```

**Usage**: Section headings, body text, content blocks

### Staggered Card Grid

```typescript
{items.map((item, idx) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 24, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{
      duration: 0.65,
      delay: idx * 0.1,
      ease: [0.16, 1, 0.3, 1]
    }}
  >
    <Card>{item.content}</Card>
  </motion.div>
))}
```

**Usage**: Service cards, case studies, testimonials, hub cards

### Hover Scale + Glow

```typescript
<motion.div
  whileHover={{ scale: 1.02 }}
  style={{
    boxShadow: '0 0 24px rgba(0, 196, 154, 0.3)'
  }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  Interactive content
</motion.div>
```

**Usage**: Cards, buttons, interactive elements

### Page Transitions

```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <Routes>{/* ... */}</Routes>
  </motion.div>
</AnimatePresence>
```

### Prefers-Reduced-Motion Support

```typescript
const shouldReduceMotion = useReducedMotion();

<motion.div
  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
  transition={{
    duration: shouldReduceMotion ? 0.01 : 0.6,
    ease: [0.16, 1, 0.3, 1]
  }}
>
  Content
</motion.div>
```

---

## Developer Handoff

### Setup & Configuration

1. **Install dependencies**: `npm install`
2. **Start dev server**: `npm run dev`
3. **Start worker**: `npm run worker:dev`
4. **Run tests**: `npm run test`
5. **Build for production**: `npm run build`

### Component Library

**Reusable animation components**:

```typescript
// Scroll-triggered fade + slide
import { RevealBlock } from '@/components/RevealBlock';

// Staggered card grid
import { StaggerList } from '@/components/StaggerList';

// Hover scale + glow
import { HoverGlow } from '@/components/HoverGlow';
```

### Styling Conventions

- **Utility-first**: Tailwind CSS for all styling
- **No inline styles**: Use className for design tokens
- **Color tokens**: Use semantic naming (bg-teal-500, text-white)
- **Spacing**: Use Tailwind scale (p-6, mb-4, gap-8)

### Performance Checklist

- ✅ GPU-accelerated transforms only (transform + opacity)
- ✅ Prefers-reduced-motion implemented
- ✅ Code-split routes for lazy loading
- ✅ Images optimized (WebP, lazy loading)
- ✅ CSS tree-shaken (no unused styles)
- ✅ Animation FPS verified (60 FPS target)

---

## Quality Assurance

### Accessibility Testing

- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader support (NVDA, VoiceOver)
- [ ] Prefers-reduced-motion respected
- [ ] Color contrast verified (7:1+ ratio)
- [ ] ARIA labels on interactive elements
- [ ] Semantic HTML structure

### Animation Testing

- [ ] Entrance animations trigger on scroll
- [ ] Hover effects respond smoothly
- [ ] Page transitions feel seamless
- [ ] Stagger timing feels natural
- [ ] 60 FPS maintained during scroll
- [ ] Mobile performance verified

### Browser Testing

- [ ] Chrome/Edge 90+
- [ ] Firefox 88+
- [ ] Safari 15+
- [ ] iOS Safari 15+
- [ ] Chrome Mobile
- [ ] Animation performance on 4G

---

## Deployment & Monitoring

### Pre-Deployment Checklist

```bash
# Type check
npx tsc --noEmit

# Run tests
npm run test

# Lighthouse audit
npm run build && npm run preview
# Open Chrome DevTools → Lighthouse → Run audit
# Target: 90+ on all metrics
```

### Performance Targets

- **Lighthouse**: 90+ (all metrics)
- **LCP**: < 2.5s
- **FCP**: < 1.8s
- **CLS**: < 0.1
- **INP**: < 200ms
- **Animation FPS**: 60 FPS consistent

### Post-Deployment Monitoring

- [ ] Verify site is live
- [ ] Run Lighthouse audit
- [ ] Test animations on mobile
- [ ] Check analytics tracking
- [ ] Monitor error tracking
- [ ] Verify email signup works

### Rollback Procedure

If issues detected:

```bash
# Rollback Vercel
vercel rollback <deployment-id>

# View deployment history
vercel ls
```

---

## Resources

- **[PREMIUM_DESIGN_CONCEPT.md](./PREMIUM_DESIGN_CONCEPT.md)** — 3 visual concepts, animation techniques, specs
- **[ANIMATION_PATTERNS.md](./ANIMATION_PATTERNS.md)** — 6 reusable patterns with code examples
- **[PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)** — Build config, optimizations
- **[ACCESSIBILITY_AUDIT.md](./ACCESSIBILITY_AUDIT.md)** — WCAG compliance, testing procedures
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** — Deployment procedures, CI/CD, monitoring
- **[Storybook](http://localhost:6006)** — Component documentation (run `npm run storybook`)

---

## Questions?

For questions about design implementation:
1. Check the documentation files above
2. Review component stories in Storybook
3. Check animation pattern guide
4. Review accessibility audit for best practices
5. Consult performance optimization guide for technical constraints

---

**Last Updated**: 2026-09-17
**Version**: 1.0.0
**Audience**: Designers, developers, stakeholders
