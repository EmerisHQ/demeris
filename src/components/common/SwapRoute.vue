<template>
  <div>Swap Route</div>
  <div>X transc across Y chains</div>
  <!-- <div v-for="item in items" :key="item" class="flex flex-col timeline-block p-4">
    <span>
      icon {{ item.denom }} &bull; {{ item.chain }}
      <div v-for="subItem in item?.subItems" :key="subItem">
        <span>sub fixed icon</span>
        <span>{{ subItem }}</span>
      </div>
    </span>
  </div> -->
  <Timeline
    :items="[
      { denom: 'atom', chain: 'somcahin', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'iris', chain: 'irischain', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'osmo', chain: 'osmo', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'lastcoin', chain: 'lastchain' },
    ]"
  >
    <template #item="{ denom, chain, subItems }">
      <div>
        icon {{ denom }} &bull; {{ chain }}
        <template v-for="subItem in subItems" :key="subItem">
          <span>sub fixed icon {{ subItem }} </span>
          <!-- <span>{{ subItem }}</span> -->
        </template>
      </div>
    </template>
  </Timeline>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { defineComponent, ref } from 'vue';

import Timeline from '@/components/common/Timeline.vue';

export default defineComponent({
  name: 'SwapRoute',
  components: {
    Timeline,
  },
  props: {},
  setup() {
    console.log('some');
    // console.log('some');
    const items = ref([
      { denom: 'atom', chain: 'somcahin', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'iris', chain: 'irischain', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'osmo', chain: 'osmo', subItems: ['Transfer x', 'Swap Y'] },
      { denom: 'lastcoin', chain: 'lastchain' },
    ]);
    return { items };
  },
});
</script>
<style lang="scss" scoped></style>
