<template>
  <List>
    <ListItem direction="column">
      <List>
        <ListItem :label="$t('components.previews.addWithdrawLiquidity.poolLbl')" inset>
          <div class="pool__item">
            <div class="pool__item__symbols">
              <CircleSymbol
                size="sm"
                :denom="data.pool.reserve_coin_denoms[0]"
                class="pool__item__symbols__symbol token-a"
              />
              <CircleSymbol
                size="sm"
                :denom="data.pool.reserve_coin_denoms[1]"
                class="pool__item__symbols__symbol token-b"
              />
            </div>
            <div class="pool__item__name font-bold">{{ pairName }}</div>
          </div>
        </ListItem>

        <ListItem :description="$t('components.previews.addWithdrawLiquidity.priceLbl')" inset>
          <div class="-text-1">
            <AmountDisplay :amount="{ amount: 1e6, denom: data.pool.reserve_coin_denoms[0] }" /> =
            <AmountDisplay :amount="{ amount: price * 1e6, denom: data.pool.reserve_coin_denoms[1] }" />
          </div>
        </ListItem>
      </List>
    </ListItem>

    <ListItem :label="$t('components.previews.addWithdrawLiquidity.supplyLbl')">
      <div class="supply__item">
        <CircleSymbol :denom="data.poolCoin.denom" class="supply__item__symbol" />
        <div class="supply__item__amount">
          <AmountDisplay class="font-bold" :amount="data.poolCoin" />
          <span class="supply__item__chain"><ChainName :name="chainName" /></span>
        </div>
      </div>
    </ListItem>

    <ListItem
      :label="$t('components.previews.addWithdrawLiquidity.receiveLbl')"
      :description="$t('components.previews.addWithdrawLiquidity.receiveLblHint')"
    >
      <div class="receive__item">
        <div class="receive__item__wrapper">
          <CircleSymbol
            :denom="receiveAmount.coinA.denom"
            :chain-name="chainName"
            size="sm"
            class="receive__item__symbol"
          />
          <AmountDisplay class="font-bold" :amount="receiveAmount.coinA" />
        </div>
        <span class="receive__item__chain"><ChainName :name="chainName" /></span>
      </div>

      <div class="receive__item">
        <div class="receive__item__wrapper">
          <CircleSymbol
            :denom="receiveAmount.coinB.denom"
            :chain-name="chainName"
            size="sm"
            class="receive__item__symbol"
          />
          <AmountDisplay class="font-bold" :amount="receiveAmount.coinB" />
        </div>
        <span class="receive__item__chain"><ChainName :name="chainName" /></span>
      </div>
    </ListItem>

    <ListItem :label="$t('components.previews.addWithdrawLiquidity.feesLbl')" direction="column">
      <ListItem class="fees__item" :description="$t('components.previews.addWithdrawLiquidity.feeLbl')" inset>
        <template v-for="(amount, denom) in fees[chainName]" :key="'fee_' + denom">
          <AmountDisplay class="-text-1" :amount="{ amount: amount, denom: denom }" />
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

<style lang="scss" scoped>
.pool__item {
  display: inline-flex;
  align-items: center;

  &__symbols {
    display: inline-flex;
    margin-right: 0.5rem;

    .token-a {
      z-index: 1;
    }

    .token-b {
      margin-left: -0.375rem;
    }
  }
}

.supply__item {
  display: inline-flex;
  align-items: flex-start;

  &__symbol {
    margin-right: 0.5rem;
  }

  &__amount {
    display: flex;
    flex-direction: column;
  }

  &__chain {
    font-size: 0.8125rem;
  }
}
.receive__item {
  &__wrapper {
    display: inline-flex;
    align-items: flex-start;
  }
  & + & {
    margin-top: 1rem;
  }
  &__symbol {
    margin-right: 0.5rem;
  }
  &__chain {
    display: block;
    font-size: 0.8125rem;
  }
}

.fees {
  &__item {
    padding: 0;
  }
}
</style>
