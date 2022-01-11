// import axios from 'axios';
// import { computed, ref, watch } from 'vue';

//TODO : add type for validator list
type ValidatorStatus = 1 | 2 | 3;

import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes } from '@/store';
import { Chains } from '@/types/api';
import { keyHashfromAddress } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

export default function useStaking() {
  const store = useStore();
  const chains: Chains = store.getters[GlobalDemerisGetterTypes.API.getChains];

  const getValidatorsByBaseDenom = async (base_denom: string, status: ValidatorStatus[] = [3]) => {
    //TODO: have our own curated DB for validator list
    const chain_name = getChainNameByBaseDenom(base_denom);
    console.log(chain_name);
    const rawValidators = await store.dispatch(GlobalDemerisActionTypes.API.GET_VALIDATORS, { chain_name });
    console.log(rawValidators);
    const reducer = (accumulator, validator) => {
      if (status.includes(validator.status)) {
        // TEST: Get a validator data(profile pic url) from keybase
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

  const getChainDisplayInflationByBaseDenom = async (base_denom: string): Promise<number> => {
    const chain_name = getChainNameByBaseDenom(base_denom);
    const inflation = await store.dispatch(GlobalDemerisActionTypes.API.GET_INFLATION, { chain_name });
    return Math.trunc(inflation * 10000) / 100;
  };

  const getStakingRewardsByBaseDenom = async (base_denom: string): Promise<unknown> => {
    const chain_name = getChainNameByBaseDenom(base_denom);
    return await store.dispatch(GlobalDemerisActionTypes.API.GET_STAKING_REWARDS, { chain_name });
  };

  const getValidatorMoniker = (address: string, validator_list: any[]): string => {
    let moniker;
    validator_list.some((vali: any) => {
      if (keyHashfromAddress(vali.operator_address) === address || vali.operator_address === address) {
        moniker = vali.moniker;
        return true;
      } else {
        return false;
      }
    });
    return moniker;
  };

  //helpers
  function getChainNameByBaseDenom(base_denom: string): string {
    return Object.values(chains).find((chain) => {
      return chain.denoms.find((denom) => denom.name === base_denom);
    }).chain_name;
  }

  return {
    getValidatorMoniker,
    getValidatorsByBaseDenom,
    getChainDisplayInflationByBaseDenom,
    getStakingRewardsByBaseDenom,
    getChainNameByBaseDenom,
  };
}
