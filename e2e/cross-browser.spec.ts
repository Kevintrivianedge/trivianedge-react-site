import { test, expect, type Page } from '@playwright/test';

// Production-build checks run in every engine (see playwright.prod.config.ts).
// Covers what breaks differently between Chrome, Firefox and Safari: hydration
// of the SSR HTML, first-paint visibility, layout overflow on phones, fonts,
// and the interactive shell.

const ROUTES = [
  '/',
  '/services',
  '/services/cloud',
  '/services/ai-development',
  '/services/it-outsourcing',
  '/services/it-outsourcing/philippines',
  '/about',
  '/proof',
  '/contact',
  '/blog',
  '/blog/what-is-agentic-ai-automation',
  '/industries/education',
  '/talent/philippines',
];

// Third-party noise we don't control (blocked trackers, offline CDNs in CI).
const IGNORED = /googletagmanager|google-analytics|clarity\.ms|facebook|trustpilot|flagcdn|open-meteo|Failed to load resource/i;

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !IGNORED.test(m.text())) errors.push(m.text());
  });
  return errors;
}

for (const route of ROUTES) {
  test(`${route} loads, hydrates and renders cleanly`, async ({ page }) => {
    const errors = collectErrors(page);
    const res = await page.goto(route, { waitUntil: 'networkidle' });
    expect(res?.status()).toBe(200);

    // Visible without waiting for JS animations (the SSR HTML must not ship
    // above-the-fold content at opacity 0).
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    expect(await h1.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.9);

    // One title, one description, one canonical per page.
    expect(await page.locator('head title').count()).toBe(1);
    expect(await page.locator('head meta[name="description"]').count()).toBe(1);
    expect(await page.locator('head link[rel="canonical"]').count()).toBe(1);

    // No horizontal scrolling at any viewport.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'page is wider than the viewport').toBeLessThanOrEqual(1);

    // Let deferred work (hydration after first paint, idle callbacks) finish.
    await page.waitForTimeout(1200);
    expect(errors, errors.join('\n')).toEqual([]);
  });
}

test('self-hosted fonts load', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const families = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''));
  });
  expect(families).toContain('Manrope');
  expect(families).toContain('Fraunces');
});

test('structured data is present and valid JSON', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.length).toBeGreaterThan(0);
  for (const b of blocks) expect(() => JSON.parse(b)).not.toThrow();
});

test('primary navigation works', async ({ page, isMobile }) => {
  const errors = collectErrors(page);
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800); // hydration runs after first paint

  if (isMobile) {
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const drawer = page.getByRole('dialog', { name: 'Mobile navigation' });
    await expect(drawer).toBeVisible();
    await drawer.getByRole('link', { name: 'Proof', exact: true }).click();
  } else {
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Proof', exact: true }).click();
  }
  await expect(page).toHaveURL(/\/proof$/);
  await expect(page.locator('h1').first()).toBeVisible();
  expect(errors, errors.join('\n')).toEqual([]);
});

test('theme toggle switches to light and persists', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: /theme|light|dark/i }).first().click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
