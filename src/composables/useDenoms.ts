import { computed, ref, watch } from 'vue';

import { useAllStores } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { getTicker } from '@/utils/actionHandler';

let useDenomsInstance = null;

function useDenoms() {
  const store = useAllStores();

  const verifiedDenoms = computed(() => {
    return store.getters['demeris/getVerifiedDenoms'];
  });
  const useDenomInstances = {};

  const useDenomFactory = (base_denom) => {
    const price = computed(() => {
      return store.getters['demeris/getPrice']({ denom: base_denom });
    });
    const displayName = ref('-');
    const tickerName = ref('-');
    const updateDenom = async () => {
      tickerName.value = await getTicker(base_denom, store.getters['demeris/getDexChain']);
      displayName.value = await getDisplayName(base_denom, store.getters['demeris/getDexChain']);
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
