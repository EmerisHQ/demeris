<template>
  <div
    class="circle-symbol relative flex items-center justify-center flex-shrink-0"
    :class="[`circle-symbol--${size}`, { 'opacity-40': validator.jailed }]"
  >
    <ValidatorImg :validator="validator" class="bg-text text-bg cursor-default" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import ValidatorImg from '@/components/common/ValidatorImg.vue';
import { DesignSizes } from '@/types/util';

export default defineComponent({
  name: 'ValidatorBadge',
  components: { ValidatorImg },
  props: {
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    size: {
      type: String as PropType<DesignSizes>,
      default: 'md',
    },
  },
});
</script>

<style lang="scss" scoped>
.circle-symbol {
  width: var(--symbol-size);
  height: var(--symbol-size);
  font-size: var(--font-size);

  &--xs {
    --symbol-size: 1rem;
    --font-size: theme('fontSize.-2');
  }

  &--sm {
    --symbol-size: 1.5rem;
    --font-size: theme('fontSize.-1');
  }

  &--md {
    --symbol-size: 2rem;
    --font-size: theme('fontSize.0');
  }

  &--lg {
    --symbol-size: 2.5rem;
    --font-size: theme('fontSize.1');
  }

  &--xl {
    --symbol-size: 6rem;
    --font-size: theme('fontSize.2');
  }
}
</style>
