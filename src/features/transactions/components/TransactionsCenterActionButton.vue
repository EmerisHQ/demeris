<template>
  <tippy ref="tippyRef" trigger="manual" placement="left">
    <button class="w-12 h-12 rounded-full shadow-button bg-surface" @click="handleClick">
      <div
        v-if="state.notificationCount"
        class="
          flex
          items-center
          justify-center
          w-6
          h-6
          border-2 border-bg
          bg-negative
          rounded-full
          absolute
          -right-1
          -top-1
          font-medium
          -text-1
          text-text
        "
      >
        <span v-if="state.notificationCount > 3">3+</span>
        <span v-else>{{ state.notificationCount }}</span>
      </div>
      <Icon name="MenuIcon" />
    </button>

    <template #content>
      <TransactionProcessItem
        v-if="lastPendingTransaction"
        class="px-2"
        :service="lastPendingTransaction"
        hide-controls
      />
    </template>
  </tippy>
</template>

<script type="tsx" setup>
import { useActor } from "@xstate/vue";
import { computed,reactive, ref,watch } from "vue";

import Icon from "@/components/ui/Icon.vue";

import { useTransactionsStore } from "../transactionsStore";
import TransactionProcessItem from './TransactionProcessItem.vue';

const transactionsStore = useTransactionsStore();
const pendingsCount = computed(() => Object.keys(transactionsStore.pending).length);
const lastPendingTransaction = computed(() => Object.values(transactionsStore.pending)[pendingsCount.value - 1]);

const { state: serviceState, send } = useActor(lastPendingTransaction);

const tippyRef = ref(null);
const state = reactive({
  notificationCount: 0
});

const handleClick = () => {
  transactionsStore.toggleBottomSheet();
  state.notificationCount = 0;
}

const showNotification = () => {
  state.notificationCount = state.notificationCount + 1;
  tippyRef.value.show();
}

watch(() => serviceState.value.nextEvents, (nextEvents) => {
  if (nextEvents.length > 1) {
    showNotification();
  }
});

watch(() => serviceState.value.value, () => {
  tippyRef.value.show();
})
</script>
