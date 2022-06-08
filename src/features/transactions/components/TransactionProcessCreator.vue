<template>
  <div class="w-full">
    <GobackWithClose
      v-if="action === 'swap'"
      :class="{
        invisible: !['review', 'ibcConfirmation'].some(state.matches),
        'text-inverse': state.matches('ibcConfirmation'),
      }"
      :show-close="!state.matches('ibcConfirmation')"
      class="relative z-10"
      @goback="onBack"
      @close="handleCloseHeader"
    />
    <TransactionProcessViewer
      v-if="stepId"
      :step-id="stepId"
      @close="onClose"
      @previous="onPrevious"
      @onReceiptState="onReceiptState"
    />
    <ConnectWalletModal
      v-if="transactionsStore"
      :open="transactionsStore.isConnectWalletModalOpen"
      @close="transactionsStore.closeConnectWalletModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { useActor } from '@xstate/vue';
import { computed, nextTick, onUnmounted, PropType, watch } from 'vue';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';
import { GlobalGetterTypes } from '@/store';
import { Step } from '@/types/actions';
import { useStore } from '@/utils/useStore';

import { useTransactionsStore } from '../transactionsStore';
import TransactionProcessViewer from './TransactionProcessViewer.vue';

const props = defineProps({
  steps: {
    type: Array as PropType<Step[]>,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  emitBack: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['back', 'pending', 'close', 'previous', 'onReceiptState']);

const globalStore = useStore();
const transactionsStore = useTransactionsStore();

const allbalances = computed(() => globalStore.getters[GlobalGetterTypes.API.getAllBalances]);

const [stepId, service] = transactionsStore.createTransaction({
  action: props.action,
  steps: props.steps,
  balances: allbalances.value,
});
const isPending = computed(() => transactionsStore.isPending(stepId));

const { state } = useActor(service);

const handleCloseHeader = () => transactionsStore.setTransactionAsPending();
const onClose = (payload) => emit('close', payload);
const onPrevious = () => emit('previous');
const onReceiptState = () => emit('onReceiptState');

const onBack = async () => {
  if (props.emitBack) {
    emit('back');
  } else {
    emit('close');
  }

  await nextTick();
  transactionsStore.removeTransaction(stepId);
};

watch(isPending, (value) => {
  if (value) {
    emit('pending');
  }
});

onUnmounted(() => {
  if (transactionsStore.isConnectWalletModalOpen) {
    transactionsStore.closeConnectWalletModal();
  }
});
</script>
