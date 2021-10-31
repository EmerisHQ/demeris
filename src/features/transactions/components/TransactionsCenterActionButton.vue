<template>
  <button class="w-12 h-12 rounded-full shadow-button bg-surface" @click="handleClick">
    <div v-if="state.showBadge" class="w-2 h-2 bg-negative rounded-full absolute right-2 top-0" />
    <Icon name="MenuIcon" />
  </button>
</template>

<script type="tsx" setup>
import { reactive,watch } from "vue";

import Icon from "@/components/ui/Icon.vue";

import { useTransactionsStore } from "../transactionsStore";
import TransactionProcessItem from './TransactionProcessItem.vue';

const transactionsStore = useTransactionsStore();

const state = reactive({
    showBadge: false
});

const handleClick = () => {
    transactionsStore.toggleBottomSheet();
    state.showBadge = false;
}

watch(transactionsStore.pending, () => {
    state.showBadge = true;
});
</script>
