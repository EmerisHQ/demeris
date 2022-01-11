<template>
  <div
    class="max-w-lg flex flex-col space-y-5 items-center justify-centerw-full"
    :class="isSwapComponent ? 'pb-6' : 'pb-16'"
  >
    <Icon name="TimeThinIcon" class="opacity-60" :icon-size="3.5" />

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
      <Button variant="secondary" @click="closeModal">
        {{ $t('context.transactions.controls.ok') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import ChainName from '@/components/common/ChainName.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

import {
  getCurrentTransaction,
  getSourceChainFromTransaction,
  ProvideViewerKey,
} from '../../transactionProcessHelpers';

const { actor, isSwapComponent, closeModal } = inject(ProvideViewerKey);
const { state } = actor;
const { t } = useI18n({ useScope: 'global' });

const transactionNameMap = {
  transfer: t('context.transactions.type.transfer'),
  ibc_forward: t('context.transactions.type.transfer'),
  ibc_backward: t('context.transactions.type.transfer'),
  swap: t('context.transactions.type.swap'),
  addliquidity: t('context.transactions.type.addliquidity'),
  withdrawliquidity: t('context.transactions.type.withdrawliquidity'),
  createpool: t('context.transactions.type.createpool'),
};

const transaction = computed(() => getCurrentTransaction(state.value.context));
const sourceChain = computed(() => getSourceChainFromTransaction(transaction.value));
</script>
