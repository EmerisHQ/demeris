import { computed, ref, watch } from 'vue';

import { useAllStores } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { getTicker } from '@/utils/actionHandler';

export default function useDenoms() {
  const store = useAllStores();

  const verifiedDenoms = computed(() => {
    return store.getters['demeris/getVerifiedDenoms'];
  });
  const useDenom = (base_denom) => {
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
  return { useDenom, verifiedDenoms };
}
