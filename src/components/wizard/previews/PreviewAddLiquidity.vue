<template>
  <List>
    <ListItem label="Pool" description="Pool price" hint="TODO">
      <div class="w-bold">ATOM/MIR</div>
    </ListItem>

    <ListItem description="Pool price" hint="TODO" inset>
      <div class="s-minus">
        <AmountDisplay class="w-bold" :amount="{ amount: 1, denom: data.params.coinA.amount.denom }" /> =
        <AmountDisplay class="w-bold" :amount="{ amount: 1, denom: data.params.coinB.amount.denom }" />
      </div>
    </ListItem>

    <ListItem label="Supply">
      <div>
        <div>
          <AmountDisplay class="w-bold" :amount="data.params.coinA.amount" />
        </div>
        <sub><ChainName name="cosmos-hub" /></sub>
      </div>
      <div>
        <div>
          <AmountDisplay class="w-bold" :amount="data.params.coinB.amount" />
        </div>
        <sub><ChainName name="cosmos-hub" /></sub>
      </div>
    </ListItem>

    <ListItem label="Receive (estimated)">
      <div>
        <AmountDisplay class="w-bold" :amount="{ amount: 1210, denom: 'G-AM-LP' }" />
      </div>
      <sub><ChainName :name="data.params.coinA.chain_name" /></sub>
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
import { AddLiquidityAction } from '@/types/actions';

export default defineComponent({
  name: 'PreviewAddLiquidity',

  components: {
    AmountDisplay,
    ChainName,
    List,
    ListItem,
  },

  props: {
    data: {
      type: Object as PropType<AddLiquidityAction>,
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
