<template>
  <div class="w-72 bg-surface rounded-2xl theme-inverse dark:theme-inverse text-text -text-1">
    <div class="p-5">
      <div class="flex items-start text-muted">2 (change this) exchanges searched <StarIcon class="ml-auto" /></div>
      <div class="flex text-0">Emeris found the best price from<span>Gravity DEX</span></div>
    </div>
    <hr />
    <div class="p-5">
      <div class="flex text-muted">Expected rate <span class="ml-auto">~1.567 OSMO</span></div>
      <div class="flex text-muted">Limit price <span class="ml-auto">~1.555 OSMO</span></div>
      <div class="flex text-muted">Max slippage <span class="ml-auto">0.3%</span></div>
      <div class="flex text-muted">Min. received (if 100% swapped) <span class="ml-auto"> 996.90 OSMO</span></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import StarIcon from '@/components/common/Icons/StarIcon.vue';
</script>
<style lang="scss" scoped></style>
