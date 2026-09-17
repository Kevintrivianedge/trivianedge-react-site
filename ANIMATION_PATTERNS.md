# TrivianEdge Animation Patterns Guide

## Overview

This guide documents all reusable animation patterns used throughout the TrivianEdge website. All patterns use Framer Motion and follow the "Kinetic Minimalism" design philosophy.

## Core Principles

1. **GPU-Accelerated**: Only `transform` and `opacity` are animated
2. **Purposeful**: Every animation guides attention or confirms interaction
3. **Accessible**: Respects `prefers-reduced-motion` preference
4. **Consistent**: Uses custom easing [0.16, 1, 0.3, 1] throughout
5. **Performant**: Maintains 60 FPS animation on all devices

## Reusable Animation Patterns

### Pattern 1: Scroll-Triggered Fade + Slide

**Use Case**: Section headings, body copy, content blocks

**Components**: `RevealBlock.tsx`

```typescript
import { RevealBlock } from '@/components/RevealBlock';

<RevealBlock direction="up" delay={0.2} duration={0.7}>
  <h2>Your Heading</h2>
  <p>Your content</p>
</RevealBlock>
```

**Behavior**:
- Initial: opacity 0, slide from specified direction (up/left/right)
- Animate: opacity 1, slide to 0 offset
- Trigger: On scroll (whileInView)
- Duration: 0.7s (customizable)
- Delay: 0.2s (customizable)
- Easing: [0.16, 1, 0.3, 1] (custom)

---

### Pattern 2: Staggered Card Reveal

**Use Case**: Card grids (services, case studies, testimonials)

**Components**: `StaggerList.tsx` or direct Framer Motion

```typescript
import { StaggerList } from '@/components/StaggerList';

<StaggerList staggerDelay={80} itemDuration={0.55}>
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</StaggerList>
```

**Or inline:**

```typescript
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
  {items.map((item, idx) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
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
</div>
```

**Behavior**:
- Initial: opacity 0, y-slide 24px down, scale 0.95 (pop-in)
- Animate: opacity 1, y 0, scale 1
- Stagger: 80-100ms between each card
- Duration: 0.6-0.65s per card
- Trigger: On scroll (whileInView)

---

### Pattern 3: Hover Scale + Glow

**Use Case**: Interactive cards, buttons, links

**Components**: `HoverGlow.tsx` or inline Framer Motion

```typescript
import { HoverGlow } from '@/components/HoverGlow';

<HoverGlow scale={1.05} glowColor="rgba(0, 196, 154, 0.3)">
  <button>Click me</button>
</HoverGlow>
```

**Or inline:**

```typescript
<motion.button
  whileHover={{ 
    scale: 1.05,
    boxShadow: '0 0 40px rgba(0, 196, 154, 0.4)'
  }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  Click me
</motion.button>
```

**Behavior**:
- Scale: 1 → 1.05 (or specified value)
- Glow: Box shadow with teal color
- Duration: 0.2s (instant feedback)
- Easing: easeOut (snappy)
- Tap: Additional scale 0.98 for tactile feedback

---

### Pattern 4: Page Transitions

**Use Case**: Route changes, page navigation

**Implementation**: Wraps `<Routes>` in AnimatePresence

```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <Routes location={location}>
      {/* Routes */}
    </Routes>
  </motion.div>
</AnimatePresence>
```

**Behavior**:
- Duration: 400ms (fast, signals navigation)
- Entrance: Fade in + slide up 12px
- Exit: Fade out + slide down 12px
- Easing: Custom [0.16, 1, 0.3, 1]

---

### Pattern 5: Icon Animation (Secondary)

**Use Case**: Icon scales on parent hover

**Implementation**: Separate motion.div for icons

```typescript
<motion.div
  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
  transition={{ duration: 0.3 }}
>
  {/* Card content */}
  <motion.div
    whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    className="icon-box"
  >
    <Icon />
  </motion.div>
</motion.div>
```

**Behavior**:
- Parent card: scale 1.02 (subtle)
- Icon: scale 1.1 (prominent)
- Icon duration: 0.2s (faster than card)
- Creates responsive, nested animation effect

---

### Pattern 6: Line-by-Line Text Reveal

**Use Case**: Hero headline, important messaging

**Implementation**: Staggered span reveals

```typescript
<h1 className="display-hero">
  <motion.span
    className="block"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0, ease: [0.16, 1, 0.3, 1] }}
  >
    Built For
  </motion.span>
  <motion.span
    className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    What's Next
  </motion.span>
</h1>
```

**Behavior**:
- Each line: Separate animation
- Delay between lines: 150-300ms
- Duration: 0.8s per line
- Entrance: Slide up 30px + fade in
- Creates paced, intentional reveal

---

## Custom Easing Curve

All animations use this custom cubic-bezier easing:

```
[0.16, 1, 0.3, 1]
```

