/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines */
import { GlobalActionTypes, GlobalGetterTypes } from '@/store';
import { featureRunning } from '@/utils/FeatureManager';
import { useStore } from '@/utils/useStore';

/* eslint-disable max-lines-per-function */
export default function useChains() {
  const store = useStore();

  const getChains = async () => {
    const chains =
      store.getters[GlobalGetterTypes.API.getChains] ??
      (await store.dispatch(
        GlobalActionTypes.API.GET_CHAINS,
        {
          subscribe: false,
        },
        { root: true },
      ));
    return chains;
  };

  const getChainNameByBaseDenom = async (baseDenom: string) => {
    let chain_name = store.getters[GlobalGetterTypes.API.getChainNameByBaseDenom]({ denom: baseDenom });
    if (!chain_name) {
      try {
        const chains = await getChains();
        if (!featureRunning('USE_NEW_CHAINS_API')) {
          const promises = [];
          for (const chain in chains) {
            if (!chains[chain]?.node_info) {
              promises.push(
                store.dispatch(
                  GlobalActionTypes.API.GET_CHAIN,
                  {
                    subscribe: true,
                    params: {
                      chain_name: chain,
                    },
                  },
                  { root: true },
                ),
              );
            }
          }
          await Promise.all(promises);
        }
      } catch (e) {
        console.error('Error occurred while fetching chain data: ' + e);
      }
      chain_name = store.getters[GlobalGetterTypes.API.getChainNameByBaseDenom]({ denom: baseDenom });
    }
    return chain_name;
  };

  return {
    getChains,
    getChainNameByBaseDenom,
  };
}
