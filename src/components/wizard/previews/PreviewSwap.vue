<template>
  <List>
    <ListItem>
      <ListItem label="Pay">
        <div>
          <AmountDisplay class="w-bold" :amount="data.params.from.amount" />
        </div>
        <sub><ChainName :name="data.params.from.chain_name" /></sub>
      </ListItem>
      <ListItem label="Receive" description="(estimated)">
        <div>
          <AmountDisplay class="w-bold" :amount="data.params.to.amount" />
        </div>
        <sub><ChainName :name="data.params.to.chain_name" /></sub>
      </ListItem>
    </ListItem>

    <ListItem label="Price" direction="column">
      <ListItem description="Min. received" hint="TODO" inset>
        <AmountDisplay class="s-minus" :amount="{ amount: 995, denom: 'uluna' }" />
      </ListItem>

      <ListItem description="Limit price" hint="TODO" inset>
        <span class="s-minus">2.84 LUNA = 1 KAVA</span>
      </ListItem>
    </ListItem>

    <ListItem label="Fees" direction="column">
      <ListItem description="Transaction fee" hint="TODO" inset>
        <AmountDisplay class="s-minus" :amount="{ amount: 1, denom: 'uluna' }" />
      </ListItem>

      <ListItem description="Swap Fee" hint="TODO" inset>
        <AmountDisplay class="s-minus" :amount="{ amount: 1, denom: 'uatom' }" />
      </ListItem>
    </ListItem>
  </List>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import { List, ListItem } from '@/components/ui/List';
import { SwapAction } from '@/types/actions';

export default defineComponent({
  name: 'PreviewSwap',

  components: {
    AmountDisplay,
    ChainName,
    List,
    ListItem,
  },

  props: {
    data: {
      type: Object as PropType<SwapAction>,
      required: true,
    },
  },
});
</script>
