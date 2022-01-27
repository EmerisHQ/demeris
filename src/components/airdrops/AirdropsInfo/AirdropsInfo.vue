<template>
  <div>
    <div class="flex">
      <InfoStarIcon class="mr-4" />
      <div>
        <p class="-text-2 text-muted mb-2">Introduction</p>
        <p>What is an airdrop? ↗️</p>
      </div>
    </div>
    <Divider extra-classes="ml-14 my-6" />
    <div class="flex">
      <InfoStarIcon class="mr-4" />
      <div>
        <p class="-text-2 text-muted mb-2">Community</p>
        <p>Feature your upcoming airdrop ↗️</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Divider from '@/components/ui/Divider.vue';

import InfoStarIcon from '../../common/Icons/InfoStarIcon.vue';

export default defineComponent({
  name: 'AirdropsInfo',

  components: {
    InfoStarIcon,
    Divider,
  },
});
</script>
