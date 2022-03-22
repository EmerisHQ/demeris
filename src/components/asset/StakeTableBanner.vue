<template>
  <div
    class="stake__banner relative border border-border rounded-2xl p-6 flex flex-col justify-between bg-right bg-no-repeat"
  >
    <div class="flex-1 max-w-xs">
      <h3 class="text-1 font-bold">{{ $t('components.stakeTable.earnRewards') }} <Ticker :name="denom" /></h3>
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
    </div>

    <Button
      :name="$t('components.stakeTable.stakeAsset', { ticker: tickerName })"
      class="mt-8"
      :full-width="false"
      @click="() => goToStakingPage()"
    />

    <div class="absolute top-1/2 right-32 transform -translate-y-1/2">
      <CircleSymbol :denom="denom" size="xl" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

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
  event('staking_entry_point', { event_label: 'Asset Page Staking Banner Click', event_category: 'banner' });
  router.push(`/staking/${props.denom}/${StakingActions.STAKE}`);
};
</script>
