<template>
  <div class="bg-fg p-4 rounded-2xl">
    <p class="-text-1 text-muted mb-4">Current Balance</p>
    <div class="flex justify-between items-center">
      <div class="w-10 h-10 mr-4">
        <img v-if="selectedAirdrop.tokenIcon" :src="selectedAirdrop.tokenIcon" alt="Airdrop Logo" />
        <div v-else class="w-10 h-10 bg-text text-inverse rounded-full text-center pt-1.5 text-1">
          {{ selectedAirdrop.chainName.slice(0, 1) }}
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
import { computed, defineComponent, toRaw } from 'vue';
import { useStore } from 'vuex';

import CaretRightIcon from '@/components/common/Icons/CaretRightIcon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';

export default defineComponent({
  name: 'AirdropsCurrentBalance',
  components: {
    CaretRightIcon,
  },

  setup() {
    const typedstore = useStore() as RootStoreTyped;

    const selectedAirdrop = computed(() => {
      return toRaw(typedstore.getters[GlobalGetterTypes.API.getSelectedAirdrop]);
    });

    return { selectedAirdrop };
  },
});
</script>
