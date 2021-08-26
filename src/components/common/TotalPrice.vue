<template>
  <template v-if="isLoading">
    <div class="rounded bg-muted animate-pulse" :class="skeletonClass" />
  </template>

  <div v-else class="total-price">
    {{ displayPrice[0] }}<span :class="{ 'text-0 sm:text-1 lg:text-2': smallDecimals }">.{{ displayPrice[1] }}</span>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import useAccount from '@/composables/useAccount';
import { useStore } from '@/store';
import { Balances } from '@/types/api';
export default defineComponent({
  name: 'TotalPrice',
  props: {
    balances: {
      type: Array as PropType<Balances>,
      required: true,
    },
    smallDecimals: {
      type: Boolean as PropType<true | false>,
      default: false,
    },
    skeletonClass: {
      type: [String, Object, Array],
      default: '',
    },
  },
  setup(props) {
    const store = useStore();

    const { stakingBalances } = useAccount();

    const isLoading = computed(() => {
      const state = store.state.demeris.sync;
      return state.denoms !== 'synced' || state.prices !== 'synced';
    });
    const displayPrice = computed(() => {
      const liquidValue = (props.balances as Balances).reduce((total, balance) => {
        if (balance.verified) {
          if (store.getters['demeris/getPrice']({ denom: balance.base_denom })) {
            let totalValue =
              parseInt(balance.amount) * store.getters['demeris/getPrice']({ denom: balance.base_denom });
            let precision = Math.pow(
              10,
              parseInt(
                store.getters['demeris/getDenomPrecision']({
                  name: balance.base_denom,
                }) || 6,
              ),
            );
            let value = totalValue / precision;
            if (value) {
              return total + value;
            }
          } else {
            return total;
          }
        } else {
          return total;
        }
      }, 0);
      const verifiedDenoms = store.getters['demeris/getVerifiedDenoms'];
      const stakedValue = stakingBalances.value.reduce((total, stakingBalance) => {
        const stakedDenom = verifiedDenoms.filter((x) => x.chain_name == stakingBalance.chain_name && x.stakable);
        if (stakedDenom.length > 0) {
          if (store.getters['demeris/getPrice']({ denom: stakedDenom[0].name })) {
            let totalValue =
              parseInt(stakingBalance.amount) * store.getters['demeris/getPrice']({ denom: stakedDenom[0].name });
            let precision = Math.pow(
              10,
              parseInt(
                store.getters['demeris/getDenomPrecision']({
                  name: stakedDenom[0].name,
                }) || 6,
              ),
            );
            let value = totalValue / precision;
            if (value) {
              return total + value;
            }
          } else {
            return total;
          }
        } else {
          return total;
        }
      }, 0);
      const value = liquidValue + stakedValue;
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(Number.isFinite(value) ? value : 0).split('.');
    });
    return { isLoading, displayPrice };
  },
});
</script>
<style lang="scss" scoped></style>
