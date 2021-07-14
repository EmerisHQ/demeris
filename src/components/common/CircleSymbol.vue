<template>
  <div
    class="circle-symbol"
    :class="[`circle-symbol--${variant}`, `circle-symbol--${size}`, { 'circle-symbol--ringed': !isNativeChain }]"
  >
    <template v-if="variant === 'chain'">
      <div class="circle-symbol__ring" :style="ringStyle" />
    </template>

    <template v-else-if="!isVerified">
      <div class="circle-symbol__circle" :style="innerStyle">
        <div class="circle-symbol__badge" />
        <p class="circle-symbol__letter">{{ denoms[0]?.[0] || denom[0] }}</p>
      </div>
    </template>

    <template v-else-if="assetConfig">
      <img :src="assetConfig.logo" :alt="denom" class="circle-symbol__circle logo" />
      <div v-if="!isNativeChain" class="circle-symbol__ring" :style="ringStyle" />
      <img v-else alt="Logo glow" :src="assetConfig.logo" class="circle-symbol__logo-glow" />
    </template>

    <template v-else>
      <div v-if="!isNativeChain" class="circle-symbol__ring" :style="ringStyle" />
      <div class="circle-symbol__circle" :style="innerStyle">
        <img v-if="symbolImage" :src="symbolImage" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

type CircleSymbolVariant = 'asset' | 'chain';
type CircleSymbolSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

import { useStore } from 'vuex';

import usePools from '@/composables/usePools';
import symbolsData from '@/data/symbols';
import { Chains, VerifiedDenoms } from '@/types/api';
import { getBaseDenom } from '@/utils/actionHandler';
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
    denom: {
      type: String,
      default: '',
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
    const { pools, getReserveBaseDenoms } = usePools();

    const store = useStore();
    const denoms = ref<string[]>([]);
    const isLoaded = ref(false);

    const isPoolCoin = computed(() => {
      if (props.variant === 'asset') {
        return (props.denom as string).startsWith('pool');
      }

      return false;
    });

    const assetConfig = computed(() => {
      if (isPoolCoin.value) {
        return;
      }

      const verifiedDenoms: VerifiedDenoms = store.getters['demeris/getVerifiedDenoms'] || [];
      const chains: Chains = store.getters['demeris/getChains'] || [];

      const denomConfig = verifiedDenoms.find((item) => item.name === denoms.value[0]);

      if (!denomConfig) {
        return;
      }

      const chainConfig = chains[denomConfig.chain_name];

      return {
        ...denomConfig,
        logo: denomConfig.logo || chainConfig?.logo,
      };
    });

    const isVerified = computed(() => {
      if (!isLoaded.value) {
        return true;
      }

      if (isPoolCoin.value) {
        return true;
      }

      if (assetConfig.value) {
        return assetConfig.value.verified;
      }

      return true;
    });

    const isNativeChain = computed(() => {
      if (props.chainName === undefined) {
        return true;
      }

      if (props.variant === 'asset' && !isPoolCoin.value) {
        return assetConfig.value?.chain_name === props.chainName;
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
        colors.primary = findSymbolColors(denoms.value[0]).primary;
        colors.secondary = findSymbolColors('gdex').primary;
        colors.tertiary = findSymbolColors(denoms.value[1]).primary;
      } else {
        colors = findSymbolColors(denoms.value[0]);
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
        return require(`@/assets/svg/symbols/gdex.svg`);
      }

      return undefined;
    });

    watch(
      () => props.denom,
      async () => {
        if (!props.denom) {
          return;
        }
        if (isPoolCoin.value) {
          const pool = pools.value.find((pool) => pool.pool_coin_denom === (props.denom as string));
          if (pool) {
            denoms.value = await getReserveBaseDenoms(pool);
          }
        } else {
          denoms.value = [await getBaseDenom(props.denom as string, props.chainName)];
        }
        isLoaded.value = true;
      },
      { immediate: true },
    );

    return {
      assetConfig,
      denoms,
      innerStyle,
      isLoaded,
      isNativeChain,
      isVerified,
      ringStyle,
      symbolImage,
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
  width: var(--symbol-size);
  height: var(--symbol-size);

  &--xs {
    --symbol-size: 2rem;
  }

  &--sm {
    --symbol-size: 2.4rem;
  }

  &--md {
    --symbol-size: 3.2rem;
  }

  &--lg {
    --symbol-size: 4rem;
  }

  &--xl {
    --symbol-size: 9.6rem;
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
    z-index: 1;
    &:not(.logo) {
      padding: 0.6rem;
    }
  }

  &__logo-glow {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    filter: blur(calc(0.4 * var(--symbol-size)));
    top: 12.5%;
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
