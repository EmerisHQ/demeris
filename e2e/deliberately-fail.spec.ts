import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/');
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
});
test.describe('Check Spiderman', function () {
  test('get spiderman class', async ({ page }) => {
    const navbar = page.locator("header[role='navigation']");
    navbar.locator('a[href="/send"]').click();
    const spiderman = await page.locator('[class=spiderman]');
    await expect(spiderman).toBeVisible();
  });
});
