<template>
  <List>
    <div class="space-y-2 pt-2 pb-8">
      <ListItem :label="$t('components.previews.addWithdrawLiquidity.poolLbl')" inset>
        <div class="flex justify-end items-center">
          <div v-if="poolInfo.denoms.length" class="flex -space-x-0.5 mr-2">
            <CircleSymbol :denom="poolInfo.denoms[0]" size="xs" />
            <CircleSymbol :denom="poolInfo.denoms[1]" size="xs" />
          </div>
          <span class="text-1 font-medium">{{ poolInfo.pairName }}</span>
        </div>
      </ListItem>

      <ListItem :description="$t('components.previews.addWithdrawLiquidity.priceLbl')" inset>
        <AmountDisplay :amount="{ amount: 1e6, denom: data.coinA.denom }" /> =
        <AmountDisplay :amount="{ amount: exchangeAmount, denom: data.coinB.denom }" />
      </ListItem>
    </div>

    <ListItem :label="$t(`components.previews.addWithdrawLiquidity.${response ? 'suppliedLbl' : 'supplyLbl'}`)">
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay class="text-1 font-medium" :amount="data.coinA" />
          <div class="block text-muted -text-1 mt-0.5"><ChainName :name="chainName" /></div>
        </div>
        <CircleSymbol :denom="data.coinA.denom" size="md" class="ml-3" />
      </div>

      <div class="flex justify-end items-center mt-6">
        <div class="text-right">
          <AmountDisplay class="text-1 font-medium" :amount="data.coinB" />
          <div class="block text-muted -text-1 mt-0.5"><ChainName :name="chainName" /></div>
        </div>
        <CircleSymbol :denom="data.coinB.denom" size="md" class="ml-3" />
      </div>
    </ListItem>

    <ListItem v-if="refundedAmount" :label="$t('components.previews.addWithdrawLiquidity.refundedLbl')">
      <AmountDisplay :amount="refundedAmount" />
    </ListItem>

    <ListItem
      :label="$t(`components.previews.addWithdrawLiquidity.${response ? 'receivedLbl' : 'receiveLbl'}`)"
      :description="$t('components.previews.addWithdrawLiquidity.receiveLblHint')"
    >
      <div class="flex items-center justify-end">
        <AmountDisplay
          class="font-medium text-1"
          :amount="{ amount: hasPool ? receiveAmount : 1e6, denom: poolInfo.denom }"
        />
        <CircleSymbol v-if="poolInfo.denoms.length" :pool-denoms="poolInfo.denoms" size="md" class="ml-3" />
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
import BigNumber from 'bignumber.js';
import { computed, defineComponent, PropType, reactive, watch } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { List, ListItem } from '@/components/ui/List';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { useStore } from '@/store';
import * as Actions from '@/types/actions';
import { AddLiquidityEndBlockResponse } from '@/types/api';
import * as Base from '@/types/base';
import { getBaseDenom, getDisplayName } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

export default defineComponent({
  name: 'PreviewAddLiquidity',

  components: {
    AmountDisplay,
    ChainName,
    List,
    ListItem,
    CircleSymbol,
  },

  props: {
    step: {
      type: Object as PropType<Actions.Step>,
      default: undefined,
    },
    fees: {
      type: Object as PropType<Record<string, Base.Amount>>,
      required: true,
    },
    response: {
      type: Object as PropType<AddLiquidityEndBlockResponse | Actions.Step>,
      default: undefined,
    },
  },

  setup(props) {
    const store = useStore();
    const { pools } = usePools();
    const poolInfo = reactive({
      exchangeAmountPrice: 1,
      pairName: '-/-',
      denom: '-',
      denoms: [],
    });

    const data = computed(() => {
      if ((props.response as AddLiquidityEndBlockResponse)?.accepted_coins) {
        const [coinA, coinB] = parseCoins((props.response as AddLiquidityEndBlockResponse).accepted_coins);
        const pool = pools.value.find(
          (item) => item.pool_coin_denom === (props.response as AddLiquidityEndBlockResponse).pool_coin_denom,
        );

        return {
          coinA,
          coinB,
          pool,
        };
      }

      const step = (props.response as Actions.Step) || props.step;

      return step.transactions[0].data as Actions.CreatePoolData;
    });

    const chainName = computed(() => {
      return store.getters['demeris/getDexChain'];
    });

    const hasPool = computed(() => {
      return !!(data.value as Actions.AddLiquidityData).pool;
    });

    // Add liquidity to a existing pool
    const { calculateSupplyTokenAmount, reserveBalances } = usePool((data.value as Actions.AddLiquidityData).pool?.id);
    const { formatPoolName, allPools } = usePools();

    const exchangeAmount = computed(() => {
      if (!hasPool.value) {
        return ((+data.value.coinB.amount || 1) / (+data.value.coinA.amount || 1)) * 1e6;
      }

      if (reserveBalances.value?.length) {
        return new BigNumber(reserveBalances.value[1].amount)
          .dividedBy(reserveBalances.value[0].amount)
          .shiftedBy(6)
          .toNumber();
      }

      return undefined;
    });

    const updatePoolInfo = async () => {
      if (hasPool.value) {
        const pool = (data.value as Actions.AddLiquidityData).pool;
        poolInfo.pairName = await formatPoolName(pool);
        poolInfo.denom = pool.pool_coin_denom;
        return;
      }

      const denoms = await Promise.all([getBaseDenom(data.value.coinA.denom), getBaseDenom(data.value.coinB.denom)]);
      const denomA = await getDisplayName(denoms[0], chainName.value);
      const denomB = await getDisplayName(denoms[1], chainName.value);

      poolInfo.pairName = `${denomA}/${denomB}`.toUpperCase();
      poolInfo.denom = `Gravity  ` + allPools.value.length;
      poolInfo.denoms = denoms;
    };

    const receiveAmount = computed(() => {
      if (props.response) {
        return +(props.response as AddLiquidityEndBlockResponse).pool_coin_amount;
      }

      return calculateSupplyTokenAmount(+data.value.coinA.amount, +data.value.coinB.amount);
    });

    const refundedAmount = computed(() => {
      if (!(props.response as AddLiquidityEndBlockResponse)?.refunded_coins) {
        return;
      }

      return parseCoins((props.response as AddLiquidityEndBlockResponse).refunded_coins)[0];
    });

    watch(data, updatePoolInfo, { immediate: true });

    return {
      refundedAmount,
      exchangeAmount,
      hasPool,
      poolInfo,
      chainName,
      data,
      receiveAmount,
    };
  },
});
</script>

<style lang="scss" scoped></style>
