<template>
  <AppLayout>
    <div class="wrapper">
      <div class="portfolio">
        <div>Portfolio</div>
      </div>
      <div class="swap">
        <LiquiditySwap />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import LiquiditySwap from '@/components/LiquiditySwap.vue';
import AppLayout from '@/layouts/AppLayout.vue';
export default {
  name: 'Portfolio',
  components: { AppLayout, LiquiditySwap },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  max-width: 1024px;
  margin: 0 auto;

  .portfolio {
    display: flex;
    flex: 1;
    width: 0;
    align-items: center;
    justify-content: space-evenly;

    background-color: rgb(172, 206, 207);
  }

  .swap {
    width: 0;
    flex: 1;
  }
}
</style>
