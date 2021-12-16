<template>
  <div
    class="max-w-lg flex flex-col items-center justify-center h-full w-full"
    :class="isSwapComponent ? 'space-y-3 pb-8' : 'space-y-5 pb-16'"
  >
    <div>
      <Icon v-if="state.matches('failed.sign')" name="ExclamationIcon" :icon-size="3" class="text-warning" />
      <Icon v-else-if="state.matches('failed.unknown')" name="QuestionIcon" :icon-size="3" class="text-warning" />
      <Icon v-else name="WarningTriangleIcon" :icon-size="3" class="text-negative" />
    </div>

    <div
      v-if="!['failed.sign', 'failed.unknown'].some(state.matches)"
      class="mx-auto max-w-sm leading-copy text-muted mt-2 mb-8"
    >
      <template v-if="transaction.name == 'ibc_forward' || transaction.name == 'ibc_backward'">
        <ChainName :name="getBaseDenomSync(transaction.data.from_chain)" /> &rarr;
        <ChainName :name="transaction.data.to_chain" />
      </template>
    </div>

    <h1 class="font-bold px-6 text-center" :class="isSwapComponent ? 'text-2' : 'text-3'">
      {{ title }}
    </h1>

    <p v-if="state.matches('failed.broadcast')" class="text-center px-6">
      <template v-if="transaction.name == 'ibc_forward' || transaction.name == 'ibc_backward'">
        <i18n-t keypath="components.txHandlingModal.notTransferredAtoB">
          <template #amount>
            <AmountDisplay
              :amount="{
                amount: transaction.data.amount.amount,
                denom: getBaseDenomSync(transaction.data.amount.denom),
              }"
            />
          </template>
          <template #chainA>
            <ChainName :name="transaction.data.from_chain" />
          </template>
          <template #chainB>
            <ChainName :name="transaction.data.to_chain" />
          </template>
        </i18n-t>
      </template>

      <template v-if="transaction.name == 'transfer'">
        <i18n-t keypath="components.txHandlingModal.notTransferred">
          <template #amount>
            <AmountDisplay
              :amount="{
                amount: transaction.data.amount.amount,
                denom: getBaseDenomSync(transaction.data.amount.denom),
              }"
            />
          </template>
          <template #chain>
            <ChainName :name="transaction.data.chain_name" />
          </template>
        </i18n-t>
      </template>

      <template v-if="transaction.name == 'swap'">
        <i18n-t keypath="components.txHandlingModal.failedSwap">
          <template #amount>
            <AmountDisplay
              :amount="{ amount: transaction.data.from.amount, denom: getBaseDenomSync(transaction.data.from.denom) }"
            />
          </template>
          <template #denom>
            <Denom :name="getBaseDenomSync(transaction.data.to.denom)" />
          </template>
        </i18n-t>
      </template>

      <template v-if="transaction.name == 'addliquidity'">
        <i18n-t keypath="components.txHandlingModal.failedAddLiquidity">
          <template #denomA> <Denom :name="getBaseDenomSync(transaction.data.coinA.denom)" /> &middot; </template>
          <template #denomB>
            <Denom :name="getBaseDenomSync(transaction.data.coinB.denom)" />
          </template>
        </i18n-t>
      </template>

      <template v-if="transaction.name == 'createpool'">
        <i18n-t keypath="components.txHandlingModal.failedCreatePool">
          <template #denomA>
            <Denom :name="getBaseDenomSync(transaction.data.coinA.denom)" />
          </template>
          <template #denomB>
            <Denom :name="getBaseDenomSync(transaction.data.coinB.denom)" />
          </template>
        </i18n-t>
      </template>

      <template v-if="transaction.name == 'withdrawliquidity'">
        <i18n-t keypath="components.txHandlingModal.failedWithdrawLiquidity">
          <template #denom>
            <Denom :name="getBaseDenomSync(transaction.data.poolCoin.denom)" />
          </template>
        </i18n-t>
      </template>
    </p>

    <p v-else-if="subtitle" class="text-center px-6">
      {{ subtitle }}
    </p>

    <a
      v-if="state.matches('failed.sign')"
      href="https://faq.keplr.app"
      target="_blank"
      class="font-medium text-link hover:text-link-hover"
    >
      {{ $t('components.txHandlingModal.keplrSupport') }}
    </a>

    <Collapse
      v-if="lastResult || state.context.error"
      :label-open="$t('generic_cta.showDetails')"
      :label-hide="$t('generic_cta.hideDetails')"
      class="mt-8 items-center text-left w-full px-16"
    >
      <Alert status="info" :show-icon="false">
        <ul class="space-y-3">
          <li v-if="lastResult?.status.status">
            <h5 class="font-medium text-text">{{ $t('context.transactions.status') }}</h5>
            <p class="mt-0.5">{{ lastResult.status.status }}</p>
          </li>
          <li v-if="lastResult?.txhash">
            <h5 class="font-medium text-text">{{ $t('context.transactions.ticket') }}</h5>
            <p class="mt-0.5">{{ lastResult.txhash }}</p>
          </li>
          <li v-if="state.context.error">
            <h5 class="font-medium text-text">{{ $t('context.transactions.error') }}</h5>
            <p class="mt-0.5">{{ state.context.error?.message || state.context.error }}</p>
          </li>
        </ul>
      </Alert>
    </Collapse>

    <template v-if="lastResult?.txhash && getExplorerTx(lastResult)">
      <a
        :href="getExplorerTx(lastResult)"
        rel="noopener noreferrer"
        target="_blank"
        class="self-center mt-8 mb-4 p-2 font-medium"
      >
        {{ $t('context.transaction.viewOnExplorer') }} ↗️
      </a>
    </template>

    <div class="pt-5 flex flex-col space-y-3 w-full" :class="isSwapComponent ? 'px-6' : 'px-16'">
      <Button v-if="state.matches('failed.unknown')" @click="onDone">
        {{ t('generic_cta.done') }}
      </Button>

      <Button v-if="state.can('RETRY')" @click="() => send('RETRY')">
        {{ t('components.txHandlingModal.tryAgain') }}
      </Button>

      <Button v-if="state.can('ABORT')" variant="link" @click="onCancel">
        {{ t('generic_cta.cancel') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import Denom from '@/components/common/Denom.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Collapse from '@/components/ui/Collapse.vue';
import Icon from '@/components/ui/Icon.vue';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { getCurrentTransaction, getExplorerTx, ProvideViewerKey } from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const { t } = useI18n({ useScope: 'global' });

const transactionsStore = useTransactionsStore();
const { isSwapComponent, actor, removeTransactionAndClose } = inject(ProvideViewerKey);
const { state, send } = actor;

const lastResult = computed(() => state.value.context.results.slice(-1)[0]);
const transaction = computed(() => getCurrentTransaction(state.value.context));

const titleMap = {
  transfer: t('components.txHandlingModal.txFail'),
  ibc_forward: t('components.txHandlingModal.txFail'),
  ibc_backward: t('components.txHandlingModal.txFail'),
  swap: t('components.txHandlingModal.swapActionFail'),
  addliquidity: t('components.txHandlingModal.addLiqActionFail'),
  withdrawliquidity: t('components.txHandlingModal.withdrawLiqActionFail'),
  createpool: t('components.txHandlingModal.createPoolActionFail'),
};

const title = computed(() => {
  if (lastResult.value?.status === 'IBC_receive_failed') {
    return t('components.txHandlingModal.somethingWentWrong');
  }

  if (state.value.matches('failed.unknown')) {
    return t('components.txHandlingModal.couldNotFetchTransactionResult');
  }

  if (state.value.matches('failed.sign')) {
    return t('components.txHandlingModal.signError');
  }

  if (titleMap[transaction.value.name]) {
    return titleMap[transaction.value.name];
  }

  return t('components.txHandlingModal.somethingWentWrong');
});

const subtitle = computed(() => {
  if (state.value.matches('failed.unknown')) {
    return t('components.txHandlingModal.checkTransactionOnBlockExplorer');
  }

  if (lastResult.value?.status === 'IBC_receive_failed') {
    return t('components.txHandlingModal.revertTx');
  }

  return undefined;
});

const onDone = () => {
  send('ABORT');
  removeTransactionAndClose();
};
const onCancel = () => transactionsStore.toggleCancelModal();
</script>
