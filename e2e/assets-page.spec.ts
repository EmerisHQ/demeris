import { expect, test } from '@playwright/test';

import mockHandler from './mock-api';

test.beforeEach(async ({ page }) => {
  page.route('https://api.emeris.com/**/*', mockHandler);
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/assets');
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
});

test.describe('Check availability of Assets page elements', () => {
  test('go to Assets page', async ({ page }) => {
    const atomRow = await page.locator('tr', { hasText: 'ATOM' });
    await expect(atomRow).toBeVisible();
    const aktRow = await page.locator('tr', { hasText: 'AKT' });
    await expect(aktRow).toBeVisible();
  });
});
