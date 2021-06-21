<template>
  <div :class="coinData.on_chain !== 'cosmos' ? 'coin-image-with-ring' : 'coin-image'" :style="ringStyle">
    <img :src="require(`@/assets/coins/atom.png`)" :alt="coinData.denom" :style="coinImageStyle" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'CoinImageWithRing',
  props: {
    coinData: { type: Object, required: true },
    normalSize: { type: Number, default: 3.2 },
    withRingSize: { type: Number, default: 2.4 },
  },
  setup(props) {
    const ringStyle = `width: ${props.normalSize}`;
  },
});
</script>
<style lang="scss" scoped>
.coin-image {
  width: 3.2rem;
  height: 3.2rem;
}

.coin-image-with-ring {
  @extend .coin-image;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid blueviolet;
  border-radius: 50%;

  img {
    width: 2.4rem;
    height: 2.4rem;

    margin: 0.4rem;
  }
}
</style>
