<template>
  <div
    class="max-w-lg flex flex-col space-y-5 items-center justify-centerw-full"
    :class="isSwapComponent ? 'pb-6' : 'pb-16'"
  >
    <Icon name="TimeIcon" class="opacity-60" :icon-size="3.5" />

    <h1 class="font-bold pb-4 text-center" :class="isSwapComponent ? 'text-2' : 'text-3'">
      {{ $t('context.transactions.waitingPrevious.title', { type: transactionNameMap[transaction.name] }) }}
    </h1>

    <p class="text-muted text-center" :class="isSwapComponent ? 'px-8' : 'px-16'">
      <i18n-t keypath="context.transactions.waitingPrevious.description">
        <template #type>{{ transactionNameMap[transaction.name] }}</template>
        <template #chain><ChainName :name="sourceChain" /></template>
      </i18n-t>
    </p>

    <div class="pt-4 w-full" :class="isSwapComponent ? 'px-8' : 'px-16'">
      <Button variant="secondary" @click="removeTransactionAndClose">
        {{ $t('context.transactions.controls.cancel') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

import {
  getCurrentTransaction,
  getSourceChainFromTransaction,
  ProvideViewerKey,
} from '../../transactionProcessHelpers';

const { actor, removeTransactionAndClose, isSwapComponent } = inject(ProvideViewerKey);
const { state } = actor;

const transactionNameMap = {
  transfer: 'transfer',
  ibc_forward: 'transfer',
  ibc_backward: 'transfer',
  swap: 'swap',
  addliquidity: 'pool liquidity provision',
  withdrawliquidity: 'liquidity withdrawal',
  createpool: 'liquidity pool provision',
};

const transaction = computed(() => getCurrentTransaction(state.value.context));
const sourceChain = computed(() => getSourceChainFromTransaction(transaction.value));
</script>
