<template>
  <tippy
    v-if="chainName && chainDown"
    max-width="280px"
    class="status absolute z-10 top-0 left-0"
    :class="`status--${size}`"
    name="tooltipTrigger"
  >
    <div class="dot bg-negative h-2 w-2 rounded absolute top-0 right-0" :class="`dot--${size}`" />

    <template #content>
      {{ $t('generic_cta.chainDown', { displayChain }) }}
      {{ $t('generic_cta.balancesInaccurate') }}
    </template>
  </tippy>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { DesignSizes } from '@/types/util';

interface Props {
  denom?: string;
  chainName?: string;
  size?: DesignSizes;
}

const props = withDefaults(defineProps<Props>(), {
  denom: undefined,
  chainName: undefined,
  size: 'md',
});

const typedstore = useStore() as RootStoreTyped;

const displayChain = computed(() => {
  const displayName = typedstore.getters[GlobalGetterTypes.API.getDisplayChain]({ name: props.chainName });
  return displayName || props.chainName;
});

const chainDown = computed(() => {
  const chainStatus = typedstore.getters[GlobalGetterTypes.API.getChainStatus]({
    chain_name: props.chainName,
  });
  return !chainStatus;
});
</script>

<style lang="scss" scoped>
.status {
  width: var(--symbol-size);
  height: var(--symbol-size);

  &--xs {
    --symbol-size: 1rem;
  }

  &--sm {
    --symbol-size: 1.5rem;
  }

  &--md {
    --symbol-size: 2rem;
  }

  &--lg {
    --symbol-size: 2.5rem;
  }

  &--xl {
    --symbol-size: 6rem;
  }
}

.dot {
  width: var(--dot-size);
  height: var(--dot-size);

  &--xs {
    --dot-size: 0.25rem;
  }

  &--sm {
    --dot-size: 0.375rem;
  }

  &--md {
    --dot-size: 0.5rem;
  }

  &--lg {
    --dot-size: 0.625rem;
  }

  &--xl {
    --dot-size: 1.5rem;
  }
}
</style>
