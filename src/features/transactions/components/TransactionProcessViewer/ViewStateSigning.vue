<template>
  <div
    class="max-w-lg flex flex-col items-center justify-center h-full w-full"
    :class="isSwapComponent ? 'space-y-3 pb-8' : 'space-y-5'"
  >
    <Spinner :size="2.5" />

    <p class="text-muted">{{ $t('components.txHandlingModal.openKeplr') }}</p>

    <h1 class="font-bold" :class="isSwapComponent ? 'text-2' : 'text-3'">
      {{ $t('components.txHandlingModal.signTx') }}
    </h1>

    <template v-if="transaction.name.startsWith('ibc')">
      <div class="mt-0.5 text-muted">
        <ChainName :name="transaction.data.from_chain" /> &rarr;&nbsp;
        <ChainName :name="transaction.data.to_chain" />
      </div>
    </template>

    <a
      v-if="state.matches('signing.delayed')"
      href="https://faq.keplr.app"
      target="_blank"
      class="font-medium text-link hover:text-link-hover pt-2"
    >
      {{ $t('components.txHandlingModal.keplrSupport') }}
    </a>

    <div class="pt-5 flex flex-col space-y-3 w-full" :class="isSwapComponent ? 'px-6' : 'px-16'">
      <Button v-if="state.matches('signing.delayed')" @click="() => send('SIGN')">
        {{ $t('context.transactions.controls.tryAgain') }}
      </Button>
      <Button variant="link" @click="transactionsStore.toggleCancelModal">
        {{
          $t('context.transactions.controls.cancel')
        }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import Button from '@/components/ui/Button.vue';
import Spinner from '@/components/ui/Spinner.vue';

import { getCurrentTransaction, ProvideViewerKey } from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const transactionsStore = useTransactionsStore();
const { actor, isSwapComponent } = inject(ProvideViewerKey);
const { state, send } = actor;

const transaction = computed(() => getCurrentTransaction(state.value.context));
</script>
