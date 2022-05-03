import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, baseURL }) => {
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/welcome'); // TODO: Our redirects flicker the original URL before going to welcome which confuses the tests. Needs fixing on the router level
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
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
