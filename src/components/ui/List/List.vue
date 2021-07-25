<template>
  <div class="list" :class="`list--${variant}`">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'List',
  props: {
    variant: {
      type: String as PropType<'divided' | 'none'>,
      default: 'divided',
    },
  },
});
</script>

<style lang="scss">
.list {
  &--divided {
    & > .list-item:not(.list-item--inset) + .list-item {
      border-top: 1px solid var(--border);
    }
  }
}
</style>
