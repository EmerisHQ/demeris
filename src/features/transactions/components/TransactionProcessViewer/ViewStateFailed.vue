<template>
  <div
    class="max-w-lg flex-1 flex flex-col items-center justify-between h-full w-full"
    :class="isSwapComponent ? 'space-y-3 pb-8' : 'space-y-5 pb-16'"
  >
    <div
      class="flex-1 flex flex-col items-center justify-center w-full"
      :class="isSwapComponent ? 'space-y-3' : 'space-y-5'"
    >
      <div>
        <Icon
          v-if="['failed.genericError', 'failed.sign'].some(state.matches)"
          name="ExclamationIcon"
          :icon-size="3"
          class="text-warning"
        />
        <Icon v-else-if="state.matches('failed.unknown')" name="QuestionIcon" :icon-size="3" class="text-warning" />
        <Icon v-else name="WarningTriangleIcon" :icon-size="3" class="text-negative" />
      </div>

      <div
        v-if="!['failed.sign', 'failed.unknown', 'failed.genericError'].some(state.matches)"
        class="mx-auto max-w-sm leading-copy text-muted mt-2 mb-8"
      >
        <template v-if="transaction.type == 'IBCtransferForward' || transaction.type == 'IBCtransferBackward'">
          <ChainName :name="getBaseDenomSync(transaction.data.chainName)" /> &rarr;
          <ChainName :name="transaction.data.toChain" />
        </template>
      </div>

      <h1 class="font-bold px-6 text-center" :class="isSwapComponent ? 'text-2' : 'text-3'">
        {{ title }}
      </h1>

      <p v-if="state.matches('failed.broadcast')" class="text-center px-6">
        <template v-if="transaction.type == 'IBCtransferForward' || transaction.type == 'IBCtransferBackward'">
          <i18n-t scope="global" keypath="components.txHandlingModal.notTransferredAtoB">
            <template #amount>
              <AmountDisplay
                :amount="{
                  amount: transaction.data.amount.amount,
                  denom: getBaseDenomSync(transaction.data.amount.denom),
                }"
              />
            </template>
            <template #chainA>
              <ChainName :name="transaction.data.chainName" />
            </template>
            <template #chainB>
              <ChainName :name="transaction.data.toChain" />
            </template>
          </i18n-t>
        </template>

        <template v-if="transaction.type == 'transfer'">
          <i18n-t scope="global" keypath="components.txHandlingModal.notTransferred">
            <template #amount>
              <AmountDisplay
                :amount="{
                  amount: transaction.data.amount.amount,
                  denom: getBaseDenomSync(transaction.data.amount.denom),
                }"
              />
            </template>
            <template #chain>
              <ChainName :name="transaction.data.chainName" />
            </template>
          </i18n-t>
        </template>

        <template v-if="transaction.type == 'swap'">
          <i18n-t scope="global" keypath="components.txHandlingModal.failedSwap">
            <template #amount>
              <AmountDisplay
                :amount="{
                  amount: transaction.data[0].from.amount,
                  denom: getBaseDenomSync(transaction.data[0].from.denom),
                }"
              />
            </template>
            <template #denom>
              <Denom :name="getBaseDenomSync(transaction.data[transaction.data.length - 1].to.denom)" />
            </template>
          </i18n-t>
        </template>

        <template v-if="transaction.type == 'addLiquidity'">
          <i18n-t scope="global" keypath="components.txHandlingModal.failedAddLiquidity">
            <template #denomA> <Denom :name="getBaseDenomSync(transaction.data.coinA.denom)" /> &middot; </template>
            <template #denomB>
              <Denom :name="getBaseDenomSync(transaction.data.coinB.denom)" />
            </template>
          </i18n-t>
        </template>

        <template v-if="transaction.type == 'createPool'">
          <i18n-t scope="global" keypath="components.txHandlingModal.failedCreatePool">
            <template #denomA>
              <Denom :name="getBaseDenomSync(transaction.data.coinA.denom)" />
            </template>
            <template #denomB>
              <Denom :name="getBaseDenomSync(transaction.data.coinB.denom)" />
            </template>
          </i18n-t>
        </template>

        <template v-if="transaction.type == 'withdrawLiquidity'">
          <i18n-t scope="global" keypath="components.txHandlingModal.failedWithdrawLiquidity">
            <template #denom>
              <Denom :name="getBaseDenomSync(transaction.data.poolCoin.denom)" />
            </template>
          </i18n-t>
        </template>
      </p>

      <p v-else-if="subtitle" class="text-center px-6">
        {{ subtitle }}
      </p>

      <p
        v-else-if="
          !subtitle && transaction.type === 'swap' && ['default', 'broadcast', 'confirmations'].some(state.matches)
        "
      >
        <i18n-t scope="global" keypath="components.txHandlingModal.notSwapped">
          <template #amount>
            <span class="font-bold">
              <AmountDisplay :amount="lastResult?.transaction.data[0].from" />
            </span>
          </template>
          <template #chainName>
            <ChainName :name="lastResult?.transaction.data[0].chainName" />
          </template>
        </i18n-t>
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
        v-if="(lastResult || state.context.error) && !['failed.unknown', 'failed.sign'].some(state.matches)"
        :label-open="$t('generic_cta.showDetails')"
        :label-hide="$t('generic_cta.hideDetails')"
        class="mt-8 items-center text-left w-full"
        :class="isSwapComponent ? 'px-6' : 'px-16'"
      >
        <Alert status="info" :show-icon="false">
          <ul class="space-y-3">
            <li v-if="state.context.error">
              <h5 class="font-medium text-text">{{ $t('context.transactions.error') }}</h5>
              <p class="mt-0.5">{{ state.context.error?.message || state.context.error }}</p>
            </li>
            <li v-if="lastResult?.status?.status">
              <h5 class="font-medium text-text">{{ $t('context.transactions.status') }}</h5>
              <p class="mt-0.5">{{ lastResult.status.status }}</p>
            </li>
            <li v-if="lastResult?.txhash">
              <h5 class="font-medium text-text">{{ $t('context.transactions.ticket') }}</h5>
              <p class="mt-0.5">{{ lastResult.txhash }}</p>
            </li>
          </ul>
        </Alert>
      </Collapse>

      <template v-if="lastResult?.txhash && getExplorerTx(lastResult) && !state.matches('failed.sign')">
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
import { StepTransaction } from '@/types/actions';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { getCurrentTransaction, getExplorerTx, ProvideViewerKey } from '../../transactionProcessHelpers';
import { useTransactionsStore } from '../../transactionsStore';

