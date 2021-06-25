<template>
  <div>
    <PreviewRedeem v-if="action.name === 'redeem'" :data="action" />
    <PreviewSwap v-else-if="action.name === 'swap'" :data="action" />
    <PreviewTransfer v-else-if="action.name === 'transfer'" :data="action" />
    <PreviewWithdrawLiquidity v-else-if="action.name === 'withdrawliquidity'" :data="action" />

    <Button name="Confirm and continue" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

import Button from '@/components/ui/Button.vue';
import { Any } from '@/types/actions';

import PreviewRedeem from './previews/PreviewRedeem.vue';
import PreviewSwap from './previews/PreviewSwap.vue';
import PreviewTransfer from './previews/PreviewTransfer.vue';
import PreviewWithdrawLiquidity from './previews/PreviewWithdrawLiquidity.vue';

export default defineComponent({
  name: 'Preview',

  components: {
    Button,
    PreviewRedeem,
    PreviewSwap,
    PreviewTransfer,
    PreviewWithdrawLiquidity,
  },

  props: {
    action: {
      type: Object as PropType<Any>,
      required: true,
    },
  },
});
</script>
