import BigNumber from 'bignumber.js';
import { computed } from 'vue';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { useStore } from '@/utils/useStore';

export default function usePrice() {
  const typedstore = useStore() as RootStoreTyped;

  /**
   * getRawPrice is done in a way too hacky way because it had to be done in a rush. Needs a proper refactoring.
   * Logic is based on component `src/components/common/Price.vue` which shouldn't have had this business logic
   * @param denom
   * @param amount
   * @returns
   */
  function getRawPrice(denom, amount) {
    const price = typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom });
    const precision =
      typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({
        name: denom,
      }) ?? '6';

    let value = new BigNumber(0);

    if (price) {
      value = new BigNumber(parseInt(amount)).multipliedBy(price).shiftedBy(-precision);
    }

    return value;
  }

  function getDisplayPrice(denom, amount) {
    const formatedValue = computed(() => {
      let value = 0;
      if (typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom })) {
        value = parseFloat(amount) * typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom });
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',

          // These options are needed to round to whole numbers if that's what you want.
          //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
          //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        if (value) {
          return formatter.format(value);
        } else {
          return null;
        }
      } else {
        return null;
      }
    });
    return formatedValue;
  }

  return { getDisplayPrice, getRawPrice };
}