**Visual**: `cubic-bezier(0.16, 1, 0.3, 1)`

**Characteristics**:
- Fast start (slightly overshoot)
- Natural deceleration
- Premium, polished feel
- Matches "Kinetic Minimalism" aesthetic

**Alternative easing for context**:
- `easeOut`: Snappy, immediate feedback (hover)
- `easeInOut`: Smooth transitions (page changes)
- Custom [0.16, 1, 0.3, 1]: Default for all animations

---

## Animation Timing Guidelines

| Element | Duration | Delay | Easing |
|---------|----------|-------|--------|
| Hover effects | 0.2s | 0ms | easeOut |
| Button entrance | 0.55s | 0.15s | [0.16, 1, 0.3, 1] |
| Card stagger | 0.65s | idx × 0.1s | [0.16, 1, 0.3, 1] |
| Icon hover | 0.2s | 0ms | easeOut |
| Page transition | 0.4s | 0ms | [0.16, 1, 0.3, 1] |
| Section reveal | 0.7s | 0-0.35s | [0.16, 1, 0.3, 1] |
| Parallax | Scroll-tied | N/A | linear |

---

## Prefers-Reduced-Motion Implementation

All patterns include motion preference detection:

```typescript
const shouldReduceMotion = useReducedMotion();

// Conditional animation
whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
```

When `prefers-reduced-motion: reduce` is set:
- All durations become 0.01s (instantly completed)
- All hover/enter effects are disabled
- Only opacity/position changes are instant
- Content remains fully accessible

---

## Performance Considerations

### GPU Acceleration
✅ **These animate efficiently:**
```css
transform: translateY(10px) scale(1.05);
opacity: 0.9;
```

❌ **These cause jank:**
```css
width: 100%; height: 100%; top: 10px;
box-shadow: 0 0 20px #00C49A;
filter: blur(10px);
```

### Stagger Timing
For grid layouts, use `delay: idx * 0.08` to `idx * 0.1`:
- **Too tight** (0.02s): Looks rushed
- **Too loose** (0.2s): Drags on too long
- **Sweet spot** (0.08-0.1s): Natural flow

### Scroll Triggers
Always use `whileInView` for entrance animations:
```typescript
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.25 }}
```

Benefits:
- Animations only trigger when element is visible
- Reduces CPU load (not animating off-screen)
- Natural, contextual feel

---

## Component Examples

### Service Card (Asymmetric Bento)

```typescript
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  whileHover={{ 
    scale: 1.02,
    boxShadow: '0 0 24px rgba(0, 196, 154, 0.3)'
  }}
  viewport={{ once: true, amount: 0.25 }}
  transition={{
    duration: wide ? 0.65 : 0.55,
    delay: idx * 0.08,
    ease: [0.16, 1, 0.3, 1]
  }}
>
  {/* Card content */}
</motion.div>
```

### Case Study Card

```typescript
<motion.article
  initial={{ opacity: 0, y: 24, scale: 0.95 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  whileHover={{
    scale: 1.02,
    boxShadow: '0 0 24px rgba(0, 196, 154, 0.3)'
  }}
  viewport={{ once: true, amount: 0.25 }}
  transition={{
    duration: 0.65,
    delay: idx * 0.1,
    ease: [0.16, 1, 0.3, 1]
  }}
>
  {/* Case study content */}
</motion.article>
```

### Button with Tap Feedback

```typescript
<motion.button
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
  viewport={{ once: true }}
  transition={{
    duration: 0.55,
    delay: 0.15,
    ease: [0.16, 1, 0.3, 1]
  }}
>
  Get Started
</motion.button>
```

---

## Testing Animations

### Performance Testing
```bash
# Open DevTools → Performance tab
# Record animation → Check FPS
# Target: Consistent 60 FPS

# Alternative: Lighthouse Performance audit
npm run build && npm run preview
# Open Chrome DevTools → Lighthouse → Run audit
```

### Accessibility Testing
```bash
# Enable prefers-reduced-motion
# macOS: System Preferences → Accessibility → Display → Reduce motion
# Windows: Settings → Ease of Access → Display → Show animations

# Verify animations are disabled
# Content should still be readable and interactive
```

### Visual Testing
- Test in light + dark themes
- Test on mobile (iOS Safari, Chrome)
- Test with slow 4G throttling
- Test with extended animations (slow CPU)

---

## Checklist for New Animations

Before adding new animations, verify:

- [ ] Uses only `transform` and `opacity`
- [ ] Includes `prefers-reduced-motion` check
- [ ] Has appropriate easing [0.16, 1, 0.3, 1]
- [ ] Duration matches pattern guidelines
- [ ] Respects scroll trigger (whileInView)
- [ ] Tested at 60 FPS
- [ ] Tested with motion preference disabled
- [ ] Matches existing visual language
- [ ] Enhances UX (not just decorative)
- [ ] Accessibility maintained
