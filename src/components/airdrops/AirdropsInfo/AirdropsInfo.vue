<template>
  <div class="mt-8 flex justify-between bg-fg rounded-2xl relative">
    <div class="p-6">
      <p class="-text-1 mb-1 text-muted">Introduction</p>
      <p class="font-medium">What is an airdrop?</p>
    </div>

    <img :src="whatIsAirdropBg" alt="What is an airdrop" class="absolute right-0 rounded-2xl h-full" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import whatIsAirdropBg from '@/assets/images/what-is-airdrop-bg.png';

export default defineComponent({
  name: 'AirdropsInfo',
  setup() {
    return { whatIsAirdropBg };
  },
});
</script>
