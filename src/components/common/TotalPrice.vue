<template>
  <div class="total-price">
    <CurrencyDisplay :value="displayPrice" :small-decimals="smallDecimals" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useStore } from 'vuex';

import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import useAccount from '@/composables/useAccount';
import { Balances } from '@/types/api';

export default defineComponent({
  components: { CurrencyDisplay },
  props: {
    balances: {
      type: Array as PropType<Balances>,
      required: true,
    },
    smallDecimals: {
      type: Boolean as PropType<true | false>,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const { stakingBalances } = useAccount();
    const displayPrice = computed(() => {
      const liquidValue = (props.balances as Balances).reduce((total, balance) => {
        if (balance.verified) {
          if (store.getters['demerisAPI/getPrice']({ denom: balance.base_denom })) {
            let totalValue =
              parseInt(balance.amount) * store.getters['demerisAPI/getPrice']({ denom: balance.base_denom });
            let precision = Math.pow(
              10,
              parseInt(
                store.getters['demerisAPI/getDenomPrecision']({
                  name: balance.base_denom,
                }) || 6,
              ),
            );
            let value = totalValue / precision;
            if (value) {
              return total + value;
            } else {
              return total;
            }
          } else {
            return total;
          }
        } else {
          return total;
        }
      }, 0);
      const verifiedDenoms = store.getters['demerisAPI/getVerifiedDenoms'];
      const stakedValue = stakingBalances.value.reduce((total, stakingBalance) => {
        const stakedDenom = verifiedDenoms.filter((x) => x.chain_name == stakingBalance.chain_name && x.stakable);
        if (stakedDenom.length > 0) {
          if (store.getters['demerisAPI/getPrice']({ denom: stakedDenom[0].name })) {
            let totalValue =
              parseInt(stakingBalance.amount) * store.getters['demerisAPI/getPrice']({ denom: stakedDenom[0].name }) ??
              0;
            let precision = Math.pow(
              10,
              parseInt(
                store.getters['demerisAPI/getDenomPrecision']({
                  name: stakedDenom[0].name,
                }) || 6,
              ),
            );
            let value = totalValue / precision;
            if (value) {
              return total + value;
            } else {
              return total;
            }
          } else {
            return total;
          }
        } else {
          return total;
        }
      }, 0);
      const value = liquidValue + stakedValue;
      return Number.isFinite(value) ? value : 0;
    });
    return { displayPrice };
  },
});
</script>
<style lang="scss" scoped></style>
