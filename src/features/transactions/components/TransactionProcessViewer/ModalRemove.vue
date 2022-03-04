<template>
  <Modal class="text-center" :variant="'dialog'" fullscreen>
    <h2 class="text-1 font-bold mb-4">
      {{ $t('context.transactions.remove.title') }}
    </h2>
    <p class="text-muted leading-copy mb-8">
      <i18n-t
        :keypath="
          isProcessingState(state)
            ? `context.transactions.remove.descriptionProcessing`
            : `context.transactions.remove.description`
        "
        scope="global"
      >
        <template #chain>
          <ChainName :name="chainName" />
        </template>
      </i18n-t>
    </p>
    <template #buttons>
      <ModalButton :name="$t('context.transactions.controls.undo')" :click-function="onUndo" />
      <ModalButton :name="$t('context.transactions.controls.ok')" :click-function="onContinue" />
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import Modal from '@/components/ui/Modal.vue';
import ModalButton from '@/components/ui/ModalButton.vue';

import {
  getCurrentTransaction,
  getSourceChainFromTransaction,
  isProcessingState,
  ProvideViewerKey,
} from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const emit = defineEmits(['undo']);
const transactionsStore = useTransactionsStore();

const { actor, removeTransactionAndClose, minimizeModal } = inject(ProvideViewerKey);
const { state } = actor;

const transaction = computed(() => getCurrentTransaction(state.value.context));
const chainName = computed(() => getSourceChainFromTransaction(transaction.value));

const onUndo = () => {
  emit('undo');
  transactionsStore.closeRemoveModal();
  transactionsStore.setTransactionAsPending();
  minimizeModal();
};

const onContinue = () => {
  transactionsStore.closeRemoveModal();
  removeTransactionAndClose();
};
</script>
