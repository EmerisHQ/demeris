<template>
  <div class="w-72 bg-surface rounded-2xl theme-inverse dark:theme-inverse text-text -text-1">
    <div class="px-5 pt-5 pb-4">
      <div class="flex items-start text-muted mb-1">
        <!-- TODO: handle case when 1 exchange is searched. (without the s) -->
        {{ numberOfExchangesSearched }} {{ $t('components.bestPrice.exchangesSearched') }}
        <StarIcon class="ml-auto" />
      </div>
      <div class="font-medium text-0">
        {{ $t('components.bestPrice.bestPriceFrom') }} <span class="text-positive-text capitalize">{{ dex }}</span>
      </div>
    </div>
    <hr class="border-border" />
    <div class="px-5 pt-4 pb-5">
      <div class="flex text-muted mb-3">
        {{ $t('components.bestPrice.expectedRate')
        }}<span class="ml-auto text-text font-medium">~{{ expectedRate }} {{ denom }}</span>
      </div>
      <div class="flex text-muted mb-3">
        {{ $t('components.bestPrice.limitPrice')
        }}<span class="ml-auto text-text font-medium">~{{ limitPrice }} {{ denom }}</span>
      </div>
      <div class="flex text-muted mb-3">
        {{ $t('components.bestPrice.maxSlippage')
        }}<span class="ml-auto text-text font-medium">{{ maxSlippage }}%</span>
      </div>
      <div class="flex text-muted">
        {{ $t('components.bestPrice.minReceived') }}<br />{{ $t('components.bestPrice.fullSwapped')
        }}<span class="ml-auto text-text font-medium"> {{ minReceived }} {{ denom }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import StarIcon from '@/components/common/Icons/StarIcon.vue';
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
    type: [Number, String],
    required: true,
  },
  maxSlippage: {
    type: Number,
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
// eslint-disable-next-line
const { t } = useI18n({ useScope: 'global' });
</script>
