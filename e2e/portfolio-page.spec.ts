import { expect, test } from '@playwright/test';

// import mockHandler from './mock-api';

test.beforeEach(async ({ page, baseURL }) => {
  /**
   * This test shouldn't be using any mocked data. It's a regression
   * Also see: https://github.com/EmerisHQ/demeris/pull/1530
   */
  // page.route('https://api.emeris.com/**/*', mockHandler);
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/welcome', { waitUntil: 'networkidle' }); // TODO: Our redirects flicker the original URL before going to welcome which confuses the tests. Needs fixing on the router level
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
  const navbar = await page.locator("header[role='navigation']");

  (await navbar.locator('text=Portfolio')).click();
  await expect(page).toHaveURL(baseURL + '/');
});
test.describe('Portfolio visual check', function () {
  test('visibility of elements', async ({ page }) => {
    const totalBalance = await page.locator('text=Total balance');
    await expect(totalBalance).toBeVisible();
    const totalBalanceValue = await page.locator('*[class="total-price"]');
    await expect(totalBalanceValue).toHaveText(/\$/);

    const pools = await page.locator('h2', { hasText: 'Pools' });
    await expect(pools).toBeVisible();
    const atomRow = await page.locator('table.assets-table').locator('tr', { hasText: 'ATOM' });
    await expect(atomRow).toBeVisible();

    /**
     * Below commented out code was using mocked data.
     * https://github.com/EmerisHQ/demeris/pull/1530
     */

    // const dvpnPool = await page.locator('text=ATOM · DVPN');
    // await expect(dvpnPool).toBeVisible();
    // const irisPool = await page.locator('text=ATOM · IRIS');
    // await expect(irisPool).toBeVisible();
    // const osmoPool = await page.locator('text=ATOM · OSMO');
    // await expect(osmoPool).toBeVisible();
    // const irisDvpnPool = await page.locator('text=DVPN · IRIS');
    // await expect(irisDvpnPool).toBeVisible();
    // await irisDvpnPool.click();
    // await expect(page).toHaveURL(baseURL + '/pool/3');
  });
});
