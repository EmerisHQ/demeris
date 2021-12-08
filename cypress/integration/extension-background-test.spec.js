const { chromium } = import('playwright');

describe('Check availability of Extension Background', function () {
  const urlForTestPack = Env.LOCAL;

  it('go to Assets page', function () {
    let assets = new Assets();

    cy.visit(urlForTestPack);

    runBrowserExtensionBackground();
  });
});

function runBrowserExtensionBackground() {
  (async () => {
    const pathToExtension = import('Keplr');
    const userDataDir = '/tmp/test-user-data-dir';
    const browserContext = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
    });
    const backgroundPage = browserContext.backgroundPages()[0];
    // Test the background page as you would any other page.
    // await browserContext.close();
  })();
}
