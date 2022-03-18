import useSafeGetters from '@/composables/useSafeGetters';
import { GlobalActionTypes, RootStoreTyped } from '@/store';
import { keyHashfromAddress } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

export default function useStaking() {
  const store = useStore() as RootStoreTyped;
  const { getChainName } = useSafeGetters();

  const getValidatorsByBaseDenom = async (base_denom: string) => {
    //TODO: have our own curated DB for validator list
    const chain_name = await getChainName(base_denom);
    const rawValidators = await store.dispatch(GlobalActionTypes.API.GET_VALIDATORS, {
      subscribe: false,
      params: { chain_name },
    });

    //const curatedValidatorList = await Promise.all(rawValidators.reduce(reducer, []));
    return [...rawValidators];
  };

  const getChainDisplayInflationByBaseDenom = async (base_denom: string): Promise<number> => {
    const chain_name = await getChainName(base_denom);
    try {
      const inflation = await store.dispatch(GlobalActionTypes.API.GET_INFLATION, {
        subscribe: false,
        params: { chain_name },
      });
      return Math.trunc(inflation * 10000) / 100;
    } catch (_e) {
      return null;
    }
  };

  const getStakingRewardsByBaseDenom = async (base_denom: string): Promise<StakingRewards> => {
    try {
      const chain_name = await getChainName(base_denom);
      const rewards = await store.dispatch(GlobalActionTypes.API.GET_STAKING_REWARDS, {
        subscribe: false,
        params: { chain_name },
      });
      if (rewards.total === '') {
        return { rewards: [], total: '0' + base_denom };
      }
      return rewards;
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

export interface StakingRewards {
  rewards: { reward: string; validator_address: string }[];
  total: string;
}
