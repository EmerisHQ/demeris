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
        <AmountDisplay
          :amount="{ amount: (10 ** precisions[0]).toString(), denom: data.pool.reserve_coin_denoms[0] }"
        />
        =
        <AmountDisplay
          :amount="{
            amount: (receiveAmount.ratio * 10 ** precisions[0]).toString(),
            denom: data.pool.reserve_coin_denoms[1],
          }"
        />
      </ListItem>
    </div>

    <ListItem :label="$t(`components.previews.addWithdrawLiquidity.${response ? 'suppliedLbl' : 'supplyLbl'}`)">
      <div class="supply__item flex justify-end items-center">
        <div class="supply__item__amount text-right">
          <AmountDisplay class="text-1 font-medium" :amount="data.poolCoin" />
          <span class="supply__item__chain block text-muted -text-1 mt-0.5"><ChainName :name="chainName" /></span>
        </div>
        <CircleSymbol :denom="data.poolCoin.denom" size="md" class="ml-3" />
      </div>
    </ListItem>

    <ListItem
      :label="$t(`components.previews.addWithdrawLiquidity.${response ? 'receivedLbl' : 'receiveLbl'}`)"
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

<script setup lang="ts">
/* eslint-disable max-lines-per-function */
import { EmerisBase } from '@emeris/types';
import { computed } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { List, ListItem } from '@/components/ui/List';
import usePool from '@/composables/usePool';
import usePoolsFactory from '@/composables/usePools';
import { GlobalGetterTypes } from '@/store';
import * as Actions from '@/types/actions';
import { getBaseDenomSync } from '@/utils/actionHandler';

interface Props {
  step?: Actions.Step;
  fees: Record<string, EmerisBase.Amount>;
  response?: EmerisBase.WithdrawLiquidityEndBlockResponse;
  isReceipt?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  step: undefined,
  response: undefined,
  isReceipt: false,
});

const store = useStore();
const { getPoolById } = usePoolsFactory();

const data = computed(() => {
  if (props.response) {
    const pool = getPoolById(props.response.pool_id);
    const poolCoin = { amount: props.response.pool_coin_amount, denom: props.response.pool_coin_denom };
    const precisions = {
      coinA:
        store.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: getBaseDenomSync(pool.reserve_coin_denoms[0]),
        }) ?? 6,
      coinB:
        store.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: getBaseDenomSync(pool.reserve_coin_denoms[1]),
        }) ?? 6,
    };

    return { pool, poolCoin, precisions };
  }

  return (props.step as Actions.Step).transactions[0].data as Actions.WithdrawLiquidityData;
});

const chainName = computed(() => {
  return store.getters[GlobalGetterTypes.API.getDexChain];
});

const { pairName, getPoolWithdrawBalances } = usePool(data.value.pool.id);

const precisions = computed(() => {
  const pool = data.value.pool;
  return [
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: getBaseDenomSync(pool.reserve_coin_denoms[0]),
    }) ?? 6,
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: getBaseDenomSync(pool.reserve_coin_denoms[1]),
    }) ?? 6,
  ];
});

const receiveAmount = computed(() => {
  const result = getPoolWithdrawBalances(+data.value.poolCoin.amount);
  const isReverse = data.value.pool.reserve_coin_denoms[0] !== result[0].denom;
  return {
    coinA: result[0],
    coinB: result[1],
    ratio: Number(result[isReverse ? 0 : 1].amount) / Number(result[isReverse ? 1 : 0].amount),
  };
});
</script>

<style lang="scss" scoped></style>
