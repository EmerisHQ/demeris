<template>
  <List>
    <ListItem direction="column">
      <List>
        <ListItem label="Pool" inset>
          <div class="w-bold">{{ pairName }}</div>
        </ListItem>

        <ListItem description="Pool price" inset>
          <div class="s-minus">
            <AmountDisplay :amount="{ amount: 1e6, denom: data.pool.reserve_coin_denoms[0] }" /> =
            <AmountDisplay :amount="{ amount: price * 1e6, denom: data.pool.reserve_coin_denoms[1] }" />
          </div>
        </ListItem>
      </List>
    </ListItem>

    <ListItem label="Supply">
      <div>
        <AmountDisplay class="w-bold" :amount="data.value.poolCoin" />
      </div>
    </ListItem>

    <ListItem label="Receive (estimated)" description="LP Asset">
      <div class="receive__item">
        <div>
          <AmountDisplay class="w-bold" :amount="receiveAmount.coinA" />
        </div>
        <span class="receive__item__chain"><ChainName :name="chainName" /></span>
      </div>

      <div class="receive__item">
        <div>
          <AmountDisplay class="w-bold" :amount="receiveAmount.coinB" />
        </div>
        <span class="receive__item__chain"><ChainName :name="chainName" /></span>
      </div>
    </ListItem>

    <ListItem label="Fees" direction="column">
      <ListItem class="fees__item" description="Transaction Fee" inset>
        <template v-for="(amount, denom) in fees[chainName]" :key="'fee_' + denom">
          <AmountDisplay class="s-minus" :amount="{ amount: amount, denom: denom }" />
        </template>
      </ListItem>
    </ListItem>
  </List>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
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
.receive__item {
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
