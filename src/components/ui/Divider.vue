<template>
  <div class="divider" :class="extraClasses"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Divider',
  props: {
    extraClasses: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
.divider {
  height: 1px;
  background: rgba($color: #000000, $alpha: 0.1);
}
</style>
