import { computed, ref, watch } from 'vue';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { getTicker } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

let useDenomsInstance = null;

function useDenoms() {
  const typedstore = useStore() as RootStoreTyped;

  const verifiedDenoms = computed(() => {
    return typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms];
  });
  const useDenomInstances = {};

  const useDenomFactory = (base_denom) => {
    const price = computed(() => {
      return typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom: base_denom });
    });
    const displayName = ref('-');
    const tickerName = ref('-');
    const updateDenom = async () => {
      tickerName.value = await getTicker(base_denom, typedstore.getters[GlobalGetterTypes.API.getDexChain]);
      displayName.value = await getDisplayName(base_denom, typedstore.getters[GlobalGetterTypes.API.getDexChain]);
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
