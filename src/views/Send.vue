<template>
  <div class="send relative flex w-full min-h-screen justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <header class="flex items-center justify-between py-6 h-24">
        <Button
          v-if="showBackButton"
          variant="link"
          :full-width="false"
          :disabled="['move', 'send'].includes(step)"
          :click-function="goBack"
        >
          <Icon name="ArrowLeftIcon" :icon-size="1.5" />
        </Button>

        <nav v-if="transferType" class="flex-1 flex items-center justify-center space-x-12">
          <span
            v-for="label of allSteps[transferType]"
            :key="label"
            class="capitalize font-medium cursor-default"
            :class="step === label ? 'text-text' : 'text-inactive'"
          >
            {{ $t('components.send.navigation.' + label) }}
          </span>
        </nav>

        <Button class="ml-auto" variant="link" :full-width="false" :click-function="onClose">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </header>

      <main class="pt-8 pb-28 flex-1 flex flex-col items-center justify-center">
        <template v-if="!transferType">
          <div class="max-w-3xl">
            <h1 class="text-3 font-bold py-8 text-center">{{ $t('pages.send.where') }}</h1>
            <div class="mt-8 pb-8 flex space-x-8">
              <router-link
                :to="{ name: 'Send', params: { type: 'address' } }"
                class="send__type flex-1 flex flex-col items-center justify-center p-8 bg-surface group dark:hover:text-inverse shadow-card hover:shadow-panel focus:shadow-panel active:opacity-70 transition rounded-2xl text-center overflow-hidden"
              >
                <h4 class="relative z-10 text-1 font-medium mb-8">{{ $t('components.send.sendToAddress') }}</h4>
                <div class="relative flex items-center justify-center h-16 w-16 dark:theme-inverse text-text">
                  <span
                    class="send__type__circle absolute z-0 inset-0 bg-brand rounded-full transition-transform duration-300"
                  ></span>
                  <Icon class="relative" name="SendIcon" :icon-size="1.5" />
                </div>
                <p class="relative z-10 text-muted dark:group-hover:text-inverse leading-copy mt-8">
                  {{ $t('components.send.sendToAddressDescription') }}
                </p>
              </router-link>

              <router-link
                :to="{ name: 'Send', params: { type: 'move' } }"
                class="send__type flex-1 flex flex-col items-center justify-center p-8 bg-surface group dark:hover:text-inverse shadow-card hover:shadow-panel focus:shadow-panel active:opacity-70 transition rounded-2xl text-center overflow-hidden"
              >
                <h4 class="relative z-10 text-1 font-medium mb-8">{{ $t('components.send.moveAssets') }}</h4>
                <div class="relative flex items-center justify-center h-16 w-16 dark:theme-inverse text-text">
                  <span
                    class="send__type__circle absolute z-0 inset-0 bg-brand rounded-full transition-transform duration-300"
                  ></span>
                  <Icon class="relative" name="SwapLRIcon" :icon-size="1.5" />
                </div>
                <p class="relative z-10 text-muted dark:group-hover:text-inverse leading-copy mt-8">
                  {{ $t('components.send.moveAssetsDescription') }}
                </p>
              </router-link>
            </div>
          </div>
        </template>

        <div v-else class="w-full max-w-lg">
          <SendForm v-if="transferType === 'address'" v-model:step="step" :balances="balances" @previous="goBack" />
          <MoveForm v-if="transferType === 'move'" v-model:step="step" :balances="balances" @previous="goBack" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';

import MoveForm from '@/components/transfer/MoveForm';
import SendForm from '@/components/transfer/SendForm';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';
import { pageview } from '@/utils/analytics';

type TransferType = 'address' | 'move';

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const transactionsStore = useTransactionsStore();
const route = useRoute();
const transferType = computed(() => route.params.type as TransferType);

const step = ref(undefined);
pageview({ page_title: 'Send: ' + route.params.type, page_path: '/send/' + route.params.type });
const { balances } = useAccount();

const showBackButton = computed(() => {
  return !!transferType.value;
});

const allSteps = {
  address: ['recipient', 'amount', 'review', 'send'],
  move: ['amount', 'review', 'move'],
};

const currentStepIndex = computed(() => allSteps[transferType.value]?.indexOf(step.value));

const metaSource = computed(() => {
  let title = t('components.send.send');
  if (transferType.value) {
    title = transferType.value === 'address' ? t('components.send.sendToAddress') : t('components.send.moveAssets');
  }

  return {
    title,
  };
});
useMeta(metaSource);

const goBack = () => {
  transactionsStore.removeTransaction(transactionsStore.currentId);
  if (currentStepIndex.value > 0) {
    step.value = allSteps[transferType.value][currentStepIndex.value - 1];
    return;
  }

  step.value = undefined;
  router.back();
};

const onClose = () => {
  transactionsStore.setTransactionAsPending();
  router.push('/');
};
</script>

<style lang="scss" scoped>
.send__type:hover {
  transform: translateY(-2px);

  .send__type__circle {
    transform: scale(8);
    transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }
}
</style>
