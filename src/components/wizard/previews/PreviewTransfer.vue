<template>
  <List>
    <ListItem label="Amount">
      <div>
        <AmountDisplay class="w-bold" :amount="data.params.from.amount" />
      </div>
      <sub><ChainName :name="data.params.from.chain_name" /></sub>
    </ListItem>

    <ListItem label="Send Address" direction="column" collapsable collapsed>
      <Address :address="signedAddress" readonly />
    </ListItem>

    <ListItem description="Transaction Fee">
      <AmountDisplay class="s-minus" :amount="{ amount: '2', denom: 'uatom' }" />
    </ListItem>

    <ListItem label="Receive">
      <div>
        <AmountDisplay class="w-bold" :amount="data.params.from.amount" />
      </div>
      <sub><ChainName :name="data.params.to.chain_name" /></sub>
    </ListItem>

    <ListItem label="Recipient" direction="column">
      <Address :address="data.params.to.address" readonly />
    </ListItem>
  </List>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import Address from '@/components/ui/Address.vue';
import { List, ListItem } from '@/components/ui/List';
import useAccount from '@/composables/useAccount';
import { TransferAction } from '@/types/actions';

export default defineComponent({
  name: 'PreviewTransfer',

  components: {
    Address,
    AmountDisplay,
    ChainName,
    List,
    ListItem,
  },

  props: {
    data: {
      type: Object as PropType<TransferAction>,
      required: true,
    },
  },

  setup() {
    const { signedAddress } = useAccount();

    return { signedAddress };
  },
});
</script>
