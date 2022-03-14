import { EmerisBase } from '@emeris/types';
import { computed, ComputedRef, nextTick, ref, watch } from 'vue';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getBaseDenom } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

export default function (
  amount: EmerisBase.ChainAmount | EmerisBase.Amount,
  showZero?: boolean,
  autoUpdate?: boolean,
): ComputedRef<number> {
  const store = useStore() as RootStoreTyped;
  const denom = ref(amount.denom);
  const isLoaded = ref(false);

  const price = ref();

  const priceObserver = computed(() => {
    return store.getters[GlobalGetterTypes.API.getPrice]({ denom: denom.value });
  });

  const displayPrice = computed(() => {
    const precision =
      store.getters[GlobalGetterTypes.API.getDenomPrecision]({
        name: denom.value,
      }) ?? 6;
    let value;

    if (amount.amount) {
      value = (price.value * parseInt(amount.amount)) / Math.pow(10, precision);
    } else {
      value = 0;
    }

    return value;
  });

  watch(
    () => amount,
    async (value) => {
      denom.value = (value as EmerisBase.ChainAmount).chain_name
        ? await getBaseDenom(value.denom, (value as EmerisBase.ChainAmount).chain_name)
        : await getBaseDenom(value.denom);
      if (!isLoaded.value) {
        price.value = priceObserver.value;
      }
      isLoaded.value = true;
    },
    { immediate: true },
  );

  watch(
    () => [autoUpdate, amount, priceObserver],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([autoUpdate, amount], [_, oldAmount]) => {
      if (autoUpdate || (amount as EmerisBase.Amount).denom !== (oldAmount as EmerisBase.Amount).denom) {
        nextTick(() => {
          price.value = priceObserver.value;
        });
      }
    },
  );

  return displayPrice;
}
