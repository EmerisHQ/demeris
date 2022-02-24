<template>
  <div v-if="!transactionsStore.isCancelModalOpen" class="modal-pending-transaction">
    <Modal
      class="text-center"
      :variant="'dialog'"
      fullscreen
      :show-close-button="false"
      footer-class="flex-col divide-y divide-x-0"
    >
      <Icon name="TimeThinIcon" class="opacity-60 mb-8" :icon-size="2" />

      <h2 class="text-1 font-bold mb-4">
        {{ $t('context.transactions.waitingPrevious.title') }}
      </h2>

      <p class="text-muted leading-copy mb-4">
        <i18n-t scope="global" keypath="context.transactions.waitingPrevious.description">
          <template #chain><ChainName :name="sourceChain" /></template>
        </i18n-t>
      </p>

      <template #buttons>
        <ModalButton :name="$t('context.transactions.controls.ok')" :click-function="onKeep" squared />
        <ModalButton
          :name="$t('context.transactions.controls.cancelTransaction')"
          class="text-negative-text"
          :click-function="onCancel"
        />
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import Icon from '@/components/ui/Icon.vue';
import Modal from '@/components/ui/Modal.vue';
import ModalButton from '@/components/ui/ModalButton.vue';

import {
  getCurrentTransaction,
  getSourceChainFromTransaction,
  ProvideViewerKey,
} from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const transactionsStore = useTransactionsStore();
const { actor, minimizeModal, stepId } = inject(ProvideViewerKey);
const { state } = actor;

const transaction = computed(() => getCurrentTransaction(state.value.context));
const sourceChain = computed(() => getSourceChainFromTransaction(transaction.value));

const onKeep = () => {
  minimizeModal();
};

const onCancel = () => {
  transactionsStore.toggleCancelModal();
  transactionsStore.removeTransactionFromPending(stepId);
};
</script>
