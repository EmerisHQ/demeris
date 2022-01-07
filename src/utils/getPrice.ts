import { computed, ComputedRef, nextTick, ref, watch } from 'vue';

import { useStore } from '@/store';
import { Amount } from '@/types/base';
import { getBaseDenom } from '@/utils/actionHandler';

export default function (amount: Amount, showZero?: boolean, autoUpdate?: boolean): ComputedRef<number> {
  const store = useStore();
  const denom = ref((amount as Amount).denom);
  const isLoaded = ref(false);

  const price = ref();

  const priceObserver = computed(() => {
    return store.getters['demeris/getPrice']({ denom: denom.value });
  });

  const displayPrice = computed(() => {
    const precision =
      store.getters['demeris/getDenomPrecision']({
        name: denom.value,
      }) ?? '6';
    let value;

    if ((amount as Amount).amount) {
      value = (price.value * parseInt((amount as Amount).amount)) / Math.pow(10, parseInt(precision));
    } else {
      value = 0;
    }

    return value;
  });

  watch(
    () => amount as Amount,
    async (value) => {
      denom.value = value.chain_name
        ? await getBaseDenom((value as Amount).denom, value.chain_name)
        : await getBaseDenom((value as Amount).denom);
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
      if (autoUpdate || (amount as Amount).denom !== (oldAmount as Amount).denom) {
        nextTick(() => {
          price.value = priceObserver.value;
        });
      }
    },
  );

  return displayPrice;
}
