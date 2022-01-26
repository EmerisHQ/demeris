<template>
  <div>
    <div class="flex">
      <InfoStarIcon class="mr-4" />
      <div>
        <p class="-text-2 text-muted mb-2">Introduction</p>
        <p>What is an airdrop? ↗️</p>
      </div>
    </div>
    <div class="divider"></div>
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

import InfoStarIcon from '../../common/Icons/InfoStarIcon.vue';

export default defineComponent({
  name: 'AirdropsInfo',

  components: {
    InfoStarIcon,
  },
});
</script>

<style lang="scss" scoped>
.divider {
  margin: 1.5rem 0 1.5rem 3.5rem;
  height: 1px;
  background: rgba($color: #000000, $alpha: 0.1);
}
</style>
