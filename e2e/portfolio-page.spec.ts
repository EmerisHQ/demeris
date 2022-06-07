import { expect } from '@playwright/test';

import { loginToKeplr } from './login-to-keplr';
import { test } from './test-with-keplr';

test.beforeEach(async ({ page, baseURL }) => {
  await loginToKeplr(page, '/');
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
