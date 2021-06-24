<template>
  <List>
    <ListItem>
      <ListItem label="Pay">
        <div>
          <AmountDisplay class="w-bold" :amount="data.from" />
        </div>
        <sub>Cosmos Hub</sub>
      </ListItem>
      <ListItem label="Receive" description="(estimated)">
        <div>
          <AmountDisplay class="w-bold" :amount="data.to" />
        </div>
        <sub>Terra</sub>
      </ListItem>
    </ListItem>

    <ListItem label="Price" direction="column">
      <ListItem description="Min. received" hint="TODO">
        <AmountDisplay class="s-minus" :amount="{ amount: 995, denom: 'uluna' }" />
      </ListItem>

      <ListItem description="Limit price" hint="TODO">
        <span class="s-minus">2.84 LUNA = 1 KAVA</span>
      </ListItem>
    </ListItem>

    <ListItem label="Fees" direction="column">
      <ListItem description="Transaction fee" hint="TODO">
        <AmountDisplay class="s-minus" :amount="{ amount: 1, denom: 'uluna' }" />
      </ListItem>

      <ListItem description="Swap Fee" hint="TODO">
        <AmountDisplay class="s-minus" :amount="{ amount: 1, denom: 'uatom' }" />
      </ListItem>
    </ListItem>
  </List>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import { List, ListItem } from '@/components/ui/List';
import { SwapData } from '@/types/actions';

export default defineComponent({
  name: 'PreviewSwap',

  components: {
    AmountDisplay,
    List,
    ListItem,
  },

  props: {
    data: {
      type: Object as PropType<SwapData>,
      required: true,
    },
  },
});
</script>
