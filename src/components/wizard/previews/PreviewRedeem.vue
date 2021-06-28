<template>
  <List>
    <ListItem label="Send">
      <div>
        <AmountDisplay class="w-bold" :amount="{ amount: totalAmount, denom: 'uatom' }" />
      </div>
      <sub><ChainName name="terra" /></sub>
    </ListItem>

    <ListItem :label="`${data.params.length} transfers to sign`" direction="column" hint="TODO">
      <ListItem
        v-for="transfer of data.params"
        :key="transfer.chain_name"
        description="Fee (Terra -> Kava Chain)"
        value="0.02 LUNA"
        inset
      />
    </ListItem>

    <ListItem label="Receive">
      <div>
        <AmountDisplay class="w-bold" :amount="{ amount: totalAmount, denom: 'uatom' }" />
      </div>
      <sub><ChainName name="cosmos-hub" /></sub>
    </ListItem>
  </List>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import { List, ListItem } from '@/components/ui/List';
import { RedeemAction } from '@/types/actions';

export default defineComponent({
  name: 'PreviewRedeem',

  components: {
    AmountDisplay,
    List,
    ListItem,
  },

  props: {
    data: {
      type: Object as PropType<RedeemAction>,
      required: true,
    },
  },

  setup(props) {
    const totalAmount = computed(() => {
      return (props.data as RedeemAction).params.reduce((acc, item) => acc + +item.amount, 0);
    });

    return {
      totalAmount,
    };
  },
});
</script>
