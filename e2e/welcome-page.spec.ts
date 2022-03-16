import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('domcontentloaded', () => {
    page.evaluate('window.Cypress=true; window.chrome=true;');
  });
  await page.goto('/welcome');
});

test.describe('Welcome page', () => {
  test('Should have Try Demo button', async ({ page }) => {
    const demoBtn = await page.locator('[data-cy=tryTheDemoButton]', { hasText: 'Try the demo' });
    await page.screenshot({ path: 'screenshot.png' });
    await expect(demoBtn).toBeVisible();
  });
});
