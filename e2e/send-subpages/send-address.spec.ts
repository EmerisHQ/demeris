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

test.describe('Check availability of send/address subpage elements', function () {
  const recipientAddress = 'cosmos1ws4ae7ysl496j4e4pkg0yazpkf6nyrak3ptwpt';

  test('fill in form Recipient form', async ({ page, baseURL }) => {
    await expect(page).toHaveURL(baseURL + '/send');
    const sendToAddressBtn = await page
      .locator('div[class="mt-8 pb-8 flex space-x-8"]')
      .locator('text=Send to address');

    await sendToAddressBtn.click();
    await expect(page).toHaveURL(baseURL + '/send/address');
    const recipientHeader = await page.locator('h2').locator('text=Enter an address');
    await expect(recipientHeader).toBeVisible();

    const recipientAddressField = await page.locator('textarea[placeholder="Recipient address"]');
    await expect(recipientAddressField).toBeVisible();
    await recipientAddressField.fill(recipientAddress);

    const memoField = await page.locator('input[placeholder="Add reference (memo)"]');
    await expect(memoField).toBeVisible();
    await memoField.fill('test memo');

    const checkbox = await page.locator('input[type="checkbox"]');
    const continueBtn = await page.locator('button:has-text("Continue")');
    await expect(checkbox).toBeChecked({ checked: false });
    await expect(continueBtn).toBeDisabled();
    await checkbox.check();
    await expect(continueBtn).toBeEnabled();
  });

  test('fill in form Amount form with Slow fee', async ({ page, baseURL }) => {
    await expect(page).toHaveURL(baseURL + '/send');
    const sendToAddressBtn = await page
      .locator('div[class="mt-8 pb-8 flex space-x-8"]')
      .locator('text=Send to address');

    await sendToAddressBtn.click();
    await expect(page).toHaveURL(baseURL + '/send/address');
    const recipientHeader = await page.locator('h2').locator('text=Enter an address');
    await expect(recipientHeader).toBeVisible();

    const recipientAddressField = await page.locator('textarea[placeholder="Recipient address"]');
    await expect(recipientAddressField).toBeVisible();
    await recipientAddressField.fill(recipientAddress);

    const memoField = await page.locator('input[placeholder="Add reference (memo)"]');
    await expect(memoField).toBeVisible();
    await memoField.fill('test memo');

    const checkbox = await page.locator('input[type="checkbox"]');
    const continueBtn = await page.locator('button:has-text("Continue")');
    await expect(checkbox).toBeChecked({ checked: false });
    await expect(continueBtn).toBeDisabled();
    await checkbox.check();
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    const amountHeader = await page.locator('h2').locator('text=Enter an amount');
    await expect(amountHeader).toBeVisible();
    const nextContinueBtn = await page.locator('button:has-text("Continue")');
    await expect(nextContinueBtn).toBeDisabled();
    const inputAmountOfAssets = await page
      .locator(
        'label[class="flexible-input relative flex items-center justify-center mx-auto w-full cursor-text text-inactive hover:text-muted uppercase"]',
      )
      .locator('input[placeholder="0"]');
    await inputAmountOfAssets.fill('0.000001');
    await expect(nextContinueBtn).toBeEnabled();
    await page.locator('text=Fees (included)').click();
    const slowBtn = page.locator('button:has-text("Slow")');
    await expect(slowBtn).toBeVisible();
    await slowBtn.click();
    await nextContinueBtn.click();
  });

  test('check Review form', async ({ page, baseURL }) => {
    await expect(page).toHaveURL(baseURL + '/send');
    const sendToAddressBtn = await page
      .locator('div[class="mt-8 pb-8 flex space-x-8"]')
      .locator('text=Send to address');

    await sendToAddressBtn.click();
    await expect(page).toHaveURL(baseURL + '/send/address');
    const recipientHeader = await page.locator('h2').locator('text=Enter an address');
    await expect(recipientHeader).toBeVisible();

    const recipientAddressField = await page.locator('textarea[placeholder="Recipient address"]');
    await expect(recipientAddressField).toBeVisible();
    await recipientAddressField.fill(recipientAddress);

    const memoField = await page.locator('input[placeholder="Add reference (memo)"]');
    await expect(memoField).toBeVisible();
    await memoField.fill('test memo');

    const checkbox = await page.locator('input[type="checkbox"]');
    const continueBtn = await page.locator('button:has-text("Continue")');
    await expect(checkbox).toBeChecked({ checked: false });
    await expect(continueBtn).toBeDisabled();
    await checkbox.check();
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    const amountHeader = await page.locator('h2').locator('text=Enter an amount');
    await expect(amountHeader).toBeVisible();
    const nextContinueBtn = await page.locator('button:has-text("Continue")');
    await expect(nextContinueBtn).toBeDisabled();
    const inputAmountOfAssets = await page
      .locator(
        'label[class="flexible-input relative flex items-center justify-center mx-auto w-full cursor-text text-inactive hover:text-muted uppercase"]',
      )
      .locator('input[placeholder="0"]');
    await inputAmountOfAssets.fill('0.000001');
    await expect(nextContinueBtn).toBeEnabled();
    await page.locator('text=Fees (included)').click();
    const slowBtn = page.locator('button:has-text("Slow")');
    await expect(slowBtn).toBeVisible();
    await slowBtn.click();
    await nextContinueBtn.click();
    const reviewHeader = await page.locator('h1:has-text("Review your transfer details")');
    await expect(reviewHeader).toBeVisible();
    const confirmAndContinueButton = await page.locator('button:has-text("Confirm and continue")');
    await expect(confirmAndContinueButton).toBeVisible();
    await expect(confirmAndContinueButton).toBeEnabled();
  });
});
