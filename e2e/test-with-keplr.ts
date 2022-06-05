import { chromium, test as base, webkit } from '@playwright/test';

export const test = base.extend({
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
              pubKey: Uint8Array.from(Object.values({
                "0": 2,
                "1": 24,
                "2": 5,
                "3": 62,
                "4": 169,
                "5": 84,
                "6": 217,
                "7": 6,
                "8": 217,
                "9": 95,
                "10": 151,
                "11": 213,
                "12": 151,
                "13": 112,
                "14": 204,
                "15": 68,
                "16": 140,
                "17": 196,
                "18": 33,
                "19": 121,
                "20": 13,
                "21": 128,
                "22": 228,
                "23": 32,
                "24": 107,
                "25": 7,
                "26": 46,
                "27": 181,
                "28": 171,
                "29": 84,
                "30": 230,
                "31": 165,
                "32": 248
            })),
              bech32Address: "cosmos1n97vrj8t342jk5hn9ng0dyz352x94dt98x48ux",
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
