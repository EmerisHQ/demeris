<template>
  <div>
    <PreviewRedeem v-if="action.name === 'redeem'" :data="action" />
    <PreviewSwap v-else-if="action.name === 'swap'" :data="action" />
    <PreviewTransfer v-else-if="action.name === 'transfer'" :data="action" />
    <PreviewWithdrawLiquidity v-else-if="action.name === 'withdrawliquidity'" :data="action" />
    <PreviewAddLiquidity v-else-if="action.name === 'addliquidity'" :data="action" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Any } from '@/types/actions';

import PreviewAddLiquidity from './previews/PreviewAddLiquidity.vue';
import PreviewRedeem from './previews/PreviewRedeem.vue';
import PreviewSwap from './previews/PreviewSwap.vue';
import PreviewTransfer from './previews/PreviewTransfer.vue';
import PreviewWithdrawLiquidity from './previews/PreviewWithdrawLiquidity.vue';

export default defineComponent({
  name: 'Preview',

  components: {
    PreviewRedeem,
    PreviewSwap,
    PreviewTransfer,
    PreviewWithdrawLiquidity,
    PreviewAddLiquidity,
  },

  props: {
    action: {
      type: Object as PropType<Any>,
      required: true,
    },
  },
});
</script>
