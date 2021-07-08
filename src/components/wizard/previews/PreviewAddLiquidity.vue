<template>
  <List>
    <ListItem direction="column">
      <List>
        <ListItem label="Pool" inset>
          <div class="w-bold">{{ pairName }}</div>
        </ListItem>

        <ListItem description="Pool price" inset>
          <div class="s-minus">
            <AmountDisplay :amount="{ amount: 1e6, denom: data.coinA.denom }" /> =
            <AmountDisplay :amount="{ amount: 1e6, denom: data.coinB.denom }" />
          </div>
        </ListItem>
      </List>
    </ListItem>

    <ListItem label="Supply">
      <div class="supply__item">
        <div>
          <AmountDisplay class="w-bold" :amount="data.coinA" />
        </div>
        <span class="supply__item__chain"><ChainName :name="chainName" /></span>
      </div>

      <div class="supply__item">
        <div>
          <AmountDisplay class="w-bold" :amount="data.coinB" />
        </div>
        <span class="supply__item__chain"><ChainName :name="chainName" /></span>
      </div>
    </ListItem>

    <ListItem label="Receive (estimated)" description="LP Asset">
      <div>
        <AmountDisplay class="w-bold" :amount="{ amount: receiveAmount, denom: data.pool.pool_coin_denom }" />
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
import { computed, defineComponent, PropType } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import { List, ListItem } from '@/components/ui/List';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { useStore } from '@/store';
import * as Actions from '@/types/actions';
import * as Base from '@/types/base';

export default defineComponent({
  name: 'PreviewAddLiquidity',

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

    const data = computed(() => {
      return (props.step as Actions.Step).transactions[0].data as Actions.AddLiquidityData;
    });

    const chainName = computed(() => {
      return store.getters['demeris/getDexChain'];
    });

    const { pool, pairName, calculateSupplyTokenAmount } = usePool(data.value.pool.id);
    const { poolPriceById } = usePools();

    const price = computed(() => {
      return poolPriceById(pool.value.id);
    });

    const receiveAmount = computed(() => {
      return calculateSupplyTokenAmount(+data.value.coinA.amount, +data.value.coinB.amount);
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
