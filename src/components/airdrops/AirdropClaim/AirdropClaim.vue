<template>
  <div class="wrapper w-full relative">
    <div class="claim-widget bg-surface dark:bg-fg rounded-2xl py-8 shadow-panel">
      <!-- Claim Header -->
      <div class="text-center">
        <div class="w-1/4 mx-auto mb-6">
          <img src="~@/assets/images/airdrop-logo.png" alt="Airdrop Logo" />
        </div>
        <p class="-text-1 text-muted mb-2">Your Airdrop amount</p>
        <p class="text-2 font-medium">126.54 LIKE</p>
      </div>

      <div class="px-6">
        <Divider extra-classes="my-8" />
      </div>

      <!-- Claim Details -->
      <div class="px-6 pb-6">
        <div class="flex justify-between font-medium mb-4">
          <p>Your balance</p>
          <p>126.54 LIKE</p>
        </div>
        <div class="flex justify-between -text-1 text-muted mb-4">
          <p>Snapshot Date</p>
          <p>Dec 8, 2021</p>
        </div>
        <div class="flex justify-between -text-1 text-muted mb-4">
          <p>Starts</p>
          <p>Jan 31, 2022</p>
        </div>
        <div class="flex justify-between -text-1 text-muted mb-4">
          <p>Ends</p>
          <p>Jan 31, 2022</p>
        </div>
      </div>

      <!-- Claim button -->
      <div class="px-6">
        <Button name="Claim" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import Divider from '@/components/ui/Divider.vue';

export default defineComponent({
  name: 'Swap',
  components: {
    Button,
    Divider,
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 20rem;
  /* min-height: 17rem; */
}

.claim-widget {
  min-height: 24rem;
}
</style>
