import { AbstractAmount } from '@emeris/types/lib/EmerisTransactions';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { ActionStepResult } from '@/types/actions';
import { useStore } from '@/utils/useStore';

export async function createPool({ coinA, coinB }: { coinA: AbstractAmount; coinB: AbstractAmount }) {
  const store = useStore();
  const typedstore = store as RootStoreTyped;
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
      chainName: typedstore.getters[GlobalGetterTypes.API.getDexChain],
    },
  });
  return result;
}
