<template>
  <div
    class="list"
    :class="{ 'border-border divide-y divide-border': variant === 'divided', 'border-t border-b': bordered }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'List',
  props: {
    variant: {
      type: String as PropType<'divided' | 'none'>,
      default: 'divided',
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  },
})
</script>

<style lang="scss"></style>
