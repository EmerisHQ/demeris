<template>
  <Modal class="text-center" :variant="'dialog'" fullscreen @close="onCancel">
    <Icon name="ExclamationThinIcon" class="text-warning mb-4" :icon-size="2" />
    <h2 class="text-1 font-bold mb-4">
      {{ $t('context.transactions.cancel.title') }}
    </h2>
    <p class="text-muted leading-copy mb-8">
      <i18n-t :keypath="`context.transactions.cancel.description`" />
    </p>
    <template #buttons>
      <ModalButton :name="$t('context.transactions.controls.keepIt')" :click-function="onKeep" />
      <ModalButton :name="$t('generic_cta.cancel')" class="text-negative-text" :click-function="onCancel" />
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import Icon from '@/components/ui/Icon.vue';
import Modal from '@/components/ui/Modal.vue';
import ModalButton from '@/components/ui/ModalButton.vue';

import { ProvideViewerKey } from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const transactionsStore = useTransactionsStore();
const { actor, removeTransactionAndClose, minimizeModal } = inject(ProvideViewerKey);
const { send } = actor;

const onKeep = () => {
  transactionsStore.toggleCancelModal();
  transactionsStore.setTransactionAsPending();
  minimizeModal();
};

const onCancel = () => {
  transactionsStore.toggleCancelModal();
  transactionsStore.closePendingModal();
  removeTransactionAndClose();
  send('ABORT');
};
</script>
