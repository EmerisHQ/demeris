import { chromium, test as base, webkit } from '@playwright/test';

export const test = base.extend({
  // eslint-disable-next-line max-lines-per-function
  context: async ({ browserName }, use) => {
    const browserTypes = { chromium, webkit };
    const launchOptions = {
      args: [`--no-sandbox`, `--disable-setuid-sandbox`],
    };
    const context = await browserTypes[browserName].launchPersistentContext('', launchOptions);
    await context.addInitScript({
      content: `
        // window.localStorage.setItem('isWarningAgreed', true) // HACK replace asap
        window.chrome = true;
        window.keplr = {
          enable() {
            return Promise.resolve(true)
          },
          getKey() {
            const key = {
              name: 'Test',
              algo: "secp256k1",
              pubKey: Uint8Array.from(
                Object.values({
                  0: 2,
                  1: 77,
                  2: 180,
                  3: 175,
                  4: 102,
                  5: 96,
                  6: 147,
                  7: 15,
                  8: 125,
                  9: 36,
                  10: 66,
                  11: 27,
                  12: 170,
                  13: 241,
                  14: 145,
                  15: 113,
                  16: 240,
                  17: 79,
                  18: 214,
                  19: 162,
                  20: 196,
                  21: 166,
                  22: 243,
                  23: 33,
                  24: 20,
                  25: 42,
                  26: 134,
                  27: 65,
                  28: 134,
                  29: 97,
                  30: 181,
                  31: 54,
                  32: 124,
                }),
              ),
              bech32Address: "cosmos14y53meat0ehx2k0c38knym9zczzezedryndanj",
              isNanoLedger: false,
            }
            return key
          },
          getOfflineSigner() {
            return Promise.resolve({})
          },
          experimentalSuggestChain() {
            return Promise.resolve(true)
          }
        }
        window.getOfflineSigner = () => ({
        })
    `,
    });
    await use(context);
    await context.close();
  },
});
