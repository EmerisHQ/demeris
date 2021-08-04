<template>
  <List>
    <div class="space-y-2 pt-2 pb-8">
      <ListItem :label="$t('components.previews.addWithdrawLiquidity.poolLbl')" inset>
        <div class="flex justify-end items-center">
          <div class="flex -space-x-0.5 mr-2">
            <CircleSymbol size="xs" :denom="data.pool.reserve_coin_denoms[0]" />
            <CircleSymbol size="xs" :denom="data.pool.reserve_coin_denoms[1]" />
          </div>
          <div class="text-1 font-medium">{{ pairName }}</div>
        </div>
      </ListItem>

      <ListItem :description="$t('components.previews.addWithdrawLiquidity.priceLbl')" inset>
        <AmountDisplay :amount="{ amount: 1e6, denom: data.pool.reserve_coin_denoms[0] }" /> =
        <AmountDisplay :amount="{ amount: price * 1e6, denom: data.pool.reserve_coin_denoms[1] }" />
      </ListItem>
    </div>

    <ListItem :label="$t('components.previews.addWithdrawLiquidity.supplyLbl')">
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay class="text-1 font-medium" :amount="data.poolCoin" />
          <span class="block text-muted -text-1 mt-0.5"><ChainName :name="chainName" /></span>
        </div>
        <CircleSymbol :denom="data.poolCoin.denom" size="md" class="ml-3" />
      </div>
    </ListItem>

    <ListItem
      :label="$t('components.previews.addWithdrawLiquidity.receiveLbl')"
      :description="$t('components.previews.addWithdrawLiquidity.receiveLblHint')"
    >
      <div class="flex items-center justify-end">
        <div class="text-right">
          <AmountDisplay class="text-1 font-medium" :amount="receiveAmount.coinA" />
          <div class="block text-muted -text-1 mt-0.5"><ChainName :name="chainName" /></div>
        </div>
        <CircleSymbol :denom="receiveAmount.coinA.denom" :chain-name="chainName" size="md" class="ml-3" />
      </div>

      <div class="flex items-center justify-end mt-6">
        <div class="text-right">
          <AmountDisplay class="text-1 font-medium" :amount="receiveAmount.coinB" />
          <div class="block text-muted -text-1 mt-0.5"><ChainName :name="chainName" /></div>
        </div>
        <CircleSymbol :denom="receiveAmount.coinB.denom" :chain-name="chainName" size="md" class="ml-3" />
      </div>
    </ListItem>

    <ListItem :label="$t('components.previews.addWithdrawLiquidity.feesLbl')" direction="col">
      <ListItem :description="$t('components.previews.addWithdrawLiquidity.feeLbl')" inset>
        <template v-for="(amount, denom) in fees[chainName]" :key="'fee_' + denom">
          <AmountDisplay :amount="{ amount: amount, denom: denom }" />
        </template>
      </ListItem>
    </ListItem>
  </List>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { List, ListItem } from '@/components/ui/List';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { useStore } from '@/store';
import * as Actions from '@/types/actions';
import * as Base from '@/types/base';

export default defineComponent({
  name: 'PreviewWithdrawLiquidity',

  components: {
    AmountDisplay,
    ChainName,
    CircleSymbol,
    List,
    ListItem,
  },

  props: {
    step: {
      type: Object as PropType<Actions.Step>,
      required: true,
    },
    fees: {
      type: Object as PropType<Record<string, Base.Amount>>,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const price = ref(1);

    const data = computed(() => {
      return (props.step as Actions.Step).transactions[0].data as Actions.WithdrawLiquidityData;
    });

    const chainName = computed(() => {
      return store.getters['demeris/getDexChain'];
    });

    const { pool, pairName, calculateWithdrawBalances } = usePool(data.value.pool.id);
    const { poolPriceById } = usePools();

    const receiveAmount = computed(() => {
      const result = calculateWithdrawBalances(+data.value.poolCoin.amount);
      return {
        coinA: result[0],
        coinB: result[1],
      };
    });

    watch(props.step as Actions.Step, async () => {
      price.value = await poolPriceById(pool.value.id);
    });

    return {
      chainName,
      data,
      price,
      pool,
      pairName,
      receiveAmount,
    };
  },
});
</script>

<style lang="scss" scoped></style>
