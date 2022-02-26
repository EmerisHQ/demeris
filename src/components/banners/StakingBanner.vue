<template>
  <router-link
    class="staking-banner shadow-card w-full flex flex-col items-stretch p-6 relative rounded-2xl bg-cover transform hover:-translate-y-px active:transform-none active:opacity-70 transition text-text"
    :to="`/staking/${baseDenom}/stake`"
  >
    <h5 class="font-medium text-1">{{ $t('components.stakingBanner.title') }} {{ displayDenom }}</h5>
    <p class="staking-banner__text -text-1 leading-5 mt-3 text-muted">
      {{ $t('components.stakingBanner.text') }}
      <span class="text-text"> {{ apy || '-.-' }}% {{ $t('components.stakingBanner.textAPY') }} </span>
    </p>
    <p className="mt-3 ">{{ $t('components.stakingBanner.cta') }} &#8594;</p>
    <img :src="require(`@/assets/images/stake-panel-ephemeris.png`)" class="right-0 absolute top-0 h-full" />
    <div class="staking-banner__circles z-50 absolute right-0 top-0">
      <CircleSymbol :denom="baseDenom" custom-size="50px" />
      <CircleSymbol :denom="baseDenom" custom-size="26px" />
      <CircleSymbol :denom="baseDenom" custom-size="16px" />
    </div>
  </router-link>
</template>
<script lang="ts">
import BigNumber from 'bignumber.js';
import { defineComponent, ref, toRefs, watch } from 'vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import useStaking from '@/composables/useStaking';
export default defineComponent({
  name: 'StakingBanner',
  components: {
    CircleSymbol,
  },
  props: {
    displayDenom: {
      type: String,
      default: 'ATOM',
    },
    baseDenom: {
      type: String,
      default: 'uatom',
    },
  },
  setup(props) {
    const { baseDenom } = toRefs(props);
    const apy = ref<string>('');
    const { getChainDisplayInflationByBaseDenom } = useStaking();
    watch(
      () => baseDenom.value,
      async (newValue) => {
        if (!newValue) return;
        const inflation = await getChainDisplayInflationByBaseDenom(newValue);

        //   display -.- instead of a faulty 0 value APY
        if (isNaN(inflation) || Number(inflation) <= 0) return;
        apy.value = new BigNumber(inflation).toFixed(2);
      },
      { immediate: true },
    );
    return {
      apy,
    };
  },
});
</script>
<style lang="scss">
.staking-banner {
  background: #171717;
  height: 160px;
  &__text {
    width: 189px;
  }
  &__circles {
    > div {
      position: absolute;
    }
    > :first-child {
      top: 16px;
      right: 44px;
    }
    > :nth-child(2) {
      top: 74px;
      right: 31px;
    }
    > :last-child {
      top: 107px;
      right: 13px;
    }
  }
}
</style>