const { t } = useI18n({ useScope: 'global' });

const transactionsStore = useTransactionsStore();
const { isSwapComponent, actor, removeTransactionAndClose } = inject(ProvideViewerKey);
const { state, send } = actor;

const lastResult = computed(() => Object.values(state.value.context.results).slice(-1)[0]);
const transaction = computed<StepTransaction>(() => getCurrentTransaction(state.value.context));

const titleMap = {
  transfer: t('components.txHandlingModal.txFail'),
  IBCtransferForward: t('components.txHandlingModal.txFail'),
  IBCtransferBackward: t('components.txHandlingModal.txFail'),
  swap: t('components.txHandlingModal.swapActionFail'),
  addLiquidity: t('components.txHandlingModal.addLiqActionFail'),
  withdrawLiquidity: t('components.txHandlingModal.withdrawLiqActionFail'),
  createPool: t('components.txHandlingModal.createPoolActionFail'),
  stake: t('components.txHandlingModal.stakeActionFail'),
  multistake: t('components.txHandlingModal.stakeActionFail'),
  unstake: t('components.txHandlingModal.unstakeActionFail'),
  switch: t('components.txHandlingModal.switchActionFail'),
  claim: t('components.txHandlingModal.claimActionFail'),
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

  if (state.value.matches('failed.genericError')) {
    return t('components.txHandlingModal.genericError');
  }

  if (titleMap[transaction.value.type]) {
    return titleMap[transaction.value.type];
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
