import { test } from '../test-with-keplr';

test.beforeEach(async ({ page }) => {
  await page.goto('/welcome');
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
});

test.describe('Check Staking functionality', function () {
  test('time to unstake is a number', async ({ page, baseURL }) => {
    await page.locator('text=View all').first().click(),
      await page.locator('text=Osmosis').first().click(),
      await page.waitForNavigation({ url: `${baseURL}/asset/uosmo` }),
      // Click [data-test="openMenuButton"] button
      await page.locator('[data-test="openMenuButton"] button').first().click();
    // Click button:has-text("Unstake")
    await Promise.all([
      page.waitForNavigation({
        url: `${baseURL}/staking/uosmo/unstake/osmovaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep88n0y4`,
      }),
      page.locator('button:has-text("Unstake")').click(),
    ]);
    // Click text=14 days
    await page.locator('text=14 days').click();
    // Click [placeholder="\30 "]
    await page.locator('[placeholder="\\30 "]').click();
    // Fill [placeholder="\30 "]
    await page.locator('[placeholder="\\30 "]').fill('0.000001');
    // Click button:has-text("Continue")
    await page.locator('button:has-text("Continue")').click();
    // Click text=14 days
    await page.locator('text=14 days').click();
  });
});
