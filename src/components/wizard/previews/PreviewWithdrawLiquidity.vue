<template>
  <List>
    <ListItem label="Pool" description="Pool price" hint="TODO">
      <div class="w-bold">ATOM/MIR</div>
    </ListItem>

    <ListItem description="Pool price" hint="TODO" inset>
      <div class="s-minus">
        <AmountDisplay class="w-bold" :amount="{ amount: 1, denom: pool.reserveCoinDenoms[0] }" /> =
        <AmountDisplay class="w-bold" :amount="{ amount: 1, denom: pool.reserveCoinDenoms[1] }" />
      </div>
    </ListItem>

    <ListItem label="Supply">
      <div>
        <AmountDisplay class="w-bold" :amount="data.params.poolCoin.amount" />
      </div>
      <sub><ChainName :name="data.params.poolCoin.chain_name" /></sub>
    </ListItem>

    <ListItem label="Receive (estimated)">
      <div>
        <div>
          <AmountDisplay class="w-bold" :amount="{ amount: 1, denom: pool.reserveCoinDenoms[0] }" />
        </div>
        <sub><ChainName name="cosmos-hub" /></sub>
      </div>
      <div>
        <div>
          <AmountDisplay class="w-bold" :amount="{ amount: 1, denom: pool.reserveCoinDenoms[1] }" />
        </div>
        <sub><ChainName name="cosmos-hub" /></sub>
      </div>
    </ListItem>

    <ListItem label="Fees" direction="column">
      <ListItem description="Transaction fee" hint="TODO" inset>
        <AmountDisplay class="s-minus" :amount="{ amount: 1, denom: 'uatom' }" />
      </ListItem>

      <ListItem description="Withdraw liquidity Fee" hint="TODO" inset>
        <AmountDisplay class="s-minus" :amount="{ amount: 1, denom: 'uatom' }" />
      </ListItem>
    </ListItem>
  </List>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import { List, ListItem } from '@/components/ui/List';
import usePools from '@/composables/usePools';
import { WithdrawLiquidityAction } from '@/types/actions';

export default defineComponent({
  name: 'PreviewWithdrawLiquidity',

  components: {
    AmountDisplay,
    ChainName,
    List,
    ListItem,
  },

  props: {
    data: {
      type: Object as PropType<WithdrawLiquidityAction>,
      required: true,
    },
  },

  setup(props) {
    const { poolById } = usePools();

    const pool = computed(() => {
      return poolById(props.data.params.pool_id);
    });

    return {
      pool,
    };
  },
});
</script>
