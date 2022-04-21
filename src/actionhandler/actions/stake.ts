/* eslint-disable @typescript-eslint/naming-convention */
import { AbstractAmount } from '@emeris/types/lib/EmerisTransactions';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { ActionStepResult } from '@/types/actions';
import { useStore } from '@/utils/useStore';

export async function stake({ validatorAddress, amount }: { validatorAddress: string; amount: AbstractAmount }) {
  const typedstore = useStore() as RootStoreTyped;
  const result: ActionStepResult = {
    steps: [],
    output: {
      denom: '',
      amount: '0',
      chain_name: '',
    },
  };
  const verifiedDenoms = typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms];
  const verified = verifiedDenoms.find((x) => x.name == amount.denom && x.stakable == true);
  if (!verified) {
    throw new Error('Token is not stakable');
  }
  const chain_name = verified.chain_name;
  result.steps.push({
    type: 'stake',
    status: 'pending',
    data: [
      {
        validatorAddress,
        amount,
        chainName: chain_name,
      },
    ],
  });
  return result;
}
