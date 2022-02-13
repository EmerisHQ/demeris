<template>
  <div>Swap Route</div>
  <div>X transc across Y chains</div>
  <Timeline />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Timeline from '@/components/ui/Timeline.vue';

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
