import { expect } from '@playwright/test';

import { loginToKeplr } from './login-to-keplr';
import { test } from './test-with-keplr';

test.beforeEach(async ({ page }) => {
  await loginToKeplr(page, '/assets');
});

test.describe('Check availability of Assets page elements', () => {
  test('go to Assets page', async ({ page }) => {
    const atomRow = await page.locator('tr', { hasText: 'ATOM' });
    await expect(atomRow).toBeVisible();
    // const aktRow = await page.locator('tr', { hasText: 'AKT' });
    // await expect(aktRow).toBeVisible();
    const persistenceRow = await page.locator('tr', { hasText: 'Persistence' });
    await expect(persistenceRow).toBeVisible();
  });
});
