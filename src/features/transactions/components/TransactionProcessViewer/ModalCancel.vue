<template>
  <Modal class="text-center" :variant="'dialog'" fullscreen @close="onCancel">
    <h2 class="text-1 font-bold mb-4">
      {{ $t('context.transactions.cancel.title', { type: transactionNameMap[transaction.name] }) }}
    </h2>
    <p class="text-muted leading-copy mb-8">
      <i18n-t :keypath="`context.transactions.cancel.description`">
        <template #type>
          <span>{{ transactionNameMap[transaction.name] }}</span>
        </template>
      </i18n-t>
    </p>
    <template #buttons>
      <ModalButton :name="$t('generic_cta.cancel')" :click-function="onCancel" />
      <ModalButton :name="$t('generic_cta.proceed')" :click-function="onProceed" />
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from '@/components/ui/Modal.vue';
import ModalButton from '@/components/ui/ModalButton.vue';

import { getCurrentTransaction, ProvideViewerKey } from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const transactionsStore = useTransactionsStore();
const { actor, removeTransactionAndClose } = inject(ProvideViewerKey);
const { state, send } = actor;
const { t } = useI18n({ useScope: 'global' });

const transaction = computed(() => getCurrentTransaction(state.value.context));

const transactionNameMap = {
  transfer: t('context.transactions.type.transfer'),
  ibc_forward: t('context.transactions.type.transfer'),
  ibc_backward: t('context.transactions.type.transfer'),
  swap: t('context.transactions.type.swap'),
  addliquidity: t('context.transactions.type.addliquidity'),
  withdrawliquidity: t('context.transactions.type.withdrawliquidity'),
  createpool: t('context.transactions.type.createpool'),
};

const onCancel = () => {
  transactionsStore.toggleCancelModal();
};

const onProceed = () => {
  transactionsStore.toggleCancelModal();
  removeTransactionAndClose();
  send('ABORT');
};
</script>
