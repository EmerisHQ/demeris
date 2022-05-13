import { expect, test } from '@playwright/test';

import { loginToKeplr } from '../login-to-keplr';

test.beforeEach(async ({ page }) => {
  await loginToKeplr(page, '/');
  await expect(page).toHaveURL('http://localhost:8080/');
});
test.describe('Swap transaction states', function () {
  test('below min amount', async ({ page }) => {
    await expect(page).toHaveURL('http://localhost:8080/');
    // Click button:has-text("ATOMCosmos Hub")
    await page.locator('button:has-text("ATOMCosmos Hub")').click();
    // Fill [placeholder="Search"]
    await page.locator('[placeholder="Search"]').fill('atom');
    await page.locator('p.font-medium').click();
    // Click button[role="menuitem"]:has-text("Cosmos Hub0.955191 ATOM")
    await page.locator('button[role="menuitem"]:has-text("Cosmos Hub")').click();
    // Click button:has-text("Select asset")
    await page.locator('button:has-text("Select asset")').click();
    // Click button[role="menuitem"]:has-text("OSMOOsmosis")
    await page.locator('button[role="menuitem"]:has-text("OSMOOsmosis")').click();
    // Click text=ATOMCosmos Hub- >> [placeholder="\30 "]
    await page.locator('text=ATOMCosmos Hub- >> [placeholder="\\30 "]').click();
    // Fill text=ATOMCosmos Hub- >> [placeholder="\30 "]
    await page.locator('text=ATOMCosmos Hub- >> [placeholder="\\30 "]').fill('0.000001');
    await expect(page.locator('button:has-text("Below Min. Amount")'));
  });

  //   test('above max amount', async ({ page }) => {
  //     const totalBalance = await page.locator('text=Total balance');
  //     await expect(totalBalance).toBeVisible();
  //     const totalBalanceValue = await page.locator('*[class="total-price"]');
  //     await expect(totalBalanceValue).toHaveText(/\$/);

  //     const pools = await page.locator('h2', { hasText: 'Pools' });
  //     await expect(pools).toBeVisible();
  //     const atomRow = await page.locator('table.assets-table').locator('tr', { hasText: 'ATOM' });
  //     await expect(atomRow).toBeVisible();

  //   });

  //   test('clicking max button', async ({ page }) => {
  // Click button:has-text("Select asset")
  //  await page.locator('button:has-text("Select asset")').click();
  //  // Click button[role="menuitem"]:has-text("OSMOOsmosis")
  //  await page.locator('button[role="menuitem"]:has-text("OSMOOsmosis")').click();
  //  // Click text=Max 0.955191 ATOM
  //  await page.locator('text=Max 0.955191 ATOM').click();
  //  // Click button:has-text("Swap")
  //  await page.locator('button:has-text("Swap")').click();

  //   });
});
