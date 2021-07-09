<template>
  <List>
    <ListItem direction="column">
      <List>
        <ListItem label="Pool" inset>
          <div class="w-bold">{{ poolInfo.pairName }}</div>
        </ListItem>

        <ListItem description="Pool price" inset>
          <div class="s-minus">
            <AmountDisplay :amount="{ amount: 1e6, denom: data.coinA.denom }" /> =
            <AmountDisplay :amount="{ amount: poolInfo.price * 1e6, denom: data.coinB.denom }" />
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
        <AmountDisplay class="w-bold" :amount="{ amount: receiveAmount * 1e6, denom: poolInfo.denom }" />
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
import { computed, defineComponent, PropType, reactive, watch } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import { List, ListItem } from '@/components/ui/List';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { useStore } from '@/store';
import * as Actions from '@/types/actions';
import * as Base from '@/types/base';
import { getDisplayName } from '@/utils/actionHandler';

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
    const poolInfo = reactive({
      price: 1,
      pairName: '-/-',
      denom: '-',
    });

    const data = computed(() => {
      return (props.step as Actions.Step).transactions[0].data as Actions.CreatePoolData;
    });

    const chainName = computed(() => {
      return store.getters['demeris/getDexChain'];
    });

    const hasPool = computed(() => {
      return !!(data.value as Actions.AddLiquidityData).pool;
    });

    // Add liquidity to a existing pool
    const { calculateSupplyTokenAmount, pairName } = usePool((data.value as Actions.AddLiquidityData).pool?.id);
    const { poolPriceById } = usePools();

    const updatePoolInfo = async () => {
      if (hasPool.value) {
        const pool = (data.value as Actions.AddLiquidityData).pool;
        poolInfo.price = await poolPriceById(pool.id);
        poolInfo.pairName = pairName.value;
        poolInfo.denom = pool.pool_coin_denom;
        return;
      }

      const denomA = await getDisplayName(data.value.coinA.denom, chainName.value);
      const denomB = await getDisplayName(data.value.coinB.denom, chainName.value);
      poolInfo.price = 1;
      poolInfo.pairName = `${denomA}/${denomB}`.toUpperCase();
      poolInfo.denom = `GDEX ${denomA}/${denomB}`;
    };

    const receiveAmount = computed(() => {
      return calculateSupplyTokenAmount(+data.value.coinA.amount, +data.value.coinB.amount);
    });

    watch(data, updatePoolInfo, { immediate: true });

    return {
      poolInfo,
      chainName,
      data,
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
