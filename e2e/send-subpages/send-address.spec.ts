import { expect } from '@playwright/test';

import { loginToKeplr } from '../login-to-keplr';
import { test } from '../test-with-keplr';

test.beforeEach(async ({ page }) => {
  await loginToKeplr(page, '/');
});

// eslint-disable-next-line max-lines-per-function
test.describe('Check availability of send/address subpage elements', function () {
  const recipientAddress = 'cosmos1ws4ae7ysl496j4e4pkg0yazpkf6nyrak3ptwpt';

  test('fill in form Recipient form', async ({ page, baseURL }) => {
    const navbar = page.locator("header[role='navigation']");
    navbar.locator('a[href="/send"]').click();

    await expect(page).toHaveURL(baseURL + '/send');
    const sendToAddressBtn = page.locator('div[class="mt-8 pb-8 flex space-x-8"]').locator('text=Send to address');

    await sendToAddressBtn.click();
    await expect(page).toHaveURL(baseURL + '/send/address');
    const recipientHeader = page.locator('h2').locator('text=Enter an address');
    await expect(recipientHeader).toBeVisible();

    const recipientAddressField = page.locator('textarea[placeholder="Recipient address"]');
    await expect(recipientAddressField).toBeVisible();
    await recipientAddressField.fill(recipientAddress);

    const memoField = page.locator('input[placeholder="Add reference (memo)"]');
    await expect(memoField).toBeVisible();
    await memoField.fill('test memo');

    const checkbox = page.locator('input[type="checkbox"]');
    const continueBtn = page.locator('button:has-text("Continue")');
    await expect(checkbox).toBeChecked({ checked: false });
    await expect(continueBtn).toBeDisabled();
    await checkbox.check();
    await expect(continueBtn).toBeEnabled();
  });

  test('fill in form Amount form with Slow fee', async ({ page, baseURL }) => {
    const atomRow = await page.locator('table.assets-table').locator('tr', { hasText: 'ATOM' });
    await expect(atomRow).toBeVisible();

    const navbar = page.locator("header[role='navigation']");
    navbar.locator('a[href="/send"]').click();

    await expect(page).toHaveURL(baseURL + '/send');
    const sendToAddressBtn = page.locator('div[class="mt-8 pb-8 flex space-x-8"]').locator('text=Send to address');

    await sendToAddressBtn.click();
    await expect(page).toHaveURL(baseURL + '/send/address');
    const recipientHeader = page.locator('h2').locator('text=Enter an address');
    await expect(recipientHeader).toBeVisible();

    const recipientAddressField = page.locator('textarea[placeholder="Recipient address"]');
    await expect(recipientAddressField).toBeVisible();
    await recipientAddressField.fill(recipientAddress);

    const memoField = page.locator('input[placeholder="Add reference (memo)"]');
    await expect(memoField).toBeVisible();
    await memoField.fill('test memo');

    const checkbox = page.locator('input[type="checkbox"]');
    const continueBtn = page.locator('button:has-text("Continue")');
    await expect(checkbox).toBeChecked({ checked: false });
    await expect(continueBtn).toBeDisabled();
    await checkbox.check();
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    //change sendToken to ATOM
    await page
      .locator(
        'button[class="bg-surface shadow-button rounded-xl overflow-hidden py-4 pl-5 pr-3 flex justify-between w-full max-w-md mx-auto outline-none text-left group focus:outline-none active:opacity-70 active:transform-none transform hover:-translate-y-px focus:-translate-y-px transition"]',
      )
      .click();
    await page.locator('[placeholder="Search assets"]').click();
    await page.locator('[placeholder="Search assets"]').fill('ATOM');
    await page.locator('.flex.items-center.justify-between.py-4').click();

    const amountHeader = page.locator('h2').locator('text=Enter an amount');
    await expect(amountHeader).toBeVisible();
    const nextContinueBtn = page.locator('button:has-text("Continue")');
    await expect(nextContinueBtn).toBeDisabled();
    const inputAmountOfAssets = page
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

  // eslint-disable-next-line max-lines-per-function
  test('check Review form', async ({ page, baseURL }) => {
    const atomRow = page.locator('table.assets-table').locator('tr', { hasText: 'ATOM' });
    await expect(atomRow).toBeVisible();

    const navbar = page.locator("header[role='navigation']");
    navbar.locator('a[href="/send"]').click();

    await expect(page).toHaveURL(baseURL + '/send');
    const sendToAddressBtn = page.locator('div[class="mt-8 pb-8 flex space-x-8"]').locator('text=Send to address');

    await sendToAddressBtn.click();
    await expect(page).toHaveURL(baseURL + '/send/address');
    const recipientHeader = page.locator('h2').locator('text=Enter an address');
    await expect(recipientHeader).toBeVisible();

    const recipientAddressField = page.locator('textarea[placeholder="Recipient address"]');
    await expect(recipientAddressField).toBeVisible();
    await recipientAddressField.fill(recipientAddress);

    const memoField = page.locator('input[placeholder="Add reference (memo)"]');
    await expect(memoField).toBeVisible();
    await memoField.fill('test memo');

    const checkbox = page.locator('input[type="checkbox"]');
    const continueBtn = page.locator('button:has-text("Continue")');
    await expect(checkbox).toBeChecked({ checked: false });
    await expect(continueBtn).toBeDisabled();
    await checkbox.check();
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    //change sendToken to ATOM
    await page
      .locator(
        'button[class="bg-surface shadow-button rounded-xl overflow-hidden py-4 pl-5 pr-3 flex justify-between w-full max-w-md mx-auto outline-none text-left group focus:outline-none active:opacity-70 active:transform-none transform hover:-translate-y-px focus:-translate-y-px transition"]',
      )
      .click();
    await page.locator('[placeholder="Search assets"]').click();
    await page.locator('[placeholder="Search assets"]').fill('ATOM');
    await page.locator('.flex.items-center.justify-between.py-4').click();

    const amountHeader = page.locator('h2').locator('text=Enter an amount');
    await expect(amountHeader).toBeVisible();
    const nextContinueBtn = page.locator('button:has-text("Continue")');
    await expect(nextContinueBtn).toBeDisabled();
    const inputAmountOfAssets = page
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
    const reviewHeader = page.locator('h1:has-text("Review your transfer details")');
    await expect(reviewHeader).toBeVisible();
    const confirmAndContinueButton = page.locator('button:has-text("Confirm and continue")');
    await expect(confirmAndContinueButton).toBeVisible();
    await expect(confirmAndContinueButton).toBeEnabled();
  });
});
