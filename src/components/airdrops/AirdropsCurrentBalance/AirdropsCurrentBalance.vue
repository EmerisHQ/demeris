<template>
  <div class="bg-fg p-4 rounded-2xl">
    <p class="-text-1 text-muted mb-4">Current Balance</p>
    <div class="flex justify-between items-center">
      <div class="w-10 h-10 mr-4">
        <img
          v-if="!imageLoadFail"
          :src="selectedAirdrop.tokenIcon"
          alt="Airdrop Logo"
          class="rounded-full"
          @error="() => (imageLoadFail = true)"
        />
        <div v-else class="w-10 h-10 bg-text text-inverse rounded-full text-center pt-1.5 text-1">
          {{ selectedAirdrop.project.slice(0, 2) }}
        </div>
      </div>
      <div class="w-10/12">
        <p class="font-medium">$1,234.56</p>
        <p class="-text-1 text-muted">1,234.56 LIKE</p>
      </div>
      <CaretRightIcon />
    </div>
  </div>
</template>

<script lang="ts">
import { EmerisAirdrops } from '@emeris/types';
import { defineComponent, PropType, ref } from 'vue';

import CaretRightIcon from '@/components/common/Icons/CaretRightIcon.vue';

export default defineComponent({
  name: 'AirdropsCurrentBalance',
  components: {
    CaretRightIcon,
  },

  props: {
    selectedAirdrop: {
      type: Object as PropType<EmerisAirdrops.Airdrop>,
      default: null,
    },
  },

  setup() {
    const imageLoadFail = ref(false);

    return { imageLoadFail };
  },
});
</script>
