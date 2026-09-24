import { defineConfig, devices } from '@playwright/test';

// Same checks as playwright.prod.config.ts, but against the live site (real
// Worker, headers, CSP and CDN). Run after a deploy: npm run test:live
// Serial on purpose: parallel browsers on the live network crash in small containers.
const launch = { args: ['--disable-dev-shm-usage'] };

export default defineConfig({
  testDir: './e2e',
  testMatch: /cross-browser\.spec\.ts/,
  workers: 1,
  retries: 1,
  reporter: [['list']],
  use: { baseURL: process.env.LIVE_URL || 'https://www.trivianedge.com' },
  projects: [
    { name: 'Chrome', use: { ...devices['Desktop Chrome'], launchOptions: launch } },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'Safari', use: { ...devices['Desktop Safari'] } },
    { name: 'iPhone Safari', use: { ...devices['iPhone 13'] } },
    { name: 'Android Chrome', use: { ...devices['Pixel 7'], launchOptions: launch } },
  ],
});
