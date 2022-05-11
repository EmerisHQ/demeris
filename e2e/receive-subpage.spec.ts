import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, baseURL }) => {
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/welcome', { waitUntil: 'networkidle' }); // TODO: Our redirects flicker the original URL before going to welcome which confuses the tests. Needs fixing on the router level
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
  const navbar = await page.locator("header[role='navigation']");

  (await navbar.locator('a[href="/receive"]')).click();
  await expect(page).toHaveURL(baseURL + '/receive');
});
test.describe('Receive elements and search', function () {
  test('ATOM search and no assets', async ({ page, baseURL }) => {
    const searchField = await page.locator('div[class="suffix relative flex cursor-text"]').locator('input');
    await searchField.fill('ATOM');
    const teble = await page.locator('div[class="mx-auto max-w-md mb-20"]');
    expect(teble).toContainText('ATOM');
    expect(teble).toContainText('Cosmos Hub');
    await searchField.fill('');
    await searchField.fill('test');
    expect(teble).toBeEmpty();

    await page.locator('div[class="inline-flex"]').locator('button').click();
    await expect(page).toHaveURL(baseURL + '/');
  });
});
