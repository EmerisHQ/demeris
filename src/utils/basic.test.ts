import 'regenerator-runtime/runtime';

import { parseCoins } from './basic';

test('should parse coins', () => {
  expect(parseCoins('100abcd')).toStrictEqual([{ amount: '100', denom: 'abcd' }]);
  // ibc
  expect(parseCoins('2ibc/3F1D3FCF4AE79E1554D670D1AD949A9BA4E4A3C76C63093E17E446A46061A7A2')).toStrictEqual([
    { amount: '2', denom: 'ibc/3F1D3FCF4AE79E1554D670D1AD949A9BA4E4A3C76C63093E17E446A46061A7A2' },
  ]);
  // with decimals
  expect(parseCoins('123.45678abcd')).toStrictEqual([{ amount: '123', denom: 'abcd' }]);
  expect(parseCoins('123.45678abcd,321.875dcba')).toStrictEqual([
    { amount: '123', denom: 'abcd' },
    { amount: '321', denom: 'dcba' },
  ]);
});
