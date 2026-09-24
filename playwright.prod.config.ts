import { defineConfig, devices } from '@playwright/test';

// Cross-browser checks against the production build (npm run build first).
// Runs every engine a visitor might use: Chromium (Chrome/Edge/Opera/Samsung),
// Firefox, and WebKit (Safari on macOS and every browser on iOS).
export default defineConfig({
  testDir: './e2e',
  testMatch: /cross-browser\.spec\.ts/,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4176' },
  projects: [
    { name: 'Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Edge', use: { ...devices['Desktop Edge'] } },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'Safari', use: { ...devices['Desktop Safari'] } },
    { name: 'iPhone Safari', use: { ...devices['iPhone 13'] } },
    { name: 'Android Chrome', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: 'http://localhost:4176',
    reuseExistingServer: !process.env.CI,
  },
});
