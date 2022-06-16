<template>
  <a
    v-if="shouldShowBanner"
    class="staking-banner theme-inverse dark:theme-inverse bg-app shadow-card w-full flex flex-col justify-between items-stretch p-6 relative rounded-2xl bg-cover transform hover:-translate-y-px active:transform-none active:opacity-70 transition text-text"
    href="https://support.emeris.com/en/articles/5999925-staking-on-emeris-step-by-step-tutorial"
    target="_blank"
    @click="onBannerClick"
  >
    <h5 class="font-bold text-1">{{ $t('components.stakingBanner.startStaking') }}</h5>
    <p class="staking-banner__text -text-1 leading-5 text-muted">{{ $t('components.stakingBanner.text') }} &#x2197;</p>
    <img :src="stakePanel" class="right-0 rounded-2xl absolute top-0 h-full z-0" />
    <img :src="panelGradient" class="right-0 rounded-2xl absolute top-0 h-full z-10" />
    <div class="staking-banner__circles z-50 absolute right-0 top-0">
      <CircleSymbol :display-status="false" :denom="baseDenom" custom-size="50px" />
      <CircleSymbol :display-status="false" :denom="baseDenom" custom-size="26px" />
      <CircleSymbol :display-status="false" :denom="baseDenom" custom-size="16px" />
    </div>
  </a>
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js';
import { onMounted, ref, toRefs, watch } from 'vue';

import stakePanel from '@/assets/images/stake-panel-ephemeris.png';
import panelGradient from '@/assets/images/stakie-panel-gradient.png';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import useChains from '@/composables/useChains';
import useStaking from '@/composables/useStaking';
import { event } from '@/utils/analytics';

interface Props {
  displayDenom?: string;
  baseDenom?: string;
}

const props = withDefaults(defineProps<Props>(), { displayDenom: 'ATOM', baseDenom: 'uatom' });

const { getChainNameByBaseDenom } = useChains();
const { getChainDisplayInflationByBaseDenom } = useStaking();

const shouldShowBanner = ref<boolean>(false);

const onBannerClick = () => {
  event('staking_entry_point', { event_label: 'Portfolio Page Staking Banner Click', event_category: 'banner' });
};

const propsRef = toRefs(props);
const apr = ref<string>('');
const chainName = ref<string>(null);

onMounted(async () => {
  chainName.value = await getChainNameByBaseDenom(propsRef.baseDenom.value);
});

watch(
  chainName,
  async (newValue) => {
    if (!newValue) return;
    const inflation = await getChainDisplayInflationByBaseDenom(propsRef.baseDenom.value);
    if (inflation === null || isNaN(inflation)) return;
    apr.value = inflation > 0 ? new BigNumber(inflation).toFixed(2) : '-.-';
    shouldShowBanner.value = true;
  },
  { immediate: true },
);
</script>
<style lang="scss">
.staking-banner {
  height: 160px;
  &__text {
    width: 232px;
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
