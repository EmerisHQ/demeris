<template>
  <div class="max-w-lg flex flex-col space-y-6 items-center w-full pb-16">
    <h1 class="text-3 font-bold pb-4">
      {{ titleMap[step.name] }}
    </h1>

    <div class="border border-border rounded-lg w-full py-4 px-6 flex flex-col">
      <component :is="previewComponentMap[step.name]" :step="step" :bordered="false" :fees="{}" />
    </div>

    <p class="px-8 text-center text-muted -text-1">
      Once executed, transactions cannot be reverted. By continuing, you agree to our
      <a class="underline" href="https://emeris.com/terms" rel="noopener noreferral" target="_blank">
        {{ $t('components.settingsMenu.tos') }}
      </a>
    </p>

    <div class="pt-4 flex flex-col space-y-3 w-full px-16">
      <Button @click="onContinue">Confirm and continue</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from '@/components/ui/Button.vue';
import PreviewAddLiquidity from '@/components/wizard/previews/PreviewAddLiquidity.vue';
import PreviewSwap from '@/components/wizard/previews/PreviewSwap.vue';
import PreviewTransfer from '@/components/wizard/previews/PreviewTransfer.vue';
import PreviewWithdrawLiquidity from '@/components/wizard/previews/PreviewWithdrawLiquidity.vue';

import { getCurrentStep, ProvideViewerKey } from '../../transactionProcessSelectors';

const injects = inject(ProvideViewerKey);
const { state, send } = injects.actor;
const { t } = useI18n({ useScope: 'global' });

const previewComponentMap = {
  transfer: PreviewTransfer,
  move: PreviewTransfer,
  swap: PreviewSwap,
  addliquidity: PreviewAddLiquidity,
  withdrawliquidity: PreviewWithdrawLiquidity,
  createpool: PreviewAddLiquidity,
};

const titleMap = {
  transfer: 'Review your transfer details',
  move: 'Review your move details',
  swap: 'Review your swap details',
  addliquidity: 'Review your pool liquidity provision',
  withdrawliquidity: 'Review your liquidity withdrawal',
  createpool: 'Review your liquidity pool provision',
};

const step = computed(() => getCurrentStep(state.value.context));

const onContinue = () => {
  send('SIGN');
};
</script>
