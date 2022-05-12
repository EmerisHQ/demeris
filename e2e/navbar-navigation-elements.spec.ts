import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/');
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
});

test.describe('Navbar elements location and availibility', function () {
  test('Portfolio, Assets, Pools, Logo - Navbar elements', async ({ page, baseURL }) => {
    const navbar = await page.locator("header[role='navigation']");

    // go to Assets
    // check url /path
    (await navbar.locator('text=Assets')).click();
    await expect(page).toHaveURL(baseURL + '/assets');

    // go to Portwolio via Tab
    // check url /path
    (await navbar.locator('text=Portfolio')).click();
    await expect(page).toHaveURL(baseURL + '/');

    // go to Pools
    // check url /path

    (await navbar.locator('text=Pools')).click();
    await expect(page).toHaveURL(baseURL + '/pools');

    // go to Portfolio via logo
    // check url /path
    (await navbar.locator('[data-cy=navbar-logo]')).click();
    await expect(page).toHaveURL(baseURL + '/');
  });

  test('"Receive" navbar element', async ({ page, baseURL }) => {
    const navbar = await page.locator("header[role='navigation']");

    (await navbar.locator('a[href="/receive"]')).click();
    await expect(page).toHaveURL(baseURL + '/receive');
  });

  test('"Send" navbar element', async ({ page, baseURL }) => {
    const navbar = await page.locator("header[role='navigation']");

    (await navbar.locator('a[href="/send"]')).click();
    await expect(page).toHaveURL(baseURL + '/send');
  });
});
