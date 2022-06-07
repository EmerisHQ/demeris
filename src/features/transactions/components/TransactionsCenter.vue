<template>
  <div v-if="canShownCenter" class="relative pointer-events-none">
    <TransactionsCenterActionButton
      v-if="transactionsStore.isBottomSheetMinimized"
      class="fixed bottom-8 right-8 z-50 pointer-events-auto"
    />

    <section
      v-else
      class="transactions-center w-[396px] fixed bottom-0 right-8"
      :class="{ 'z-50': !transactionsStore.isRemoveModalOpen }"
    >
      <div class="absolute z-[-1] w-96 h-full top-0 right-0 bg-surface dark:bg-fg-solid shadow-dropdown rounded-t-lg" />
      <div class="z-1 w-full h-full pointer-events-auto">
        <Notifications
          :messages="state.notifications"
          class="absolute -top-3 pl-3"
          :button1-label="$t('context.transactions.controls.undo')"
          :button2-label="$t('context.transactions.controls.details')"
          :clear-all-label="$t('context.transactions.controls.clearAll')"
          :show-less-label="$t('context.transactions.controls.showLess')"
          :auto-dismiss="!transactionsStore.isRemoveModalOpen"
          @on-update="state.notifications = $event"
          @on-button1-click="undoRemoval"
          @on-button2-click="showDetails"
          @on-dismiss="onDismiss"
        />

        <template v-if="pendingTransactions.length">
          <header class="flex items-center space-between pt-5 pb-4 px-6 ml-3">
            <p class="font-bold flex-1 text-1">{{ $t('context.transactions.widget.title') }}</p>
            <div class="flex items-center space-x-4">
              <button @click="transactionsStore.toggleBottomSheet">
                <Icon name="CaretDownIcon" :icon-size="1.4" />
              </button>
            </div>
          </header>

          <ul
            class="flex flex-col space-y-1 overflow-y-auto max-h-80"
            :class="hasMore || state.viewAll ? 'pb-16' : 'pb-4'"
          >
            <li v-for="[id, service] of pendingTransactions" :key="id" class="relative transition-all group">
              <TransactionProcessItem
                class="py-4 px-6"
                :service="service"
                @click="selectItem(id)"
                @remove="onRemoveTransactionItem(id)"
              />
            </li>
          </ul>

          <Button
            v-if="hasMore || state.viewAll"
            :full-width="false"
            :name="
              state.viewAll
                ? $t('context.transactions.controls.showLess')
                : $t('context.transactions.controls.showMore')
            "
            size="sm"
            variant="secondary"
            class="absolute bottom-5 left-0 right-0 items-center justify-center"
            rounded
            @click="toggleViewAll"
          >
            <template #right>
              <Icon v-if="state.viewAll" name="CaretUpIcon" :icon-size="1" />
              <Icon v-else name="CaretDownIcon" :icon-size="1" />
            </template>
          </Button>
        </template>
      </div>
    </section>
  </div>

  <teleport to="body">
    <TransactionProcessViewer
      v-if="transactionsStore.isPendingModalOpen || transactionsStore.isRemoveModalOpen"
      :step-id="transactionsStore.currentId"
      @close="closeModal"
      @previous="closeModal"
      @undo="undoRemoval(transactionsStore.currentId)"
    />

    <Modal
      v-else
      :open="isModalOpen"
      variant="takeover"
      class="bg-surface"
      body-class="w-full flex flex-col"
      content-class="flex-1 flex items-center justify-center"
      fullscreen
      show-close-button
      @close="closeModal"
    >
      <TransactionProcessViewer :step-id="transactionsStore.currentId" @close="closeModal" @previous="closeModal" />
    </Modal>
  </teleport>
</template>

<script lang="ts" setup>
import { whenever } from '@vueuse/core';
import { computed, reactive } from 'vue';
import { useStore } from 'vuex';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Modal from '@/components/ui/Modal.vue';
import Notifications from '@/components/ui/Notifications.vue';
import { GlobalGetterTypes } from '@/store';

import { useTransactionsStore } from '../transactionsStore';
import TransactionProcessItem from './TransactionProcessItem.vue';
import TransactionProcessViewer from './TransactionProcessViewer.vue';
import TransactionsCenterActionButton from './TransactionsCenterActionButton.vue';

const transactionsStore = useTransactionsStore();
const globalStore = useStore();

const state = reactive({
  viewAll: false,
  notifications: [],
});

const canShownCenter = computed(() => {
  if (pendingTransactions.value.length || state.notifications.length) {
    if (isModalOpen.value || transactionsStore.isPendingModalOpen) {
      return false;
    }
    return true;
  }
  return false;
});

const rowsLimit = computed(() => (state.viewAll ? undefined : 3));

const selectItem = (stepId) => {
  transactionsStore.setCurrentId(stepId);
  const service = transactionsStore.getCurrentService();

  if (!service) {
    return;
  }

  const snapshot = service.getSnapshot();

  if (snapshot.matches('waitingPreviousTransaction')) {
    transactionsStore.togglePendingModal();
    return;
  }

  transactionsStore.toggleViewerModal();
};

const closeModal = () => {
  removeNotification(transactionsStore.currentId);

  transactionsStore.setCurrentId(undefined);
  if (transactionsStore.isPendingModalOpen) {
    transactionsStore.closePendingModal();
  }
  if (transactionsStore.isRemoveModalOpen) {
    transactionsStore.closeRemoveModal();
  }
  if (isModalOpen.value) {
    transactionsStore.toggleViewerModal();
  }
};

const removeNotification = (id: string) => (state.notifications = state.notifications.filter((note) => note.id !== id));

const toggleViewAll = () => (state.viewAll = !state.viewAll);

const onRemoveTransactionItem = (id: string) => {
  const service = transactionsStore.transactions[id];
  const snapshot = service.getSnapshot();

  state.notifications.push({ message: 'Transaction item removed', id, hideButton2: snapshot.done });
  transactionsStore.removeTransactionFromPending(id);
};

const undoRemoval = (id: string) => {
  transactionsStore.setTransactionAsPending(id);
  removeNotification(id);
};

const showDetails = (id: string) => {
  transactionsStore.setCurrentId(id);
  transactionsStore.toggleRemoveModal();
};

const onDismiss = (id: string) => {
  if (transactionsStore.transactions[id]?.state?.can('ABORT')) {
    transactionsStore.transactions[id].send('ABORT');
  }
  transactionsStore.removeTransaction(id);
};

const isModalOpen = computed(() => transactionsStore.isViewerModalOpen);
const pendingTransactions = computed(() => Object.entries(transactionsStore.pending).slice(0, rowsLimit.value));
const hasMore = computed(() => Object.entries(transactionsStore.pending).length > rowsLimit.value);

const isSignedIn = computed(() => globalStore.getters[GlobalGetterTypes.USER.isSignedIn]);

whenever(isSignedIn, () => transactionsStore.$reset());
</script>
