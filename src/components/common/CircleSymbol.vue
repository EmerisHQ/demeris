<template>
  <div
    class="circle-symbol"
    :class="[`circle-symbol--${variant}`, `circle-symbol--${size}`, { 'circle-symbol--ringed': !isNativeChain }]"
  >
    <template v-if="variant === 'chain'">
      <div class="circle-symbol__ring" :style="ringStyle" />
    </template>

    <template v-else-if="isUnverified">
      <div class="circle-symbol__circle" :style="innerStyle">
        <div class="circle-symbol__badge" />
        <p class="circle-symbol__letter">{{ denoms[0] }}</p>
      </div>
    </template>

    <template v-else>
      <div v-if="!isNativeChain" class="circle-symbol__ring" :style="ringStyle" />
      <div class="circle-symbol__circle" :style="innerStyle">
        <img :src="symbolImage" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

type CircleSymbolVariant = 'asset' | 'chain';
type CircleSymbolSize = 'sm' | 'md' | 'lg';

import { useStore } from 'vuex';

import symbolsData from '@/data/symbols';
import { hexToRGB } from '@/utils/basic';

const defaultColors = {
  primary: '#E1E1E1',
  secondary: '#F4F4F4',
  tertiary: '#F9F9F9',
};

const findSymbolColors = (symbol: string) => {
  return symbolsData[symbol]?.colors || defaultColors;
};

export default defineComponent({
  name: 'CircleSymbol',

  props: {
    denoms: {
      type: [Array, String] as PropType<string[] | string>,
      default: undefined,
    },
    chainName: {
      type: String,
      default: undefined,
    },
    variant: {
      type: String as PropType<CircleSymbolVariant>,
      default: 'asset',
    },
    size: {
      type: String as PropType<CircleSymbolSize>,
      default: 'md',
    },
  },

  setup(props) {
    const store = useStore();

    const verifiedDenoms = computed(() => {
      return store.getters['demeris/getVerifiedDenoms'];
    });

    const isPoolCoin = computed(() => {
      if (props.variant === 'asset') {
        return Array.isArray(props.denoms) && props.denoms.length > 1;
      }

      return false;
    });

    const isUnverified = computed(() => {
      if (isPoolCoin.value) {
        return false;
      }

      if (props.variant === 'asset') {
        const denomConfig = verifiedDenoms.value.find((item) => item.name === (props.denoms as string));
        return !denomConfig?.verified;
      }

      return true;
    });

    const isNativeChain = computed(() => {
      if (props.chainName === undefined) {
        return true;
      }

      if (props.variant === 'asset' && !isPoolCoin.value) {
        const denomConfig = verifiedDenoms.value.find((item) => item.name === (props.denoms as string));
        return denomConfig?.chain_name === props.chainName;
      }

      return false;
    });

    const generateBackground = (colors: Record<string, string>) => {
      const hexArray = Object.values(colors).reverse();
      const positions = hexArray.length > 2 ? ['0%', '49%', '82%'] : ['0%', '82%'];
      const colorStops = [];

      for (const [index, hex] of Object.entries(hexArray)) {
        colorStops.push(`rgb(${hexToRGB(hex)}) ${positions[index]}`);
      }

      return `radial-gradient(
					ellipse farthest-corner at 16.67% 16.67%,
					${colorStops.join(',')}
				)`;
    };

    const innerStyle = computed(() => {
      let colors: Record<string, string> = {};

      if (isPoolCoin.value) {
        colors.primary = findSymbolColors(props.denoms[0]).primary;
        colors.secondary = findSymbolColors(props.denoms[1]).secondary;
      } else {
        colors = findSymbolColors(props.denoms as string);
      }

      const background = generateBackground(colors);
      const boxShadow = `rgba(${hexToRGB(colors.secondary)}, 0.5) 0px 2.4px 10px 1px`;

      return {
        background,
        boxShadow,
      };
    });

    const ringStyle = computed(() => {
      const colors = findSymbolColors(props.chainName as string);

      const background = generateBackground(colors);

      return {
        background,
      };
    });

    const symbolImage = computed(() => {
      if (isPoolCoin.value) {
        return;
      }

      return require(`@/assets/svg/symbols/${props.denoms as string}.svg`);
    });

    return {
      symbolImage,
      innerStyle,
      ringStyle,
      isUnverified,
      isNativeChain,
    };
  },
});
</script>

<style lang="scss" scoped>
.circle-symbol {
  border-radius: 2.6rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &--sm {
    width: 2.4rem;
    height: 2.4rem;
  }

  &--md {
    width: 3.2rem;
    height: 3.2rem;
  }

  &--lg {
    width: 4rem;
    height: 4rem;
  }

  &--ringed &__circle {
    width: 75%;
    height: 75%;
  }

  &__circle {
    width: 100%;
    height: 100%;
    border-radius: 2.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0.6rem;
  }

  &__ring {
    position: absolute;
    width: 100%;
    height: 100%;
    width: 100%;
    height: 100%;
    border-radius: 2.6rem;
    z-index: 0;
    flex-shrink: 0;
    box-shadow: none !important;

    &::before {
      position: absolute;
      content: '';
      inset: 2px;
      border-radius: 2.6rem;
      background: var(--bg);
    }
  }

  &__letter {
    text-transform: uppercase;
    font-weight: 600;
  }

  &__badge {
    // display: block;
    display: none;
    position: absolute;
    width: 1.2rem;
    height: 1.2rem;
    top: -0.3rem;
    right: 0;
    content: '';
    background: #ff7d05;
    border-radius: 2.6rem;
  }
}
</style>
