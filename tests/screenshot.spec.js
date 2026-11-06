import { test, expect } from '@playwright/test';
import fs from 'node:fs';

test('renders the gear and saves a screenshot', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.goto('/');
  // Wait until the animation loop has actually drawn several frames.
  await page.waitForFunction(() => window.__frames > 10, null, { timeout: 30_000 });

  fs.mkdirSync('screenshots', { recursive: true });
  await page.screenshot({ path: 'screenshots/gear.png' });

  expect(errors).toEqual([]);
});
