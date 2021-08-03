<template>
  <div class="list" :class="{ 'border-t border-b border-border divide-y divide-border': variant === 'divided' }">
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

<style lang="scss"></style>
