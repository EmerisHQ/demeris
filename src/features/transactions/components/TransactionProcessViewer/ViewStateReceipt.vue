<template>
  <div class="max-w-lg flex flex-col space-y-5 items-center w-full pb-16">
    <div class="transferred-image block bg-no-repeat bg-center bg-contain w-44 h-44" />

    <h1 class="text-3 font-bold">
      {{ titleMap[transaction.name] }}
    </h1>

    <div class="flex flex-col items-center justify-center">
      <template v-if="transaction.name === 'transfer' || transaction.name.startsWith('ibc')">
        <p class="font-medium text-1">
          <AmountDisplay
            :amount="{
              amount: transaction.data.amount.amount,
              denom: getBaseDenomSync(transaction.data.amount.denom),
            }"
          />
        </p>

        <template v-if="transaction.name.startsWith('ibc')">
          <div class="mt-0.5 text-muted">
            <ChainName :name="transaction.data.from_chain" /> &rarr;
            <ChainName :name="transaction.data.to_chain" />
          </div>
        </template>
      </template>

      <template v-if="transaction.name === 'swap'">
        <p class="text-muted">Swapped on the Cosmos Hub</p>
      </template>
    </div>

    <template v-if="state.matches('success')">
      <Collapse label-open="Show details" label-hide="Hide details" class="items-center pt-5 w-full">
        <div class="border border-border rounded-lg w-full py-4 px-6 flex flex-col">
          <component
            :is="previewComponentMap[transaction.name]"
            :response="state.context.input.steps[lastResult.stepIndex]"
            :step="state.context.input.steps[lastResult.stepIndex]"
            :context="state.context.input.action === 'swap' ? 'widget' : 'default'"
            :bordered="false"
            :fees="{}"
            class="border-b"
          />

          <template v-if="getExplorerTx(lastResult)">
            <a
              :href="getExplorerTx(lastResult)"
              rel="noopener noreferrer"
              target="_blank"
              class="self-center mt-8 mb-4 p-2 font-medium"
            >
              {{ $t('context.transaction.viewOnExplorer') }} ↗️
            </a>
          </template>
        </div>
      </Collapse>
    </template>

    <div class="pt-5 flex flex-col space-y-3 w-full px-16">
      <Button v-if="state.matches('receipt')" @click="onNext">Next</Button>

      <template v-if="state.matches('success')">
        <template v-if="transaction.name === 'transfer' || transaction.name.startsWith('ibc')">
          <Button variant="secondary" @click="onNext">Send another asset &rarr;</Button>
        </template>

        <template v-if="transaction.name === 'swap'">
          <Button variant="secondary">Send TODO</Button>
        </template>

        <Button @click="injects.removeTransactionAndClose()">Done</Button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import Button from '@/components/ui/Button.vue';
import Collapse from '@/components/ui/Collapse.vue';
import PreviewAddLiquidity from '@/components/wizard/previews/PreviewAddLiquidity.vue';
import PreviewSwap from '@/components/wizard/previews/PreviewSwap.vue';
import PreviewTransfer from '@/components/wizard/previews/PreviewTransfer.vue';
import PreviewWithdrawLiquidity from '@/components/wizard/previews/PreviewWithdrawLiquidity.vue';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { getExplorerTx, ProvideViewerKey } from '../../transactionProcessSelectors';

const injects = inject(ProvideViewerKey);

const { state, send } = injects.actor;
const { t } = useI18n({ useScope: 'global' });

const lastResult = computed(() => state.value.context.results.slice(-1)[0]);
const transaction = computed(() => lastResult.value.transaction);

const titleMap = {
  ibc_backward: t('components.txHandlingModal.transferred'),
  ibc_forward: t('components.txHandlingModal.transferred'),
  transfer: t('components.txHandlingModal.transferred'),
  swap: t('components.txHandlingModal.swapActionComplete'),
  addliquidity: t('components.txHandlingModal.addLiqActionComplete'),
  withdrawliquidity: t('components.txHandlingModal.withdrawLiqActionComplete'),
  createpool: t('components.txHandlingModal.createPoolActionComplete'),
};

const previewComponentMap = {
  ibc_backward: PreviewTransfer,
  ibc_forward: PreviewTransfer,
  transfer: PreviewTransfer,
  swap: PreviewSwap,
  addliquidity: PreviewAddLiquidity,
  withdrawliquidity: PreviewWithdrawLiquidity,
  createpool: PreviewAddLiquidity,
};

const onNext = () => {
  send('CONTINUE');
};
</script>

<style scoped>
.transferred-image {
  background-image: url('~@/assets/images/silver-surfer-1-light.png');
}

@media (prefers-color-scheme: dark) {
  .transferred-image {
    background-image: url('~@/assets/images/silver-surfer-1-dark.png');
  }
}
</style>
