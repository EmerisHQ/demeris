import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes } from '@/store';
import { keyHashfromAddress } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

export default function useStaking() {
  const store = useStore();

  const getValidatorsByBaseDenom = async (base_denom: string) => {
    //TODO: have our own curated DB for validator list
    const chain_name = store.getters[GlobalDemerisGetterTypes.API.getChainNameByBaseDenom]({ denom: base_denom });
    const rawValidators = await store.dispatch(GlobalDemerisActionTypes.API.GET_VALIDATORS, { chain_name });

    //const curatedValidatorList = await Promise.all(rawValidators.reduce(reducer, []));
    return [...rawValidators];
  };

  const getChainDisplayInflationByBaseDenom = async (base_denom: string): Promise<number> => {
    const chain_name = store.getters[GlobalDemerisGetterTypes.API.getChainNameByBaseDenom]({ denom: base_denom });
    const inflation = await store.dispatch(GlobalDemerisActionTypes.API.GET_INFLATION, { chain_name });
    return Math.trunc(inflation * 10000) / 100;
  };

  const getStakingRewardsByBaseDenom = async (base_denom: string): Promise<unknown> => {
    try {
      const chain_name = store.getters[GlobalDemerisGetterTypes.API.getChainNameByBaseDenom]({ denom: base_denom });
      return await store.dispatch(GlobalDemerisActionTypes.API.GET_STAKING_REWARDS, { chain_name });
    } catch (_e) {
      // Apparently rewards endpoint errors out if staking rewards are zero
      // or user is not staking so we catch and return an entry for no rewards
      return { rewards: [], total: '0' + base_denom };
    }
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

  return {
    getValidatorMoniker,
    getValidatorsByBaseDenom,
    getChainDisplayInflationByBaseDenom,
    getStakingRewardsByBaseDenom,
  };
}
