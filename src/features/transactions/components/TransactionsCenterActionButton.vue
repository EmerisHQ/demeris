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
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

import Icon from '@/components/ui/Icon.vue';

import { TransactionProcessState } from '../transactionProcessMachine';
import { useTransactionsStore } from '../transactionsStore';
import TransactionProcessItem from './TransactionProcessItem.vue';

const transactionsStore = useTransactionsStore();

const subscriptions = ref({});
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

const subscribe = (pendingHash: string) => {
  if (subscriptions.value[pendingHash]) {
    return;
  }

  const pendingService = transactionsStore.pending[pendingHash];

  const onUpdate = (emitted: TransactionProcessState) => {
    state.lastUpdatedService = pendingService;
    state.lastUpdatedHash = pendingHash;

    const needsAction = (event: string) => ['CONTINUE', 'RETRY', 'SIGN'].includes(event);

    nextTick(() => {
      if (emitted.nextEvents.some(needsAction)) {
        showNotification(pendingHash);
      } else {
        showTippy();
      }
    });
  };

  const subscription = pendingService.subscribe({
    next: onUpdate,
    error: () => void 0,
    complete: () => void 0,
  });

  subscriptions.value[pendingHash] = subscription;
};

watch(pendingsCount, (value, oldValue) => {
  if (value > (oldValue ?? 0)) {
    const lastPendingHash = Object.keys(transactionsStore.pending)[0];
    subscribe(lastPendingHash);
    showNotification(lastPendingHash);
  }
});

onMounted(() => {
  for (const hash of Object.keys(transactionsStore.pending).reverse()) {
    subscribe(hash);
  }
});

onUnmounted(() => {
  for (const subscription of Object.values(subscriptions.value)) {
    // @ts-ignore
    subscription.unsubscribe();
  }
});
</script>
