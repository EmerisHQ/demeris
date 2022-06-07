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

      <ListItem v-if="exchangeAmount" inset>
        <div class="flex justify-between">
          <div class="block text-muted -text-1 mt-0.5">
            {{ $t('components.previews.addWithdrawLiquidity.priceLbl') }}
          </div>
          <div>
            <AmountDisplay :amount="{ amount: exchangeAmount.coinA + '', denom: data.coinA.denom }" /> =
            <AmountDisplay :amount="{ amount: exchangeAmount.coinB + '', denom: data.coinB.denom }" />
          </div>
        </div>
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
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay class="text-1 font-medium" :amount="refundedAmount" />
          <div class="block text-muted -text-1 mt-0.5"><ChainName :name="chainName" /></div>
        </div>
        <CircleSymbol :denom="refundedAmount.denom" size="md" class="ml-3" />
      </div>
    </ListItem>

    <ListItem
      :label="$t(`components.previews.addWithdrawLiquidity.${response ? 'receivedLbl' : 'receiveLbl'}`)"
      :description="$t('components.previews.addWithdrawLiquidity.receiveLblHint')"
    >
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay
            class="font-medium text-1"
            :amount="{ amount: hasPool ? receiveAmount + '' : '1000000', denom: poolInfo.denom }"
          />
        </div>
        <CircleSymbol v-if="poolInfo.denoms.length" :pool-denoms="poolInfo.denoms" size="md" class="ml-3" />
      </div>
    </ListItem>

    <ListItem :label="$t('components.previews.addWithdrawLiquidity.feesLbl')" direction="col">
      <ListItem v-if="!hasPool" inset description="Pool creation fee">
        <AmountDisplay :amount="creationFee" />
      </ListItem>
      <ListItem :description="$t('components.previews.addWithdrawLiquidity.feeLbl')" inset>
        <template v-for="(amount, denom) in fees[chainName]" :key="'fee_' + denom">
          <AmountDisplay :amount="{ amount: amount, denom: denom }" />
        </template>
      </ListItem>
    </ListItem>
  </List>
</template>

<script setup lang="ts">
import { EmerisBase } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, reactive, watch } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { List, ListItem } from '@/components/ui/List';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { GlobalGetterTypes } from '@/store';
import * as Actions from '@/types/actions';
import { getBaseDenom, getDisplayName } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

interface Props {
  step: Actions.Step;
  fees: Record<string, EmerisBase.Amount>;
  response: EmerisBase.AddLiquidityEndBlockResponse | Actions.Step;
  isReceipt: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  step: undefined,
  response: undefined,
  isReceipt: false,
});

const store = useStore();

const { pools, getReserveBaseDenoms } = usePools();
const poolInfo = reactive({
  pairName: '-/-',
  denom: '-',
  denoms: [],
});

const creationFee = computed(() => {
  return store.getters['tendermint.liquidity.v1beta1/getParams']().params.pool_creation_fee[0];
});
function isBlockResponse(resp): resp is EmerisBase.AddLiquidityEndBlockResponse {
  return !!(resp as EmerisBase.AddLiquidityEndBlockResponse)?.accepted_coins;
}
const data = computed(() => {
  if (isBlockResponse(props.response)) {
    const endBlock = props.response;
    const [coinA, coinB] = parseCoins(endBlock.accepted_coins);
    const pool = pools.value?.find((item) => item.pool_coin_denom === endBlock.pool_coin_denom);

    return {
      coinA,
      coinB,
      pool,
    };
  } else {
    const step = props.response || props.step;
    return step.transactions[0].data as Actions.CreatePoolData;
  }
});

const precisions = computed(() => {
  return {
    coinA: store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: poolInfo.denoms[0] }) ?? 6,
    coinB: store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: poolInfo.denoms[1] }) ?? 6,
  };
});

const chainName = computed(() => {
  return store.getters[GlobalGetterTypes.API.getDexChain];
});

const hasPool = computed(() => {
  return !!(data.value as Actions.AddLiquidityData).pool;
});

// Add liquidity to a existing pool
const { calculateSupplyTokenAmount, reserveBalances } = usePool((data.value as Actions.AddLiquidityData).pool?.id);
const { getPoolName, getNextPoolId } = usePools();

const exchangeAmount = computed(() => {
  const coinA = new BigNumber(1).shiftedBy(precisions.value.coinA).toNumber();
  const precisionDiff = precisions.value.coinA - precisions.value.coinB;

  if (!hasPool.value) {
    const precisionDiff = precisions.value.coinA - precisions.value.coinB;
    return {
      coinA,
      coinB: new BigNumber(data.value.coinB.amount || 1)
        .dividedBy(data.value.coinA.amount || 1)
        .shiftedBy(precisions.value.coinB + precisionDiff)
        .toNumber(),
    };
  }

  if (reserveBalances.value?.length) {
    const isReverse = data.value.coinA.denom !== reserveBalances.value[0].denom;
    return {
      coinA,
      coinB: new BigNumber(reserveBalances.value[isReverse ? 0 : 1].amount)
        .dividedBy(reserveBalances.value[isReverse ? 1 : 0].amount)
        .shiftedBy(precisions.value.coinB + precisionDiff)
        .toNumber(),
    };
  }

  return undefined;
});

const updatePoolInfo = async () => {
  if (hasPool.value) {
    const pool = (data.value as Actions.AddLiquidityData).pool;
    poolInfo.pairName = await getPoolName(pool);
    poolInfo.denom = pool.pool_coin_denom;
    poolInfo.denoms = await getReserveBaseDenoms(pool);
    return;
  }

  const denoms = await Promise.all([getBaseDenom(data.value.coinA.denom), getBaseDenom(data.value.coinB.denom)]);
  const denomA = await getDisplayName(denoms[0], chainName.value);
  const denomB = await getDisplayName(denoms[1], chainName.value);

  poolInfo.pairName = `${denomA}/${denomB}`.toUpperCase();
  poolInfo.denom = `Gravity ` + getNextPoolId();
  poolInfo.denoms = denoms;
};

const receiveAmount = computed(() => {
  if (isBlockResponse(props.response)) {
    return +props.response.pool_coin_amount;
  }

  const result = calculateSupplyTokenAmount([
    {
      amount: new BigNumber(data.value.coinA.amount).shiftedBy(precisions.value.coinA).toNumber(),
      denom: data.value.coinA.denom,
    },
    {
      amount: new BigNumber(data.value.coinB.amount).shiftedBy(precisions.value.coinB).toNumber(),
      denom: data.value.coinB.denom,
    },
  ]);
  return new BigNumber(result).shiftedBy(-6).decimalPlaces(6).toNumber();
});

const refundedAmount = computed(() => {
  if (isBlockResponse(props.response)) {
    return parseCoins(props.response.refunded_coins)[0];
  } else {
    return null;
  }
});

watch(data, updatePoolInfo, { immediate: true });
</script>

<style lang="scss" scoped></style>
