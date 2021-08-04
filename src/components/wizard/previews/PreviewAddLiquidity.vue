<template>
  <List>
    <ListItem direction="column">
      <List>
        <ListItem :label="$t('components.previews.addWithdrawLiquidity.poolLbl')" inset>
          <div class="pool__pair">
            <div v-if="poolInfo.denoms.length" class="pool__pair__symbols">
              <CircleSymbol :denom="poolInfo.denoms[0]" size="xs" class="pool__pair__symbols__token token-a" />
              <CircleSymbol :denom="poolInfo.denoms[1]" size="xs" class="pool__pair__symbols__token token-b" />
            </div>

            <span class="pool__pair__name w-bold">{{ poolInfo.pairName }}</span>
          </div>
        </ListItem>

        <ListItem :description="$t('components.previews.addWithdrawLiquidity.priceLbl')" inset>
          <div class="s-minus">
            <AmountDisplay :amount="{ amount: 1e6, denom: data.coinA.denom }" /> =
            <AmountDisplay :amount="{ amount: exchangeAmount, denom: data.coinB.denom }" />
          </div>
        </ListItem>
      </List>
    </ListItem>

    <ListItem :label="$t(`components.previews.addWithdrawLiquidity.${response ? 'suppliedLbl' : 'supplyLbl'}`)">
      <div class="supply__item">
        <div class="pool__item">
          <CircleSymbol :denom="data.coinA.denom" size="sm" class="pool__item__symbol" />
          <AmountDisplay class="w-bold" :amount="data.coinA" />
        </div>
        <span class="supply__item__chain"><ChainName :name="chainName" /></span>
      </div>

      <div class="supply__item">
        <div class="pool__item">
          <CircleSymbol :denom="data.coinB.denom" size="sm" class="pool__item__symbol" />
          <AmountDisplay class="w-bold" :amount="data.coinB" />
        </div>
        <span class="supply__item__chain"><ChainName :name="chainName" /></span>
      </div>
    </ListItem>

    <ListItem v-if="refundedAmount" :label="$t('components.previews.addWithdrawLiquidity.refundedLbl')">
      <AmountDisplay :amount="refundedAmount" />
    </ListItem>

    <ListItem
      :label="$t(`components.previews.addWithdrawLiquidity.${response ? 'receivedLbl' : 'receiveLbl'}`)"
      :description="$t('components.previews.addWithdrawLiquidity.receiveLblHint')"
    >
      <div class="pool__item">
        <CircleSymbol
          v-if="poolInfo.denoms.length"
          :pool-denoms="poolInfo.denoms"
          size="sm"
          class="pool__item__symbol"
        />
        <AmountDisplay class="w-bold" :amount="{ amount: hasPool ? receiveAmount : 1e6, denom: poolInfo.denom }" />
      </div>
    </ListItem>

    <ListItem :label="$t('components.previews.addWithdrawLiquidity.feesLbl')" direction="column">
      <ListItem class="fees__item" :description="$t('components.previews.addWithdrawLiquidity.feeLbl')" inset>
        <template v-for="(amount, denom) in fees[chainName]" :key="'fee_' + denom">
          <AmountDisplay class="s-minus" :amount="{ amount: amount, denom: denom }" />
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
      type: Object as PropType<AddLiquidityEndBlockResponse>,
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
      if (props.response?.accepted_coins) {
        const [coinA, coinB] = parseCoins(props.response.accepted_coins);
        const pool = pools.value.find((item) => item.pool_coin_denom === props.response.pool_coin_denom);

        return {
          coinA,
          coinB,
          pool,
        };
      }

      return (props.step as Actions.Step).transactions[0].data as Actions.CreatePoolData;
    });

    const chainName = computed(() => {
      return store.getters['demeris/getDexChain'];
    });

    const hasPool = computed(() => {
      return !!(data.value as Actions.AddLiquidityData).pool;
    });

    // Add liquidity to a existing pool
    const { calculateSupplyTokenAmount, reserveBalances } = usePool((data.value as Actions.AddLiquidityData).pool?.id);
    const { formatPoolName } = usePools();

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
      poolInfo.denom = `GDEX ${denomA}/${denomB}`;
      poolInfo.denoms = denoms;
    };

    const receiveAmount = computed(() => {
      if (props.response) {
        return +props.response.pool_coin_amount;
      }

      return calculateSupplyTokenAmount(+data.value.coinA.amount, +data.value.coinB.amount);
    });

    const refundedAmount = computed(() => {
      if (!props.response?.refunded_coins) {
        return;
      }

      return parseCoins(props.response.refunded_coins)[0];
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

<style lang="scss" scoped>
.pool__pair {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &__symbols {
    display: flex;
    align-items: center;
    margin-right: 0.8rem;

    &__token {
      z-index: 0;

      &.token-a {
        z-index: 1;
        margin-right: -0.6rem;
      }
    }
  }
}

.pool__item {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &__symbol {
    margin-right: 0.8rem;
  }
}
.supply__item {
  & + & {
    margin-top: 1.6rem;
  }

  &__chain {
    margin-top: -0.5rem;
    font-size: 1.2rem;
  }
}

.fees {
  &__item {
    padding: 0;
  }
}
</style>
