<template>
  <div class="redeem-button">
    <RedeemIcon />
    <div v-if="redeemable.length > 0" class="redeem-button__badge" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import RedeemIcon from '@/components/common/Icons/RedeemIcon.vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'RedeemButton',
  components: { RedeemIcon },
  setup() {
    const store = useStore();

    const balances = store.getters['demeris/getAllBalances'];
    const redeemable = [];
    for (let balance of balances) {
      // TODO: check for redeemable
      redeemable.push(balance);
    }
    return { redeemable };
  },
});
</script>
<style lang="scss" scoped>
.redeem-button {
  font-size: 2.4rem;
  position: relative;
  line-height: 4rem;
  width: 4rem;
  height: 4rem;
  background: white;
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0.3rem 0.9rem 2.4rem rgba(0, 0, 0, 0.07);
  &__badge {
    position: absolute;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 0.6rem;
    overflow: hidden;
    background: #ff7d05;
    top: 0;
    right: 0rem;
  }
}
</style>
