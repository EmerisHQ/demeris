<template>
  <div v-for="item in items" :key="item" class="flex flex-col timeline-block p-4">
    <slot name="item" v-bind="item"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SwapRoute',
  components: {},
  props: {
    items: {
      type: Array,
      default: null,
    },
  },
  setup() {
    console.log('some');
  },
});
</script>
<style lang="scss" scoped>
.timeline-block {
  border-left: 4px;
  border-left-width: thick;
}
</style>
