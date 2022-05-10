import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/welcome', { waitUntil: 'networkidle' }); // TODO: Our redirects flicker the original URL before going to welcome which confuses the tests. Needs fixing on the router level
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
  const navbar = await page.locator("header[role='navigation']");

  (await navbar.locator('a[href="/send"]')).click();
});

test.describe('Check availability of send/move subpage elements', function () {
  test('fill in form amount form', async ({ page, baseURL }) => {
    await expect(page).toHaveURL(baseURL + '/send');

    const moveBtn = await page.locator('div[class="mt-8 pb-8 flex space-x-8"]').locator('h4:has-text("Move assets")');
    await moveBtn.click();
    await expect(page).toHaveURL(baseURL + '/send/move');
    const header = await page.locator('h2:has-text("Move assets")');
    await expect(header).toBeVisible();
    const continueBtn = await page.locator('button:has-text("Continue")');
    await expect(continueBtn).toBeDisabled();
    const inputAmountOfAssets = await page.locator('.uppercase > .flex-1 > .flex > .flexible-input__input');
    await expect(inputAmountOfAssets).toBeVisible();
    await inputAmountOfAssets.fill('0.000001');
    await expect(continueBtn).toBeEnabled();
  });
});
