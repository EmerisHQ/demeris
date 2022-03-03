<template>
  <div class="tooltip-pools">
    <p class="mb-4">{{ $t('components.asset.pooledTooltip') }}</p>
    <TooltipPool v-for="pool of availablePools" :key="pool.id" :pool="pool" :denom="denom" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import { Pool as PoolType } from '@/types/actions'

import TooltipPool from './TooltipPool.vue'

export default defineComponent({
  name: 'TooltipPools',

  components: {
    TooltipPool,
  },

  props: {
    pools: {
      type: Array as PropType<PoolType[]>,
      required: true,
    },
    limit: {
      type: Number,
      default: undefined,
    },
    denom: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const availablePools = computed(() => {
      return (props.pools as PoolType[]).slice(0, props.limit as number)
    })

    return {
      availablePools,
    }
  },
})
</script>
