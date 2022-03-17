import { EmerisBase } from '@emeris/types';

export async function createPool({ coinA, coinB }: { coinA: EmerisBase.Amount; coinB: EmerisBase.Amount }) {
  const result = {
    steps: [],
    output: {
      denom: '',
      amount: 0,
      chain_name: '',
    },
  };
  result.steps.push({
    name: 'createpool',
    status: 'pending',
    data: {
      coinA,
      coinB,
    },
  });
  return result;
}
