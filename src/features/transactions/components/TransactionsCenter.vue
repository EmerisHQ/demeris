<template>
  <div v-if="pendingTransactions.length && !isModalOpen" class="relative">
    <TransactionsCenterActionButton
      v-if="transactionsStore.isBottomSheetMinimized"
      class="fixed bottom-8 right-8 z-50"
    />

    <section
      v-else
      class="transactions-center w-96 fixed bottom-0 right-8 z-50 bg-surface dark:bg-fg shadow-dropdown rounded-t-lg"
    >
      <header class="flex items-center space-between py-4 px-6">
        <p class="font-bold flex-1 text-1">Transactions</p>
        <div class="flex items-center space-x-4">
          <button @click="transactionsStore.toggleBottomSheet">
            <Icon name="CaretDownIcon" :icon-size="1.4" />
          </button>
        </div>
      </header>

      <ul
        class="flex flex-col space-y-1 overflow-y-auto"
        :style="{ maxHeight: '300px' }"
        :class="hasMore || state.viewAll ? 'pb-16' : 'pb-4'"
      >
        <li v-for="[id, service] of pendingTransactions" :key="id">
          <TransactionProcessItem class="py-4 px-6" :service="service" @click="selectItem(id)" />
        </li>
      </ul>

      <Button
        v-if="hasMore || state.viewAll"
        :full-width="false"
        :name="state.viewAll ? 'Show less' : 'Show more'"
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
    </section>
  </div>

  <teleport to="body">
    <Modal
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

<script type="ts" setup>
import { computed, reactive } from "@vue/reactivity";

import Button from "@/components/ui/Button.vue";
import Icon from "@/components/ui/Icon.vue";
import Modal from '@/components/ui/Modal.vue';

import { useTransactionsStore } from "../transactionsStore";
import TransactionProcessItem from './TransactionProcessItem.vue';
import TransactionProcessViewer from "./TransactionProcessViewer.vue";
import TransactionsCenterActionButton from "./TransactionsCenterActionButton.vue";

const transactionsStore = useTransactionsStore();

const state = reactive({
  viewAll: false
})

const rowsLimit = computed(() => state.viewAll ? undefined : 3);

const selectItem = (stepId) => {
  transactionsStore.setCurrentId(stepId);
  transactionsStore.toggleViewerModal();
}

const closeModal = () => selectItem(undefined);

const toggleViewAll = () => state.viewAll = !state.viewAll;

const isModalOpen = computed(() => transactionsStore.isViewerModalOpen);
const pendingTransactions = computed(() => Object.entries(transactionsStore.pending).slice(0, rowsLimit.value));
const hasMore = computed(() => Object.entries(transactionsStore.pending).length > rowsLimit.value);
</script>
