<template>
  <AppLayout>
    <div class="home">
      <div>Swap</div>
      <LiquiditySwap :is-dash-board="false" />
    </div>
  </AppLayout>
</template>

<script lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import LiquiditySwap from '@/components/LiquiditySwap.vue';
export default {
  name: 'Home',
  components: { AppLayout, LiquiditySwap },
};
</script>
