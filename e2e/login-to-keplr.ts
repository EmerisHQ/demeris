export const loginToKeplr = async (page, goToUrl) => {
  // Go to http://localhost:8080/welcome
  await page.goto('/');
  await page.on('domcontentloaded', async () => {
    await page.evaluate('window.Cypress=true; window.chrome=true; window.keplr={}');
  });
  await page.goto(goToUrl, { waitUntil: 'networkidle' });
  // Click text=Install Keplr Try the demo >> a
  await page.locator('[data-cy=tryTheDemoButtonConnect]', { hasText: 'Try the demo' }).click();
  // Click button:has-text("Connect wallet")
  await page.locator('button:has-text("Connect wallet")').click();
  // Click button:has-text("Agree")
  await page.locator('button:has-text("Agree")').click();
};
