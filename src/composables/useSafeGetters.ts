/* eslint-disable @typescript-eslint/naming-convention */
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { useStore } from '@/utils/useStore';

export default function useSafeGetters() {
  const store = useStore() as RootStoreTyped;

  const getChainName = async (base_denom: string) => {
    let chain_name = store.getters[GlobalGetterTypes.API.getChainNameByBaseDenom]({ denom: base_denom });
    if (!chain_name) {
      try {
        const chains =
          store.getters[GlobalGetterTypes.API.getChains] ??
          (await store.dispatch(
            GlobalActionTypes.API.GET_CHAINS,
            {
              subscribe: false,
            },
            { root: true },
          ));
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
      } catch (e) {
        console.error('Error occurred while fetching chain data: ' + e);
      }
      chain_name = store.getters[GlobalGetterTypes.API.getChainNameByBaseDenom]({ denom: base_denom });
    }
    return chain_name;
  };
  return {
    getChainName,
  };
}
