<template>
  <div
    class="max-w-lg flex-1 flex flex-col items-center justify-between h-full w-full"
    :class="isSwapComponent ? 'space-y-3 pb-8' : 'space-y-5'"
  >
    <div
      class="flex-1 flex flex-col items-center justify-center w-full"
      :class="isSwapComponent ? 'space-y-3 pb-8' : 'space-y-5'"
    >
      <Spinner :size="2.5" />

      <p v-if="!state.matches('signing.delayed')" class="text-muted">
        <FeatureRunningConditional name="USE_EMERIS_EXTENSION">
          <template #deactivated>
            {{ $t('components.txHandlingModal.openKeplr') }}
          </template>
          {{ $t('components.txHandlingModal.openWallet', { wallet: capitalize(wallet) }) }}
        </FeatureRunningConditional>
      </p>

      <h1 class="font-bold" :class="isSwapComponent ? 'text-2' : 'text-3'">
        {{ $t('components.txHandlingModal.signTx') }}
      </h1>

      <template v-if="transaction.type == 'IBCtransferBackward' || transaction.type == 'IBCtransferForward'">
        <div class="mt-0.5 text-muted">
          <ChainName :name="transaction.data.chainName" /> &rarr;&nbsp;
          <ChainName :name="transaction.data.toChain" />
        </div>
      </template>

      <a
        v-if="state.matches('signing.delayed')"
        href="https://faq.keplr.app"
        target="_blank"
        class="font-medium text-link hover:text-link-hover pt-2"
      >
        <FeatureRunningConditional name="USE_EMERIS_EXTENSION">
          <template #deactivated>
            {{ $t('components.txHandlingModal.keplrSupport') }}
          </template>
          {{ $t('components.txHandlingModal.walletSupport', { wallet: capitalize(wallet) }) }}
        </FeatureRunningConditional>
      </a>
    </div>

    <div class="pt-5 flex flex-col space-y-3 w-full" :class="isSwapComponent ? 'px-6' : 'px-16'">
      <Button variant="link" @click="transactionsStore.toggleCancelModal">
        {{ $t('context.transactions.controls.cancel') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { capitalize } from 'lodash';
import { computed, inject, toRefs } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import Button from '@/components/ui/Button.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { SupportedWallet } from '@/features/extension/types';
import { walletActionHandler } from '@/features/extension/WalletActionHandler';
import { StepTransaction } from '@/types/actions';

import { getCurrentTransaction, ProvideViewerKey } from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const transactionsStore = useTransactionsStore();
const { actor, isSwapComponent } = inject(ProvideViewerKey);
const { state } = actor;

const { wallet } = toRefs<{ wallet: SupportedWallet }>({ wallet: walletActionHandler.session.wallet });

const transaction = computed<StepTransaction>(() => getCurrentTransaction(state.value.context));
</script>
