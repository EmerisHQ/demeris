// import axios from 'axios';
// import { computed, ref, watch } from 'vue';

//TODO : add type for validator list
type ValidatorStatus = 1 | 2 | 3;

import { useAllStores } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { Chains } from '@/types/api';

export default function useStaking() {
  const store = useAllStores();
  const chains: Chains = store.getters['demeris/getChains'];

  const getValidatorsByBaseDenom = async (base_denom: string, status: ValidatorStatus[] = [3]) => {
    //TODO: have our own curated DB for validators
    const chain_name = Object.values(chains).find((chain) => {
      return chain.denoms.find((denom) => denom.name === base_denom);
    }).chain_name;
    const rawValidators = await store.dispatch(GlobalDemerisActionTypes.GET_VALIDATORS, { chain_name });

    const reducer = (accumulator, validator) => {
      if (status.includes(validator.status)) {
        // TEST: Get info from keybase
        // validator.keybaseData = null;
        // try {
        //   const keybaseData = await axios.get(
        //     `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${validator.identity}`,
        //   );
        //   validator.keybaseData = keybaseData.data?.them?.[0];

        // } catch {
        //   //
        // }

        //TODO: implement staking balance at here
        accumulator.push(validator);
      }
      return accumulator;
    };

    const curatedValidatorList = await Promise.all(rawValidators.reduce(reducer, []));
    return [...curatedValidatorList];
  };

  return { getValidatorsByBaseDenom };
}
