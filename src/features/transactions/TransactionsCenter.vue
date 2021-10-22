<template>
  <section
    v-if="pendingTransactions.length"
    class="w-96 fixed bottom-0 right-8 z-50 bg-surface dark:bg-fg shadow-dropwdown rounded-t-lg"
  >
    <header class="flex items-center space-between py-4 px-6">
      <p class="font-bold flex-1">Transactions</p>
      <div class="flex items-center space-x-4">
        <button>
          <Icon name="CaretDownIcon" />
        </button>
        <button>
          <Icon name="CloseIcon" />
        </button>
      </div>
    </header>

    <ul class="py-4 flex flex-col space-y-4">
      <li v-for="[key, service] of pendingTransactions" :key="key">
        <TransactionStepsProcessor :service="service" />
      </li>
    </ul>

    <footer v-if="hasMore" class="flex justify-center py-4">
      <p>See all transactions</p>
    </footer>
  </section>
</template>

<script type="ts" setup>
import { computed } from "@vue/reactivity";

import Icon from "@/components/ui/Icon.vue";

import { useTransactionsStore } from "./transactionsStore";
import TransactionStepsProcessor from './TransactionStepsProcessor.vue';

const transactions = useTransactionsStore();
const rowsLimit = 3;
const pendingTransactions = computed(() => Object.entries(transactions.pending).slice(0, rowsLimit));
const hasMore = computed(() => Object.entries(transactions.pending).length > rowsLimit);
</script>
