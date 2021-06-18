<template>
  <div
    class="circle-symbol"
    :class="[
      `circle-symbol--${variant}`,
      `circle-symbol--${size}`,
      { 'circle-symbol--unverified': isUnverified },
      { 'circle-symbol--ringed': !isNativeChain && !isUnverified },
    ]"
  >
    <template v-if="variant === 'chain'">
      <div class="circle-symbol__ring" :style="ringStyle" />
      <div class="circle-symbol__chain-inner" />
    </template>

    <template v-else-if="isUnverified">
      <div class="circle-symbol__inner" :style="innerStyle">
        <div class="circle-symbol__badge" />
        <p class="circle-symbol__letter">{{ letter }}</p>
      </div>
    </template>

    <template v-else>
      <div v-if="!isNativeChain" class="circle-symbol__ring" :style="ringStyle" />
      <div class="circle-symbol__inner" :style="innerStyle" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

type CircleSymbolVariant = 'asset' | 'chain';
type CircleSymbolSize = 'sm' | 'md' | 'lg';

import { denomsExtraConfig } from '@/config';

const findRGBColorByDenom = (denom: string, type: 'primary' | 'secondary') => {
  return denomsExtraConfig[denom]?.colors[type]?.rgb;
};

const findRGBColorByChain = (chain: string, type: 'primary' | 'secondary') => {
  return Object.values(denomsExtraConfig).find((item) => item.defaultChainName === chain)?.colors[type]?.rgb;
};

const defaultColors = {
  primary: '85, 85, 85',
  secondary: '125, 125, 125',
};

const generateBackground = (primary = defaultColors.primary, secondary = defaultColors.secondary) => {
  return `linear-gradient(115deg, rgb(${primary}) 0%, rgb(${secondary}) 100%)`;
};

export default defineComponent({
  name: 'CircleSymbol',

  props: {
    denoms: {
      type: [Array, String] as PropType<string[] | string>,
      default: undefined,
    },
    chain: {
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
    const isPoolToken = computed(() => {
      if (props.variant === 'asset') {
        return Array.isArray(props.denoms) && props.denoms.length > 1;
      }

      return false;
    });

    const isNativeChain = computed(() => {
      if (props.variant === 'asset' && !isPoolToken.value) {
        if (props.chain === undefined) {
          return true;
        }

        return denomsExtraConfig[props.denoms as string]?.defaultChainName === props.chain;
      }

      return true;
    });

    const isUnverified = computed(() => {
      if (isPoolToken.value) {
        return false;
      }

      if (props.variant === 'asset') {
        return denomsExtraConfig[Array.isArray(props.denoms) ? props.denoms[0] : props.denoms] === undefined;
      }

      return true;
    });

    const letter = computed(() => {
      return props.denoms[0];
    });

    const innerStyle = computed(() => {
      let primary: string;
      let secondary: string;

      if (isPoolToken.value) {
        primary = findRGBColorByDenom(props.denoms[0], 'primary');
        secondary = findRGBColorByDenom(props.denoms[1], 'primary');
      } else {
        primary = findRGBColorByDenom(props.denoms as string, 'primary');
        secondary = findRGBColorByDenom(props.denoms as string, 'secondary');
      }

      const background = generateBackground(primary, secondary);
      const boxShadow = `0px 2.4px 6.4px rgba(${primary}, 0.28)`;

      return {
        background,
        boxShadow,
      };
    });

    const ringStyle = computed(() => {
      const primary = findRGBColorByChain(props.chain as string, 'primary');
      const secondary = findRGBColorByChain(props.chain as string, 'secondary');

      const background = generateBackground(primary, secondary);

      return {
        background,
      };
    });

    return {
      innerStyle,
      ringStyle,
      letter,
      isNativeChain,
      isUnverified,
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
  color: white;

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

  &--ringed {
    padding: 0.2rem;
  }

  &--ringed &__inner {
    border: 2px solid white;
  }

  &__inner {
    width: 100%;
    height: 100%;
    border-radius: 2.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  &__ring {
    position: absolute;
    width: 100%;
    height: 100%;
    width: 100%;
    height: 100%;
    border-radius: 2.6rem;
    z-index: -1;
    box-shadow: none !important;
  }

  &__chain-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 2.6rem;
    width: 85%;
    height: 85%;
    background: var(--bg);
  }

  &__letter {
    text-transform: uppercase;
    font-weight: 600;
  }

  &__badge {
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
