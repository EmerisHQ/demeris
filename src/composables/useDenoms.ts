import { computed, ref, watch } from 'vue';

import { useDenoms as useDenomsStore } from '@/pinia/denoms';
import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { getTicker } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

let useDenomsInstance = null;

function useDenoms() {
  const apistore = useStore() as TypedAPIStore;
  const denoms = useDenomsStore();
  const verifiedDenoms = computed(() => {
    return denoms.verifiedDenoms;
  });
  const useDenomInstances = {};

  const useDenomFactory = (base_denom) => {
    const price = computed(() => {
      return apistore.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: base_denom });
    });
    const displayName = ref('-');
    const tickerName = ref('-');
    const updateDenom = async () => {
      tickerName.value = await getTicker(base_denom, apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]);
      displayName.value = await getDisplayName(base_denom, apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]);
    };

    watch(verifiedDenoms, updateDenom, { immediate: true });
    return { price, displayName, tickerName };
  };
  const useDenom = (base_denom) => {
    if (!useDenomInstances[base_denom]) {
      useDenomInstances[base_denom] = useDenomFactory(base_denom);
    }
    return useDenomInstances[base_denom];
  };
  return { useDenom, verifiedDenoms };
}
export default function useDenomsFactory() {
  if (!useDenomsInstance) {
    useDenomsInstance = useDenoms();
  }
  return useDenomsInstance;
}
