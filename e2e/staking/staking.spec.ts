import { expect } from '@playwright/test';

import { loginToKeplr } from '../login-to-keplr';
import { test } from '../test-with-keplr';

test.beforeEach(async ({ page }) => {
  await loginToKeplr(page, '/asset/uatom?VITE_FEATURE_STAKING=true');
});
test.describe('Check Staking functionality', function () {
  test('shows staked Atom', async ({ page }) => {
    const stakingTable = await page.locator('[data-cy=staking-table]');
    await expect(stakingTable).toBeVisible();
    const valRow = await stakingTable.locator('[data-cy=validator-row]');
    await expect(valRow.first()).toBeVisible();
  });

  test('allows to stake', async ({ page, baseURL }) => {
    const stakeBtn = await page.locator('[data-cy=stake-button]');
    await expect(stakeBtn).toBeVisible();
    await stakeBtn.click();
    await expect(page).toHaveURL(baseURL + '/staking/uatom/stake');
    await page.locator('[data-cy=validator-table-stake]').first().click();
    const stakeAmountField = await page.locator('[data-cy=denom-amount-input]');
    await stakeAmountField.fill('0.000001');
    const continueBtn = await page.locator('[data-cy=stake-continue-button]');
    await expect(continueBtn).toBeEnabled();
  });
});
