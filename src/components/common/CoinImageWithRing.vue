<template>
  <div class="coin-image" :style="ringStyle">
    <img :src="atomImg" :alt="coinData.denom" :style="coinImageStyle" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

import atomImg from '@/assets/coins/atom.png';

export default defineComponent({
  name: 'CoinImageWithRing',
  props: {
    coinData: { type: Object, required: true },
    normalSize: { type: Number, default: 2 },
    withRingImageSize: { type: Number, default: 1.5 },
  },
  setup(props: { coinData: Record<string, unknown>; normalSize: number; withRingImageSize: number }) {
    let outer = '';
    let inner = '';

    if (props.coinData.on_chain !== 'cosmos') {
      outer = `width: ${props.normalSize}rem; height:${props.normalSize}rem; border:1px solid green; border-radius: 50%;`;
      inner = `width: ${props.withRingImageSize}rem; height:${props.withRingImageSize}rem; margin: ${
        (props.normalSize - props.withRingImageSize) / 2
      }rem`;
    } else {
      outer = `width: ${props.normalSize}rem; height:${props.normalSize}rem;`;
    }

    const ringStyle = ref(outer);
    const coinImageStyle = ref(inner);
    return { atomImg, ringStyle, coinImageStyle };
  },
});
</script>
<style lang="scss" scoped>
.coin-image {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
