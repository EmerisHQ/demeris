import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/welcome');
});

test.describe('Welcome page', () => {
  test('Should have Try Demo button', async ({ page }) => {
    const demoBtn = await page.locator('[data-cy=tryTheDemoButton]', { hasText: 'Try the demo' });
    await expect(demoBtn).toBeVisible();
  });
});
