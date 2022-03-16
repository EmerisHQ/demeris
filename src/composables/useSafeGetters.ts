import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

export default function useSafeGetters() {
  const store = useStore();

  const getChainName = async (base_denom: string) => {
    let chain_name = store.getters[GlobalDemerisGetterTypes.API.getChainNameByBaseDenom]({ denom: base_denom });
    if (!chain_name) {
      try {
        await store.dispatch(GlobalDemerisActionTypes.API.GET_VERIFIED_DENOMS, {
          subscribe: true,
        });
      } catch (e) {
        console.error('Could not load verified denoms: ' + e);
      }
      chain_name = store.getters[GlobalDemerisGetterTypes.API.getChainNameByBaseDenom]({ denom: base_denom });
    }
    return chain_name;
  };
  return {
    getChainName,
  };
}
