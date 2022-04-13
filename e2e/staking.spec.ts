import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/asset/uatom?VITE_FEATURE_STAKING=true'); // TODO: Our redirects flicker the original URL before going to welcome which confuses the tests. Needs fixing on the router level
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
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
