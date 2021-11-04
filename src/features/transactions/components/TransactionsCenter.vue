<template>
  <div v-if="pendingTransactions.length && !isModalOpen">
    <TransactionsCenterActionButton
      v-if="transactionsStore.isBottomSheetMinimized"
      class="fixed bottom-8 right-8 z-50"
    />

    <section v-else class="w-96 fixed bottom-0 right-8 z-50 bg-surface shadow-dropwdown rounded-t-lg">
      <header class="flex items-center space-between py-4 px-6">
        <p class="font-bold flex-1 text-1">Transactions</p>
        <div class="flex items-center space-x-4">
          <button @click="transactionsStore.toggleBottomSheet">
            <Icon name="CaretDownIcon" :icon-size="1.4" />
          </button>
        </div>
      </header>

      <ul class="flex flex-col space-y-1">
        <li v-for="[key, service] of pendingTransactions" :key="key">
          <TransactionProcessItem class="py-4 px-6" :service="service" @click="selectItem(key)" />
        </li>
      </ul>

      <footer v-if="hasMore" class="flex justify-center py-4">
        <p>See all transactions</p>
      </footer>
    </section>
  </div>

  <teleport to="body">
    <Modal :open="isModalOpen" variant="takeover" fullscreen show-close-button @close="closeModal">
      <TransactionProcessViewer :step-hash="state.selectedItem" @close="closeModal" />
    </Modal>
  </teleport>
</template>

<script type="ts" setup>
import { computed, reactive } from "@vue/reactivity";

import Icon from "@/components/ui/Icon.vue";
import Modal from '@/components/ui/Modal.vue';

import { useTransactionsStore } from "../transactionsStore";
import TransactionProcessItem from './TransactionProcessItem.vue';
import TransactionProcessViewer from "./TransactionProcessViewer.vue";
import TransactionsCenterActionButton from "./TransactionsCenterActionButton.vue";

const transactionsStore = useTransactionsStore();
const rowsLimit = 3;

const state = reactive({
  selectedItem: null
})

const selectItem = (stepHash) => {
  state.selectedItem = stepHash;
}

const closeModal = () => {
  state.selectedItem = null;
}

const isModalOpen = computed(() => !!state.selectedItem);
const pendingTransactions = computed(() => Object.entries(transactionsStore.pending).slice(0, rowsLimit));
const hasMore = computed(() => Object.entries(transactionsStore.pending).length > rowsLimit);
</script>
