<template>
  <AppLayout>
    <div class="home">
      <div>DashBoard</div>
      <LiquiditySwap :is-dash-board="true" />
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
