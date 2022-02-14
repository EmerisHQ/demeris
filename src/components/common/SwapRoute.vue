<template>
  <div>Swap Route</div>
  <div>X transc across Y chains</div>
  <Timeline
    :items="[
      { denom: 'atom', chain: 'somcahin', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'iris', chain: 'irischain', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'osmo', chain: 'osmo', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'lastcoin', chain: 'lastchain' },
    ]"
  >
    <template #item="{ denom, chain, subItems }">
      <span>icon {{ denom }} &bull; {{ chain }}</span>
      <div v-for="subItem in subItems" :key="subItem">
        <span>sub fixed icon</span>
        <span>{{ subItem }}</span>
      </div>
    </template>
  </Timeline>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Timeline from '@/components/common/Timeline.vue';

export default defineComponent({
  name: 'SwapRoute',
  components: {
    Timeline,
  },
  props: {},
  setup() {
    console.log('some');
  },
});
</script>
<style lang="scss" scoped></style>
