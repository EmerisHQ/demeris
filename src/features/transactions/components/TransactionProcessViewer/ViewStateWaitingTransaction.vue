<template>
  <div
    class="max-w-lg flex-1 flex flex-col space-y-5 items-center justify-center w-full"
    :class="isSwapComponent ? '-mt-4 pb-8' : 'pb-16'"
  >
    <div class="flex-1 flex flex-col items-center justify-center space-y-5 w-full">
      <Icon name="TimeThinIcon" class="opacity-60" :icon-size="2" />

      <h1 class="font-bold text-center" :class="isSwapComponent ? 'text-2' : 'text-3'">
        {{ $t('context.transactions.waitingPrevious.title', { type: transactionNameMap[transaction.name] }) }}
      </h1>

      <p class="text-muted text-center" :class="isSwapComponent ? 'px-8' : 'px-16'">
        <i18n-t scope="global" keypath="context.transactions.waitingPrevious.description">
          <template #type>{{ transactionNameMap[transaction.name] }}</template>
          <template #chain><ChainName :name="sourceChain" /></template>
        </i18n-t>
      </p>
    </div>

    <div class="pt-4 w-full space-y-4" :class="isSwapComponent ? 'px-8' : 'px-16'">
      <p class="text-muted text-center mt-2">{{ $t('context.transactions.transacting.notifiedWhenComplete') }}</p>
      <Button variant="secondary" @click="confirm">
        <template v-if="isSwapComponent">{{ $t('context.transactions.controls.swapAnotherAsset') }}</template>
        <template v-else>{{ $t('generic_cta.continue') }}</template>
      </Button>

      <Button variant="link" class="text-negative" @click="cancel">
        {{ $t('context.transactions.controls.cancelTransaction') }}
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
import { useTransactionsStore } from '../../transactionsStore';
const { actor, isSwapComponent, closeModal } = inject(ProvideViewerKey);
const { state } = actor;
const { t } = useI18n({ useScope: 'global' });
const transactionsStore = useTransactionsStore();
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

const confirm = () => {
  transactionsStore.setTransactionAsPending();
  if (!isSwapComponent.value) {
    closeModal();
  }
};

const cancel = () => {
  transactionsStore.toggleCancelModal();
};
</script>
