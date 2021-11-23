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

    <p v-if="!['failed.sign', 'failed.unknown'].some(state.matches)" class="text-muted">
      <template v-if="transaction.name == 'ibc_forward' || transaction.name == 'ibc_backward'">
        <ChainName :name="getBaseDenomSync(transaction.data.from_chain)" /> &rarr;
        <ChainName :name="transaction.data.to_chain" />
      </template>
    </p>

    <h1 class="font-bold px-6 text-center" :class="isSwapComponent ? 'text-2' : 'text-3'">
      {{ title }}
    </h1>

    <p></p>

    <div class="pt-5 flex flex-col space-y-3 w-full" :class="isSwapComponent ? 'px-6' : 'px-16'">
      <Button v-if="state.done" @click="removeTransactionAndClose">{{ t('generic_cta.done') }}</Button>
      <Button v-if="state.can('RETRY')" @click="() => send('RETRY')">
        {{
          t('components.txHandlingModal.tryAgain')
        }}
      </Button>
      <Button v-if="state.can('ABORT')" variant="link" @click="onCancel">{{ t('generic_cta.cancel') }}</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import ChainName from '@/components/common/ChainName.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { ProvideViewerKey } from '../../transactionProcessSelectors';

const { t } = useI18n({ useScope: 'global' });

const { isSwapComponent, actor, removeTransactionAndClose } = inject(ProvideViewerKey);
const { state, send } = actor;

const lastResult = computed(() => state.value.context.results.slice(-1)[0]);
const transaction = computed(() => lastResult.value.transaction);

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
  if (state.value.matches('failed.unknown')) {
    return t('components.txHandlingModal.couldNotFetchTransactionResult');
  }

  if (state.value.matches('failed.sign')) {
    return t('components.txHandlingModal.signError');
  }

  return titleMap[transaction.value.name];
});

const onCancel = () => {
  send('ABORT');
  removeTransactionAndClose();
};
</script>
