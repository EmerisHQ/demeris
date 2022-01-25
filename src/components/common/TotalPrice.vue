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
import { GlobalDemerisGetterTypes } from '@/store';
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

    const { stakingBalances, unbondingDelegations } = useAccount();
    const displayPrice = computed(() => {
      if (props.balances.length > 0) {
        const liquidValue = (props.balances as Balances).reduce((total, balance) => {
          if (balance.verified) {
            if (store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: balance.base_denom })) {
              let totalValue =
                parseInt(balance.amount) *
                store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: balance.base_denom });
              let precision = Math.pow(
                10,
                parseInt(
                  store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
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
        const verifiedDenoms = store.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];
        const stakedValue = stakingBalances.value.reduce((total, stakingBalance) => {
          const stakedDenom = verifiedDenoms.filter((x) => x.chain_name == stakingBalance.chain_name && x.stakable);
          if (stakedDenom.length > 0) {
            if (store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: stakedDenom[0].name })) {
              let totalValue =
                parseInt(stakingBalance.amount) *
                  store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: stakedDenom[0].name }) ?? 0;
              let precision = Math.pow(
                10,
                parseInt(
                  store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
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
        const unstakedValue = unbondingDelegations.value.reduce((total, unstakingBalance) => {
          const unstakedDenom = verifiedDenoms.filter((x) => x.chain_name == unstakingBalance.chain_name && x.stakable);
          if (unstakedDenom.length > 0) {
            if (store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: unstakedDenom[0].name })) {
              let totalValue =
                parseInt(unstakingBalance.amount) *
                  store.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: unstakedDenom[0].name }) ?? 0;
              let precision = Math.pow(
                10,
                parseInt(
                  store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
                    name: unstakedDenom[0].name,
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
        const value = liquidValue + stakedValue + unstakedValue;
        return Number.isFinite(value) ? value : 0;
      } else {
        return 0;
      }
    });
    return { displayPrice };
  },
});
</script>
<style lang="scss" scoped></style>
