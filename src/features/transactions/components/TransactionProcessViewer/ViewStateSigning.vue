<template>
  <div
    class="max-w-lg flex flex-col items-center justify-center h-full w-full"
    :class="injects.isSwapComponent ? 'space-y-3 pb-8' : 'space-y-5 pb-16'"
  >
    <Spinner :size="2.5" />

    <p class="text-muted">Opening Keplr</p>

    <h1 class="font-bold" :class="injects.isSwapComponent ? 'text-2' : 'text-3'">Sign transaction</h1>

    <template v-if="transaction.name.startsWith('ibc')">
      <div class="mt-0.5 text-muted">
        <ChainName :name="transaction.data.from_chain" /> &rarr;&nbsp;
        <ChainName :name="transaction.data.to_chain" />
      </div>
    </template>

    <a v-if="state.matches('signing.delayed')" href="#" class="font-medium pt-2"> Having trouble opening Keplr? ↗️ </a>

    <div class="pt-5 flex flex-col space-y-3 w-full" :class="injects.isSwapComponent ? 'px-6' : 'px-16'">
      <Button v-if="state.matches('signing.delayed')" @click="() => send('SIGN')"> Open Keplr </Button>
      <Button variant="secondary" @click="() => send('ABORT')"> Cancel </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import Button from '@/components/ui/Button.vue';
import Spinner from '@/components/ui/Spinner.vue';

import { getCurrentTransaction, ProvideViewerKey } from '../../transactionProcessSelectors';

const injects = inject(ProvideViewerKey);
const { state, send } = injects.actor;

const transaction = computed(() => getCurrentTransaction(state.value.context));
</script>
