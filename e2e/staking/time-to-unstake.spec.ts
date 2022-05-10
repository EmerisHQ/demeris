import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/welcome', { waitUntil: 'networkidle' });
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
});

test.describe('Check Staking functionality', function () {
  test('time to unstake is a number', async ({ page }) => {
    // Click text=Osmosis >> nth=0
    await Promise.all([
      page.waitForNavigation(/*{ url: 'http://localhost:8080/asset/uosmo' }*/),
      page.locator('text=Osmosis').first().click(),
    ]);
    // Click [data-test="openMenuButton"] button
    await page.locator('[data-test="openMenuButton"] button').click();
    // Click button:has-text("Unstake")
    await Promise.all([
      page.waitForNavigation(/*{ url: 'http://localhost:8080/staking/uosmo/unstake/osmovaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4ep88n0y4' }*/),
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
