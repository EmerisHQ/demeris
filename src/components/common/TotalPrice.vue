<template>
  <div class="total-price">
    <CurrencyDisplay :value="displayPrice" :small-decimals="smallDecimals" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';
import { useStore } from 'vuex';

import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import useAccount from '@/composables/useAccount';
import { GlobalGetterTypes } from '@/store';
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
    const propsRef = toRefs(props);
    const { stakingBalances, unbondingDelegations } = useAccount();

    const verifiedDenoms = computed(() => store.getters[GlobalGetterTypes.API.getVerifiedDenoms]);
    const liquidValue = computed(() => {
      if (propsRef.balances.value.length > 0) {
        return (propsRef.balances.value as Balances).reduce((total, balance) => {
          if (balance.verified) {
            if (store.getters[GlobalGetterTypes.API.getPrice]({ denom: balance.base_denom })) {
              let totalValue =
                parseInt(balance.amount) * store.getters[GlobalGetterTypes.API.getPrice]({ denom: balance.base_denom });
              let precision = Math.pow(
                10,
                parseInt(
                  store.getters[GlobalGetterTypes.API.getDenomPrecision]({
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
      } else {
        return 0;
      }
    });
    const stakedValue = computed(() => {
      return stakingBalances.value.reduce((total, stakingBalance) => {
        const stakedDenom = verifiedDenoms.value.filter((x) => x.chain_name == stakingBalance.chain_name && x.stakable);
        if (stakedDenom.length > 0) {
          if (store.getters[GlobalGetterTypes.API.getPrice]({ denom: stakedDenom[0].name })) {
            let totalValue =
              parseInt(stakingBalance.amount) *
                store.getters[GlobalGetterTypes.API.getPrice]({ denom: stakedDenom[0].name }) ?? 0;
            let precision = Math.pow(
              10,
              parseInt(
                store.getters[GlobalGetterTypes.API.getDenomPrecision]({
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
    });
    const unstakingValue = computed(() => {
      return unbondingDelegations.value.reduce((total, unstakingBalance) => {
        const unstakedDenom = verifiedDenoms.value.filter(
          (x) => x.chain_name == unstakingBalance.chain_name && x.stakable,
        );

        if (unstakedDenom.length > 0) {
          let unstakedAmount;
          const unstakedAmounts = unstakingBalance.entries.map((z) => z.balance);
          if (unstakedAmounts.length > 0) {
            unstakedAmount = unstakedAmounts.reduce((acc, item) => +parseInt(item) + acc, 0);
          }
          if (store.getters[GlobalGetterTypes.API.getPrice]({ denom: unstakedDenom[0].name })) {
            let totalValue =
              parseInt(unstakedAmount) *
                store.getters[GlobalGetterTypes.API.getPrice]({ denom: unstakedDenom[0].name }) ?? 0;
            let precision = Math.pow(
              10,
              parseInt(
                store.getters[GlobalGetterTypes.API.getDenomPrecision]({
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
    });
    const displayPrice = computed(() => {
      const value = liquidValue.value + stakedValue.value + unstakingValue.value;
      return Number.isFinite(value) ? value : 0;
    });
    return { displayPrice };
  },
});
</script>
<style lang="scss" scoped></style>
