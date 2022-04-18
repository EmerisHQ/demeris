import { GlobalActionTypes, GlobalGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

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
      chain_name = store.getters[GlobalGetterTypes.API.getChainNameByBaseDenom]({ denom: baseDenom });
    }
    return chain_name;
  };

  return {
    getChains,
    getChainNameByBaseDenom,
  };
}
