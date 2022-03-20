import { EmerisBase } from '@emeris/types';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { useStore } from '@/utils/useStore';

export async function stake({ validatorAddress, amount }: { validatorAddress: string; amount: EmerisBase.Amount }) {
  const typedstore = useStore() as RootStoreTyped;
  const result = {
    steps: [],
    output: {
      denom: '',
      amount: 0,
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
    name: 'stake',
    status: 'pending',
    data: [
      {
        validatorAddress,
        amount,
        chain_name,
      },
    ],
  });
  return result;
}
