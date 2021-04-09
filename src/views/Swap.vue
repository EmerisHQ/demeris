<template>
  <AppLayout>
    <div class="wrapper">
      <LiquiditySwap :is-dash-board="false" />
    </div>
  </AppLayout>
</template>

<script lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import LiquiditySwap from '@/components/LiquiditySwap.vue';
export default {
  name: 'Swap',
  components: { AppLayout, LiquiditySwap },
};
</script>
