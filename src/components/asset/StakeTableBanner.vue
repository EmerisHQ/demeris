<template>
  <section class="stake__banner relative border border-border rounded-2xl flex justify-between">
    <article class="w-1/2 p-6">
      <h3 class="text-1 font-bold">
        {{ $t('components.stakeTable.earnRewards') }} <Ticker v-if="denom" :name="denom" />
      </h3>
      <p class="text-muted leading-copy mt-3">
        {{ $t('components.stakeTable.lockUpAndEarnRewards') }}
        <a
          href="https://support.emeris.com/en/articles/5999925-staking-on-emeris-step-by-step-tutorial"
          target="_blank"
          class="font-medium hover:underline"
        >
          {{ $t('components.stakeTable.learnMore') }} &#x2197;
        </a>
      </p>
      <Button
        :name="
          denom ? $t('components.stakeTable.stakeAsset', { ticker: tickerName }) : $t('components.stakingBanner.cta')
        "
        class="mt-8"
        :full-width="false"
        @click="() => goToStakingPage()"
      />
    </article>

    <div
      class="grid place-content-center w-1/2 bg-contain bg-center bg-no-repeat"
      :style="`background-image: url(${stakeRings})`"
    >
      <CircleSymbol :denom="denom" size="xl" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

import stakeRings from '@/assets/images/stake-rings.png';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import useDenoms from '@/composables/useDenoms';
import { StakingActions } from '@/types/actions';
import { event } from '@/utils/analytics';

const { useDenom } = useDenoms();

const router = useRouter();
const props = defineProps<{ denom: string }>();

const { tickerName } = useDenom(props.denom);

const goToStakingPage = () => {
  if (props.denom) {
    event('staking_entry_point', { event_label: 'Asset Page Staking Banner Click', event_category: 'banner' });
    router.push(`/staking/${props.denom}/${StakingActions.STAKE}`);
  } else {
    event('staking_entry_point', { event_label: 'Portfolio Page Staking Banner Click', event_category: 'banner' });
    router.push(`/staking/stake-asset`);
  }
};
</script>
