import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';
import { Amount } from '@/types/base';
import { useStore } from '@/utils/useStore';

export async function stake({ validatorAddress, amount }: { validatorAddress: string; amount: Amount }) {
  const apistore = useStore() as TypedAPIStore;
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
  const verifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];
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
