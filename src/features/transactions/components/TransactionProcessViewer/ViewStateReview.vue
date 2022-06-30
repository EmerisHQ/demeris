<template>
  <div
    class="max-w-lg flex flex-1 flex-col items-center justify-between w-full"
    :class="isSwapComponent ? 'space-y-4 pb-6' : 'space-y-6 pb-16'"
  >
    <div
      class="flex-1 flex flex-col items-center justify-center w-full"
      :class="isSwapComponent ? 'space-y-4' : 'space-y-6'"
    >
      <h1 class="font-bold" :class="isSwapComponent ? 'text-2 pb-0 px-6' : 'text-center text-3 pb-4'">
        {{ titleMap[step.name] }}
      </h1>

      <div
        class="rounded-lg w-full px-6 flex flex-col"
        :class="{ 'border border-border py-4': !isSwapComponent, 'py-1': isSwapComponent }"
      >
        <component
          :is="previewComponentMap[step.name]"
          :step="step"
          :bordered="isSwapComponent"
          :fees="state.context.fees.totals[state.context.currentStepIndex]"
          :context="isSwapComponent ? 'widget' : 'default'"
          :class="{ '-text-1': isSwapComponent }"
          :transaction-process-context="state.context"
        />
      </div>
      <Alert
        v-if="step.name === 'stake' || step.name === 'switch'"
        status="warning"
        :message="$t('components.txHandlingModal.stakeDisclaimer')"
        class="mt-4"
      />
      <p class="px-8 text-center text-muted -text-1">
        {{ $t('components.txHandlingModal.noRevert') }}
        <a class="underline" href="https://emeris.com/terms" target="_blank" rel="noopener noreferrer">
          {{ $t('components.settingsMenu.tos') }} </a
        >.
      </p>
    </div>

    <div class="pt-4 flex flex-col space-y-3 w-full" :class="isSwapComponent ? 'px-8' : 'px-16'">
      <Button v-if="isDemoAccount" @click="onConnectWallet">
        {{ $t('context.transactions.controls.connectWallet') }}
      </Button>
      <Button v-else @click="onContinue">{{ $t('context.transactions.controls.confirmAndContinue') }}</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import PreviewAddLiquidity from '@/components/wizard/previews/PreviewAddLiquidity.vue';
import PreviewClaim from '@/components/wizard/previews/PreviewClaim.vue';
import PreviewReinvest from '@/components/wizard/previews/PreviewReinvest.vue';
import PreviewStake from '@/components/wizard/previews/PreviewStake.vue';
import PreviewSwap from '@/components/wizard/previews/PreviewSwap.vue';
import PreviewSwitch from '@/components/wizard/previews/PreviewSwitch.vue';
import PreviewTransfer from '@/components/wizard/previews/PreviewTransfer.vue';
import PreviewUnstake from '@/components/wizard/previews/PreviewUnstake.vue';
import PreviewWithdrawLiquidity from '@/components/wizard/previews/PreviewWithdrawLiquidity.vue';
import SwapViewDetails from '@/features/swap/SwapViewDetails.vue';
import { GlobalGetterTypes } from '@/store';
import { featureRunning } from '@/utils/FeatureManager';

import { getCurrentStep, ProvideViewerKey } from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const transactionsStore = useTransactionsStore();
const store = useStore();

const { actor, isSwapComponent } = inject(ProvideViewerKey);
const { state, send } = actor;
const { t } = useI18n({ useScope: 'global' });

const isDemoAccount = computed(() => store.getters[GlobalGetterTypes.USER.isDemoAccount]);

const previewComponentMap = {
  transfer: PreviewTransfer,
  move: PreviewTransfer,
  swap: featureRunning('DEX_AGG') ? SwapViewDetails : PreviewSwap,
  stake: PreviewStake,
  multistake: PreviewStake,
  unstake: PreviewUnstake,
  addliquidity: PreviewAddLiquidity,
  withdrawliquidity: PreviewWithdrawLiquidity,
  createpool: PreviewAddLiquidity,
  claim: PreviewClaim,
  reinvest: PreviewReinvest,
  switch: PreviewSwitch,
};

const titleMap = {
  transfer: t('context.transactions.review.transfer'),
  stake: t('context.transactions.review.stake'),
  unstake: t('context.transactions.review.unstake'),
  multistake: t('context.transactions.review.stake'),
  move: t('context.transactions.review.move'),
  swap: t('context.transactions.review.swap'),
  addliquidity: t('context.transactions.review.addliquidity'),
  withdrawliquidity: t('context.transactions.review.withdrawliquidity'),
  createpool: t('context.transactions.review.createpool'),
  claim: t('context.transactions.review.claim'),
  reinvest: t('context.transactions.review.reinvest'),
  switch: t('context.transactions.review.switch'),
};

const step = computed(() => getCurrentStep(state.value.context));

const onContinue = () => send('SIGN');
const onConnectWallet = () => transactionsStore.toggleConnectWalletModal();
</script>
