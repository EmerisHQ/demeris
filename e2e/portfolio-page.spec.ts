import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, baseURL }) => {
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/welcome'); // TODO: Our redirects flicker the original URL before going to welcome which confuses the tests. Needs fixing on the router level
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
  const navbar = await page.locator("header[role='navigation']");

  (await navbar.locator('text=Portfolio')).click();
  await expect(page).toHaveURL(baseURL + '/');
});
test.describe('Portfolio visual check', function () {
  test('visibility of elements', async ({ page, baseURL }) => {
    const totalBalance = await page.locator('text=Total balance');
    await expect(totalBalance).toBeVisible();
    const totalBalanceValue = await page.locator('*[class="total-price"]');
    await expect(totalBalanceValue).toHaveText(/\$/);

    const assets = await page.locator('h2', { hasText: 'Assets' });
    await expect(assets).toBeVisible();
    const pools = await page.locator('h2', { hasText: 'Pools' });
    await expect(pools).toBeVisible();
    const atomRow = await page.locator('table').locator('tr', { hasText: 'ATOM' });
    await expect(atomRow).toBeVisible();
    const emptyPools = await page.locator('text=Pools you add liquidity to will appear here.');
    await expect(emptyPools).toBeVisible();
    const poolsBtn = await page.locator('button:has-text("Explore pools")');
    await expect(poolsBtn).toBeVisible();
    await poolsBtn.click();
    await expect(page).toHaveURL(baseURL + '/pools');
  });
});
