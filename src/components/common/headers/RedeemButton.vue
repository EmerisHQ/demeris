<template>
  <div class="redeem-button w-12 h-12 rounded-3xl shadow-button">
    <RedeemIcon />
    <div
      v-if="redeemable.length > 0"
      class="redeem-button__badge absolute top-0 right-0 w-3 h-3 rounded-md bg-warning overflow-hidden"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

import RedeemIcon from '@/components/common/Icons/RedeemIcon.vue';
import { GlobalGetterTypes } from '@/store';

export default defineComponent({
  name: 'RedeemButton',
  components: { RedeemIcon },
  setup() {
    const store = useStore();

    const balances = store.getters[GlobalGetterTypes.API.getAllBalances];
    const redeemable = [];
    for (const balance of balances) {
      // TODO: check for redeemable
      redeemable.push(balance);
    }
    return { redeemable };
  },
});
</script>
<style lang="scss" scoped>
.redeem-button {
  font-size: 1.5rem;
  position: relative;
  line-height: 3rem;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
