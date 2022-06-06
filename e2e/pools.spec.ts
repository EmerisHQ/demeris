import { expect } from '@playwright/test';

import { loginToKeplr } from './login-to-keplr';
import { test } from './test-with-keplr';

test.beforeEach(async ({ page, baseURL }) => {
  await loginToKeplr(page, '/');
  const navbar = await page.locator("header[role='navigation']");

  (await navbar.locator('text=Pools')).click();
  await expect(page).toHaveURL(baseURL + '/pools');
});

test.describe('Pools location and availibility', function () {
  test('Pool search field', async ({ page }) => {
    const searchField = await page.locator("input[placeholder = 'Search assets and pools']");
    await searchField.click();
    await page.fill("input[placeholder = 'Search assets and pools']", 'test');
    await expect(searchField).toHaveValue('test');
  });

  // test('Add liquidity button usage', async ({ page, baseURL }) => {
  //   const addLiquidityButton = await page.locator('.add-liquidity', { hasText: 'Add liquidity' });
  //   await addLiquidityButton.click();
  //   await expect(page).toHaveURL(baseURL + '/pools/add');
  // });
});
