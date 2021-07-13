import { computed } from 'vue';
import { useStore } from 'vuex';

export default function usePrice() {
  const store = useStore();

  function getDisplayPrice(denom, amount) {
    const formatedValue = computed(() => {
      let value = 0;
      if (store.getters['demeris/getPrice']({ denom })) {
        value = parseInt(amount) * store.getters['demeris/getPrice']({ denom });
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

  return { getDisplayPrice };
}
