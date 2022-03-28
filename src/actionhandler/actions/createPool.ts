import { AbstractAmount } from '@emeris/types/lib/EmerisTransactions';

import { ActionStepResult } from '@/types/actions';

export async function createPool({
  coinA,
  coinB,
  chainName,
}: {
  coinA: AbstractAmount;
  coinB: AbstractAmount;
  chainName: string;
}) {
  const result: ActionStepResult = {
    steps: [],
    output: {
      denom: '',
      amount: '0',
      chain_name: '',
    },
  };
  result.steps.push({
    type: 'createPool',
    status: 'pending',
    data: {
      coinA,
      coinB,
      chainName,
    },
  });
  return result;
}
