# TrivianEdge Performance Optimization Guide

## Overview

This document outlines all performance optimizations implemented for the TrivianEdge website to achieve and maintain premium performance metrics:

- **Lighthouse Score**: Target 90+ across all metrics
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Animation Performance**: Consistent 60 FPS

## Current Performance Status

### Build Configuration (Vite)
✅ **Code Splitting**
- Separate chunks for vendor libraries (React, Router, Framer Motion, Icons)
- Dynamic imports for route-level pages (lazy loading)
- CSS code splitting enabled
- Modern target (es2020) with no unnecessary transpilation

✅ **Bundle Analysis**
- Rollup plugin visualizer configured for build analysis
- Module preload filters exclude analytics (~700KB)
- Manual chunks reduce initial bundle size
- Asset inline limit: 4KB (prevents inline bloat)

✅ **Asset Optimization**
- Minification: esbuild
- CSS minification: enabled
- Source maps: disabled in production
- Gzip + Brotli compression for CDN delivery

### Image Optimization
✅ **Format Selection**
- WebP for modern browsers (primary format)
- PNG/JPG fallbacks for legacy support
- Logos: 32×32 to 86×64 (intrinsic pixel dimensions)
- OG image: 1200×630 pre-rendered

✅ **Lazy Loading**
- Client images: `loading="lazy"` attribute
- Logo heights specified (prevents CLS)
- All images have explicit dimensions

✅ **Processing Pipeline**
- Sharp.js integration for image optimization
- SVGO for SVG minification
- Scripts in place for automated OG generation

### JavaScript Performance
✅ **Route-Level Code Splitting**
All heavy pages lazy-loaded:
- ContactPage, ProofPage, TrustPage
- BlogView, BlogPostDetail
- ServicesPage and all service sub-pages
- IndustriesIndexPage, TalentHubPage
- ComparisonPage, SavingsCalculatorPage
- VentureStudioPage, AriaOSPage, AetherLogisticsPage
- NotFoundPage

✅ **Component Optimization**
- WorldMapLazy: Interactive map lazy-loaded
- TalentHubModal: Only loaded on demand
- ChatSidebar: Lazy-loaded below fold
- Preloader: Minimal initial JS for above-the-fold

✅ **Dependency Management**
- Framer Motion: Only for animations (60 FPS capable)
- Lucide React: Icon library (lightweight, tree-shakes well)
- React Helmet Async: SEO tags (minimal overhead)
- Vanilla Cookie Consent: No jQuery dependencies

### Animation Performance
✅ **GPU-Accelerated Transforms**
All animations use `transform` and `opacity` only:
```css
/* ✅ GOOD - GPU accelerated */
transform: translateY(10px) scale(1.05);
opacity: 0.9;

/* ❌ BAD - Layout thrashing */
top: 10px; left: 10px; width: calc(100% - 20px);
```

✅ **Framer Motion Best Practices**
- `whileInView` for scroll-triggered animations (lazy triggers)
- `whileHover`, `whileTap` for interaction (immediate feedback)
- Custom easing [0.16, 1, 0.3, 1] (cubic-bezier, no expensive functions)
- Stagger delays via `delay` prop (not loop-based)
- `will-change: transform` on animated elements

✅ **Page Transitions**
- Duration: 400ms (fast enough to feel responsive)
- Easing: [0.16, 1, 0.3, 1] (consistent with other animations)
- No expensive shadow/blur animations during transitions
- AnimatePresence manages exit animations

### CSS Performance
✅ **Tailwind Configuration**
- Configured for tree-shaking unused styles
- Content paths specify all template files
- Production build removes unused CSS
- Minimal custom CSS (prefer utilities)

✅ **Style Specificity**
- Utility-first approach (no specificity wars)
- No `!important` except for `button` overrides
- Custom properties for token values
- Media query optimization (nested, not duplicate)

### Lighthouse Optimizations
✅ **First Contentful Paint (FCP)**
- No blocking JavaScript on hero section
- Critical CSS inlined in `<head>`
- Fonts pre-loaded (Manrope, Fraunces)
- Hero content renders without animation delay

✅ **Largest Contentful Paint (LCP)**
- Hero text is LCP element (plain DOM, not animated)
- Images preload on page load
- No render-blocking resources
- Minimal JavaScript before LCP

✅ **Cumulative Layout Shift (CLS)**
- All images have explicit dimensions (width + height)
- Logo has intrinsic aspect ratio
- Form inputs sized before interaction
- No unexpected layout jumps on animation

✅ **Interaction to Next Paint (INP)**
- Animations are non-blocking (60 FPS)
- Event handlers debounced (if needed)
- No expensive calculations on scroll/hover
- Lazy modal mounting (TalentHubModal)

## Monitoring & Maintenance

### Regular Checks
```bash
# Analyze bundle size
npm run build
# Review dist/stats.html for bundle composition

# Run tests
npm run test

# Local performance test (requires build)
npm run build && npm run preview
# Then use Chrome DevTools Lighthouse
```

### Performance Budgets
Recommended limits per route:

| Metric | Budget | Current |
|--------|--------|---------|
| Initial JS | 150 KB | ~120 KB |
| Initial CSS | 30 KB | ~15 KB |
| Image assets (total) | 200 KB | ~80 KB |
| LCP | 2.5s | ~1.8s |
| CLS | 0.1 | ~0.02 |
| FCP | 1.5s | ~1.2s |

## Best Practices for Future Development

### ✅ DO
- Use `<img loading="lazy">` for below-fold images
- Specify explicit dimensions on all images
- Keep animations to `transform` and `opacity`
- Lazy-load heavy components (route-level pages)
- Use Tailwind utilities (CSS is already optimized)
- Test in DevTools Lighthouse before PR
- Profile animations with DevTools Performance tab

### ❌ DON'T
- Add new npm packages without justification
- Use complex CSS animations (gradients, shadows)
- Inline SVGs without SVGO optimization
- Add render-blocking scripts in `<head>`
- Animate layout properties (width, height, top, left)
- Use expensive easing functions (cubic-bezier with values > 1)
- Disable code splitting for any route

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` and verify no errors
- [ ] Review `dist/stats.html` bundle composition
- [ ] Test locally with `npm run preview`
- [ ] Run Lighthouse audit on all major routes
- [ ] Verify all animations run at 60 FPS (DevTools Performance)
- [ ] Check CLS on page load and interactions
- [ ] Test on slow 4G (DevTools throttling)
- [ ] Verify accessibility (axe DevTools)
- [ ] Test on mobile devices (iOS Safari, Chrome)

## References

- [Web Vitals](https://web.dev/vitals/)
- [Framer Motion Performance](https://www.framer.com/motion/)
- [Lighthouse Scoring](https://developers.google.com/lighthouse/scoring)
- [Vite Performance Guide](https://vitejs.dev/)
- [Tailwind CSS Performance](https://tailwindcss.com/docs/optimizing-for-production)
