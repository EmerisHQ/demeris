import { expect } from '@playwright/test';

import { loginToKeplr } from './login-to-keplr';
import { test } from './test-with-keplr';

test.beforeEach(async ({ page }) => {
  await loginToKeplr(page, '/');
  const navbar = await page.locator("header[role='navigation']");

  (await navbar.locator('a[href="/send"]')).click();
});
test.describe('Send elements location and availibility', function () {
  test('Send Page', async ({ page, baseURL }) => {
    await expect(page).toHaveURL(baseURL + '/send');
    const sendToAddressBtn = await page
      .locator('div[class="mt-8 pb-8 flex space-x-8"]')
      .locator('text=Send to address');

    const moveBtn = await page.locator('div[class="mt-8 pb-8 flex space-x-8"]').locator('h4:has-text("Move assets")');

    await sendToAddressBtn.click();
    await expect(page).toHaveURL(baseURL + '/send/address');

    await page.locator('div[class="inline-flex"]').locator('button').click();
    await expect(page).toHaveURL(baseURL + '/send');

    await moveBtn.click();
    await expect(page).toHaveURL(baseURL + '/send/move');

    await page.locator('div[class="inline-flex ml-auto"]').locator('button').click();
    await expect(page).toHaveURL(baseURL + '/');
  });
});
