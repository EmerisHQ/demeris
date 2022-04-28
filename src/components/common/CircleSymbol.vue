<template>
  <div
    class="circle-symbol relative flex items-center justify-center shrink-0 rounded-full"
    :style="[customSize && `height:${customSize};width:${customSize}`]"
    :class="[customSize === '' && `circle-symbol--${size}`, `circle-symbol--${variant}`]"
  >
    <template v-if="variant === 'chain'">
      <div
        class="circle-symbol__ring absolute w-full h-full rounded-full z-0 shrink-0 shadow-none"
        :style="ringStyle"
      />
    </template>

    <template v-else-if="!isVerified">
      <div
        class="w-full h-full rounded-full flex items-center justify-center relative z-10 p-1.5"
        :class="{ 'w-3/4 h-3/4': !isNativeChain }"
        :style="innerStyle"
      >
        <!-- Unverified asset badge -->
        <div class="hidden absolute w-3 h-3 -top-0.5 -mt-px right-0 bg-warning rounded-full" />
        <p class="uppercase font-bold">{{ denoms[0]?.[0] || denom[0] }}</p>
      </div>
    </template>

    <template v-else-if="assetConfig && !isPoolCoin">
      <img
        :src="assetConfig.logo"
        :alt="denom"
        class="w-full h-full rounded-full relative z-10"
        :class="{ 'w-3/4 h-3/4': !isNativeChain }"
      />
      <div
        v-if="!isNativeChain"
        class="circle-symbol__ring absolute w-full h-full rounded-full z-0 shrink-0 shadow-none"
        :style="ringStyle"
      />
      <img
        v-if="glow && customSize === ''"
        alt="Logo glow"
        :src="assetConfig.logo"
        class="circle-symbol__logo-glow absolute w-full h-full opacity-50 filter"
      />
    </template>

    <template v-else>
      <div
        v-if="!isNativeChain"
        class="circle-symbol__ring absolute w-full h-full rounded-full z-0 shrink-0 shadow-none"
        :style="ringStyle"
      />
      <div
        class="circle-symbol__logo-container w-full h-full rounded-full flex items-center justify-center relative z-10 m-auto"
        :class="{ 'w-3/4 h-3/4': !isNativeChain }"
        :style="innerStyle"
      >
        <img v-if="symbolImage" :src="symbolImage" class="w-full h-full rounded-full relative z-10" />
      </div>
    </template>

    <template v-if="variant === 'chain' || (assetConfig && !isPoolCoin) || isVerified">
      <svg class="absolute w-0 h-0">
        <defs>
          <clipPath :id="clipPathId" clipPathUnits="objectBoundingBox">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.5,0.938 C0.742,0.938,0.938,0.742,0.938,0.5 C0.938,0.258,0.742,0.063,0.5,0.063 C0.258,0.063,0.063,0.258,0.063,0.5 C0.063,0.742,0.258,0.938,0.5,0.938 M0.5,1 C0.776,1,1,0.776,1,0.5 C1,0.224,0.776,0,0.5,0 C0.224,0,0,0.224,0,0.5 C0,0.776,0.224,1,0.5,1"
            />
          </clipPath>
        </defs>
      </svg>
    </template>
    <CircleSymbolStatus
      v-if="assetConfig?.chain_name && displayStatus"
      :chain-name="assetConfig.chain_name"
      :denom="denom"
      :size="size"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable max-lines-per-function */
/*
 * when customSize is set glow is forced to false
 */
import { EmerisAPI } from '@emeris/types';
import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';

import gdexSvg from '@/assets/svg/symbols/gdex.svg';
import CircleSymbolStatus from '@/components/common/CircleSymbolStatus.vue';
import usePools from '@/composables/usePools';
import symbolsData from '@/data/symbols';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { DesignSizes } from '@/types/util';
import { getBaseDenom } from '@/utils/actionHandler';
import { hexToRGB } from '@/utils/basic';

type CircleSymbolVariant = 'asset' | 'chain';

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

  components: {
    CircleSymbolStatus,
  },

  props: {
    displayStatus: {
      type: Boolean,
      default: true,
    },
    denom: {
      type: String,
      default: '',
    },
    poolDenoms: {
      type: Array as PropType<string[]>,
      default: () => [],
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
      type: String as PropType<DesignSizes>,
      default: 'md',
    },
    customSize: {
      type: String,
      default: '',
    },
    logo: {
      type: Boolean,
      default: true,
    },
    glow: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    const { pools, getReserveBaseDenoms } = usePools();

    const typedstore = useStore() as RootStoreTyped;
    const denoms = ref<string[]>([]);
    const isLoaded = ref(false);

    const isPoolCoin = computed(() => {
      if (props.variant === 'asset') {
        return (props.denom as string).startsWith('pool') || props.poolDenoms.length > 0;
      }

      return false;
    });

    const assetConfig = computed(() => {
      const verifiedDenoms = typedstore.getters[GlobalGetterTypes.API.getVerifiedDenoms] || [];
      const chains = typedstore.getters[GlobalGetterTypes.API.getChains] || ([] as EmerisAPI.Chain[]);

      const denomConfig = verifiedDenoms.find((item) => item.name === props.denom || item.name === denoms.value[0]);

      if (!denomConfig) {
        return;
      }

      const chainConfig = chains[denomConfig.chain_name];
      denomConfig.logo = denomConfig.logo || chainConfig?.logo;

      return { ...denomConfig };
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

      if (props.variant === 'asset') {
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

    const clipPathId =
      'clip-' +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(2, 10);

    const ringStyle = computed(() => {
      const colors = findSymbolColors(props.chainName as string);

      const background = generateBackground(colors);
      const clipPath = `url(#${clipPathId})`;

      return {
        background,
        clipPath,
      };
    });

    const symbolImage = computed(() => {
      if (isPoolCoin.value) {
        return gdexSvg;
      }

      return undefined;
    });

    watch(
      () => toRefs(props),
      async () => {
        if (isPoolCoin.value) {
          let existingPool = pools.value?.find((pool) => pool.pool_coin_denom === (props.denom as string));

          if (existingPool) {
            denoms.value = await getReserveBaseDenoms(existingPool);
          } else if (props.poolDenoms.filter(Boolean).length) {
            denoms.value = await Promise.all(props.poolDenoms.map((item) => getBaseDenom(item, props.chainName)));
          }
        } else {
          let baseDenom = props.denom;
          try {
            baseDenom = await getBaseDenom(props.denom as string, props.chainName);
          } catch {
            //
          }
          denoms.value = [baseDenom];
        }
        isLoaded.value = true;
      },
      { immediate: true },
    );

    return {
      assetConfig,
      denoms,
      innerStyle,
      isPoolCoin,
      isLoaded,
      isNativeChain,
      isVerified,
      clipPathId,
      ringStyle,
      symbolImage,
    };
  },
});
</script>

<style lang="scss" scoped>
.circle-symbol {
  width: var(--symbol-size);
  height: var(--symbol-size);

  &--xs {
    --symbol-size: 1rem;
  }

  &--sm {
    --symbol-size: 1.5rem;
  }

  &--md {
    --symbol-size: 2rem;
  }

  &--lg {
    --symbol-size: 2.5rem;
  }

  &--xl {
    --symbol-size: 6rem;
  }

  &__logo-glow {
    filter: blur(calc(0.4 * var(--symbol-size)));
    top: 12.5%;
  }

  &__logo-container {
    padding: 12.5%;
  }
}
</style>
