<template>
  <ul class="list" :class="`list--${variant}`">
    <slot />
  </ul>
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
    & > .list-item + .list-item {
      border-top: 1px solid var(--border-trans);
    }
  }
}
</style>
