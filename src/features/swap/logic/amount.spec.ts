import { calculateSlippage } from './amount';

it('should return correct slippage calculations', () => {
  expect([calculateSlippage('410337', 0.1), calculateSlippage('410337', 0.5), calculateSlippage('410337', 1)])
    .toMatchInlineSnapshot(`
      [
        "409926.663",
        "408285.315",
        "406233.63",
      ]
    `);
});
