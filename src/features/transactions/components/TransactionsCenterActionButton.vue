<template>
  <tippy ref="tippyRef" trigger="manual" placement="left">
    <Button rounded variant="secondary" class="w-12 h-12 flex items-center justify-center" @click="handleClick">
      <div
        v-if="notificationsCount"
        class="actions-count flex items-center justify-center w-6 h-6 border-2 border-bg bg-negative rounded-full absolute -right-1 -top-1 font-medium"
      >
        <span :class="notificationsCount > 9 ? '-text-2' : '-text-1'">
          {{ notificationsCount }}
        </span>
      </div>
      <Icon name="MenuIcon" :icon-size="7" />
    </Button>

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

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

import { TransactionProcessState } from '../transactionProcessMachine';
import { useTransactionsStore } from '../transactionsStore';
import TransactionProcessItem from './TransactionProcessItem.vue';

const transactionsStore = useTransactionsStore();

const subscriptions = ref({});

const tippyRef = ref(null);
const state = reactive({
  notifications: {},
  updates: {},
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
  setTimeout(() => tippyRef.value?.hide(), 5000);
};

const showNotification = (hash: string, skipTippy = false) => {
  state.notifications[hash] = null;
  if (skipTippy) {
    return;
  }
  showTippy();
};

const subscribe = (pendingHash: string, skipInitialUpdate = true) => {
  if (subscriptions.value[pendingHash]) {
    return;
  }

  const pendingService = transactionsStore.pending[pendingHash];

  const onUpdate = (emitted: TransactionProcessState) => {
    state.updates[pendingHash] = (state.updates[pendingHash] ?? 0) + 1;

    if (state.updates[pendingHash] === 1 && skipInitialUpdate) {
      showNotification(pendingHash, true);
      return;
    }

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

// Detects new transaction
watch(pendingsCount, (value, oldValue) => {
  if (value > (oldValue ?? 0)) {
    const lastPendingHash = Object.keys(transactionsStore.pending)[0];
    subscribe(lastPendingHash, false);
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

<style scoped>
.actions-count {
  color: white;
}
</style>
