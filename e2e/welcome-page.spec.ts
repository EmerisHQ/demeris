import { expect } from '@playwright/test';

import { test } from './test-with-keplr';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.goto('/welcome', { waitUntil: 'networkidle' });
});

test.describe('Welcome page elements location and availibility', () => {
  test('Connect Keplr button', async ({ page }) => {
    const keplrBtn = await page.locator('button:has-text("Connect Keplr")');
    await expect(keplrBtn).toBeVisible();
  });
  test('Try the Demo button', async ({ page }) => {
    const demoBtn = await page.locator('[data-cy=tryTheDemoButtonConnect]', { hasText: 'Try the demo' });
    await expect(demoBtn).toBeVisible();
  });
});
