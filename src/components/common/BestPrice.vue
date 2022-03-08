<template>
  <div class="w-72 bg-surface rounded-2xl theme-inverse dark:theme-inverse text-text -text-1">
    <div class="px-5 pt-5 pb-4">
      <div class="flex items-start text-muted mb-1">
        {{ numberOfExchangesSearched }} exchanges searched <StarIcon class="ml-auto" />
      </div>
      <div class="title text-0">
        Emeris found the best price from <span class="text-positive-text capitalize">{{ dex }}</span>
      </div>
    </div>
    <hr class="border-border" />
    <div class="px-5 pt-4 pb-5">
      <div class="flex text-muted mb-3">
        Expected rate <span class="ml-auto text-text">~{{ expectedRate }} {{ denom }}</span>
      </div>
      <div class="flex text-muted mb-3">
        Limit price <span class="ml-auto text-text">~{{ limitPrice }}{{ denom }}</span>
      </div>
      <div class="flex text-muted mb-3">
        Max slippage <span class="ml-auto text-text">{{ maxSlippage }}%</span>
      </div>
      <div class="flex text-muted">
        Min. received <br />(if 100% swapped) <span class="ml-auto text-text"> {{ minReceived }} {{ denom }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import StarIcon from '@/components/common/Icons/StarIcon.vue';
// because props is unused
// eslint-disable-next-line
const props = defineProps({
  numberOfExchangesSearched: {
    type: Number,
    required: true,
  },
  dex: {
    type: String,
    required: true,
  },
  expectedRate: {
    type: String,
    required: true,
  },
  limitPrice: {
    type: Number,
    required: true,
  },
  maxSlippage: {
    type: Number,
    required: true,
  },
  minReceived: {
    type: Number,
    required: true,
  },
  denom: {
    type: String,
    required: true,
  },
});
</script>
<style lang="scss" scoped>
.title {
  font-weight: 600;
}
.value {
  font-weight: 500;
}
</style>
