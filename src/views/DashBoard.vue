<template>
  <AppLayout>
    <div class="wrapper">
      <div class="dashboard">
        <div>DashBoard</div>
      </div>
      <div class="swap">
        <LiquiditySwap />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import LiquiditySwap from '@/components/LiquiditySwap.vue';
export default {
  name: 'DashBoard',
  components: { AppLayout, LiquiditySwap },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;

  .dashboard {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-evenly;

    background-color: rgb(172, 206, 207);
  }

  .swap {
    flex: 1;
  }
}
</style>