<template>
  <div class="max-w-lg flex flex-col space-y-5 items-center justify-center pt-16 w-full pb-16">
    <Icon name="TimeIcon" class="opacity-60" :icon-size="3.5" />

    <h1 class="text-3 font-bold pb-4">
      {{ $t('context.transactions.waitingPrevious.title', { type: transactionNameMap[transaction.name] }) }}
    </h1>

    <p class="text-muted text-center px-16">
      <i18n-t keypath="context.transactions.waitingPrevious.description">
        <template #type>{{ transactionNameMap[transaction.name] }}</template>
        <template #chain><ChainName :name="sourceChain" /></template>
      </i18n-t>
    </p>

    <div class="pt-4 px-16 w-full">
      <Button variant="secondary" @click="injects.removeTransactionAndClose">
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

const injects = inject(ProvideViewerKey);
const { state } = injects.actor;

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
