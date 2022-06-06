export const loginToKeplr = async (page, goToUrl) => {
  await page.goto(goToUrl);
  await page.locator('button:has-text("Connect Keplr")').click();
  // Click button:has-text("Agree")
  await page.locator('button:has-text("Agree")').click();
};
