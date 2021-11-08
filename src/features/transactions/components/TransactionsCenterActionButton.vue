<template>
  <tippy ref="tippyRef" trigger="manual" placement="left">
    <button class="w-12 h-12 rounded-full shadow-button bg-surface" @click="handleClick">
      <div
        v-if="notificationsCount"
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
        <span v-if="notificationsCount > 3">3+</span>
        <span v-else>{{ notificationsCount }}</span>
      </div>
      <Icon name="MenuIcon" />
    </button>

    <template #content>
      <TransactionProcessItem
        v-if="state.lastUpdatedService"
        class="px-2"
        :service="state.lastUpdatedService"
        hide-controls
      />
    </template>
  </tippy>
</template>

<script lang="tsx" setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';

import Icon from '@/components/ui/Icon.vue';

import { TransactionProcessState } from '../transactionProcessMachine';
import { useTransactionsStore } from '../transactionsStore';
import TransactionProcessItem from './TransactionProcessItem.vue';

const transactionsStore = useTransactionsStore();

const tippyRef = ref(null);
const state = reactive({
  notifications: {},
  lastUpdatedHash: undefined,
  lastUpdatedService: undefined,
});

const pendingsCount = computed(() => Object.keys(transactionsStore.pending).length);
const notificationsCount = computed(() => Object.keys(state.notifications).length);

const handleClick = () => {
  transactionsStore.toggleBottomSheet();
  state.notifications = [];
};

const showTippy = async () => {
  await nextTick();
  tippyRef.value.show();
};

const showNotification = (hash: string) => {
  state.notifications[hash] = null;
  showTippy();
};

watch(pendingsCount, (value, oldValue, onCleanup) => {
  if (value > oldValue) {
    const lastPendingHash = Object.keys(transactionsStore.pending)[0];
    const lastPendingService = transactionsStore.pending[lastPendingHash];

    const onUpdate = (emitted: TransactionProcessState) => {
      state.lastUpdatedService = lastPendingService;
      state.lastUpdatedHash = lastPendingHash;

      const needsAction = (event: string) => ['CONTINUE', 'RETRY', 'SIGN'].includes(event);

      if (emitted.nextEvents.some(needsAction)) {
        showNotification(lastPendingHash);
      } else {
        showTippy();
      }
    };

    const unsubscribe = lastPendingService.subscribe({
      next: onUpdate,
      error: () => void 0,
      complete: () => void 0,
    });

    showNotification(lastPendingHash);
    onCleanup(unsubscribe);
  }
});
</script>
