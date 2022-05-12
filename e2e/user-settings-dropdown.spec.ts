import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto('/welcome', { waitUntil: 'networkidle' }); // TODO: Our redirects flicker the original URL before going to welcome which confuses the tests. Needs fixing on the router level
  (await page.locator('button:has-text("Connect Keplr")')).click();
  (await page.locator('button:has-text("Agree")')).click();
});

test.describe('Navbar elements location and availibility', function () {
  test('user settings dropdown - Navbar element', async ({ page }) => {
    const navbar = await page.locator("header[role='navigation']");
    const userDropdown = await navbar.locator("[class *= 'settings-wrapper']");
    await userDropdown.click();
    const userDropdownExpanded = await page.locator('.settings-modal');
    await expect(userDropdownExpanded).toBeVisible();
    const support = await userDropdownExpanded.locator('a:has-text("Support")');
    await expect(support).toBeVisible();
    await expect(support).toHaveAttribute('href', 'https://support.emeris.com');

    const twitter = await userDropdownExpanded.locator('a:has-text("Twitter")');
    await expect(twitter).toBeVisible();
    await expect(twitter).toHaveAttribute('href', 'https://twitter.com/emerisHQ');

    const emerisCom = await userDropdownExpanded.locator('a:has-text("emeris.com")');
    await expect(emerisCom).toBeVisible();
    await expect(emerisCom).toHaveAttribute('href', 'https://emeris.com');

    const version = await userDropdownExpanded.locator('text=Version');
    await expect(version).toBeVisible();
  });

  test('disconnect Keplr wallet', async ({ page }) => {
    const navbar = await page.locator("header[role='navigation']");
    const userDropdown = await navbar.locator("[class *= 'settings-wrapper']");
    await userDropdown.click();
    const userDropdownExpanded = await page.locator('.settings-modal');
    await userDropdownExpanded.locator('text=Disconnect wallet').click();
    await expect(userDropdown).toContainText('Demo Account');
  });
});
