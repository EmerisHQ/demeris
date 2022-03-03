import { Amount } from '@/types/base';

export async function createPool({ coinA, coinB }: { coinA: Amount; coinB: Amount }) {
  const result = {
    steps: [],
    output: {
      amount: {
        denom: '',
        amount: 0,
      },
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
