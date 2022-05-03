<template>
  <div class="w-72 bg-surface rounded-2xl theme-inverse dark:theme-inverse text-text -text-1">
    <div class="px-5 pt-5 pb-4">
      <div class="flex items-start text-muted mb-1">
        {{ numberOfExchangesSearched }}
        {{
          numberOfExchangesSearched <= 1
            ? $t('components.bestPrice.exchangeSearched')
            : $t('components.bestPrice.exchangeSearched')
        }}
        <StarIcon class="ml-auto text-[1rem]" />
      </div>
      <div class="font-medium text-0">
        {{ $t('components.bestPrice.bestPriceFrom') }} <span class="text-positive-text capitalize">{{ dex }}</span>
      </div>
    </div>
    <hr class="border-border" />
    <div class="px-5 pt-4 pb-5">
      <div class="flex text-muted mb-3">
        {{ $t('components.bestPrice.expectedRate') }}
        <span class="ml-auto text-text font-medium text-right">~<AmountDisplay :amount="expectedAmount" /></span>
      </div>
      <div class="flex text-muted mb-3">
        {{ $t('components.bestPrice.limitPrice')
        }}<span class="ml-auto text-text font-medium text-right">~<AmountDisplay :amount="limitAmount" /></span>
      </div>
      <div class="flex text-muted mb-3">
        {{ $t('components.bestPrice.maxSlippage')
        }}<span class="ml-auto text-text font-medium text-right">{{ maxSlippage }}%</span>
      </div>
      <div class="flex text-muted">
        {{ $t('components.bestPrice.minReceived') }}<br />{{ $t('components.bestPrice.fullSwapped')
        }}<span class="ml-auto text-text font-medium text-right"> <AmountDisplay :amount="minAmount" /></span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import StarIcon from '@/components/common/Icons/StarIcon.vue';
import { amountToUnit } from '@/features/swap/logic';

// eslint-disable-next-line
const props = defineProps({
  numberOfExchangesSearched: {
    type: Number,
    required: true,
  },
  dex: {
    type: String,
    required: true,
  },
  expectedRate: {
    type: String,
    required: true,
  },
  limitPrice: {
    type: String,
    required: true,
  },
  maxSlippage: {
    type: [String, Number],
    required: true,
  },
  minReceived: {
    type: String,
    required: true,
  },
  denom: {
    type: String,
    required: true,
  },
});

const expectedAmount = computed(() => amountToUnit({ amount: props.expectedRate, denom: props.denom }));
const limitAmount = computed(() => amountToUnit({ amount: props.limitPrice, denom: props.denom }));
const minAmount = computed(() => amountToUnit({ amount: props.minReceived, denom: props.denom }));
</script>
