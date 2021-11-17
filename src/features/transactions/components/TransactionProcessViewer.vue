<template>
  <div v-if="hasFoundService" class="flex items-center justify-center">
    <StateIBCConfirmation v-if="state.matches('ibcConfirmation')" />
    <StateReview v-else-if="state.matches('review')" />
    <StateSigning v-else-if="state.matches('signing')" />
    <StateTransacting v-else-if="state.matches('transacting')" />
    <StateReceipt v-else-if="state.matches('receipt') || state.matches('success')" />
    <StateFailed v-else-if="state.matches('failed')" />
    <div v-else-if="state.matches('aborted')">Aborted</div>
    <div v-else-if="state.matches('waitingPreviousTransaction')">Pending</div>
    <div v-else>Loading</div>
  </div>

  <div v-else>
    <h1>Not found</h1>
  </div>
</template>

<script lang="tsx" setup>
import { useActor } from '@xstate/vue';
import { computed, defineComponent, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import Button from '@/components/ui/Button.vue';
import Collapse from '@/components/ui/Collapse.vue';
import PreviewTransfer from '@/components/wizard/previews/PreviewTransfer.vue';
import TransferInterstitialConfirmation from '@/components/wizard/TransferInterstitialConfirmation.vue';
import { IBCForwardsData, TransferData } from '@/types/actions';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { getExplorerTx } from '../transactionProcessSelectors';
import { useTransactionsStore } from '../transactionsStore';

const props = defineProps({
  stepHash: {
    type: String,
    default: undefined,
  },
});

const emits = defineEmits(['close']);

const transactionStore = useTransactionsStore();
const transactionService = computed(() => transactionStore.transactions[props.stepHash]);
const hasFoundService = computed(() => !!transactionService.value);

const { state, send } = useActor(transactionService.value);

const StateIBCConfirmation = defineComponent({
  name: 'StateIBConfirmation',
  setup() {
    return () => (
      <div>
        <TransferInterstitialConfirmation
          action={state.value.context.input.action}
          steps={state.value.context.input.steps}
          onContinue={() => send('CONTINUE')}
        />
      </div>
    );
  },
});

const StateReview = defineComponent({
  name: 'StateReview',
  setup() {
    return () => (
      <div>
        <h1>Review</h1>
        <button onClick={() => send('SIGN')}>Sign</button>
      </div>
    );
  },
});

const StateSigning = defineComponent({
  name: 'StateSigning',
  setup() {
    return () => <h2>Signing</h2>;
  },
});

const StateTransacting = defineComponent({
  name: 'StateTransacting',
  setup() {
    const onCancel = () => {
      send('ABORT');
    };

    return () => (
      <div>
        <h1>Transferring</h1>
        <p>This may take up to 1 minute.</p>
        {state.value.can('ABORT') && <Button onClick={onCancel}>Cancel</Button>}
      </div>
    );
  },
});

const StateReceipt = defineComponent({
  name: 'StateReceipt',
  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const lastResult = computed(() => state.value.context.results.slice(-1)[0]);
    const transaction = computed(() => lastResult.value.transaction);
    const name = computed(() => transaction.value.name);

    const titleMap = {
      ibc_backward: t('components.txHandlingModal.transferred'),
      ibc_forward: t('components.txHandlingModal.transferred'),
      transfer: t('components.txHandlingModal.transferred'),
      swap: t('components.txHandlingModal.swapActionComplete'),
      addliquidity: t('components.txHandlingModal.addLiqActionComplete'),
      withdrawliquidity: t('components.txHandlingModal.withdrawLiqActionComplete'),
      createpool: t('components.txHandlingModal.createPoolActionComplete'),
    };

    const onDone = () => {
      transactionStore.removePendingTransaction(props.stepHash);
      emits('close');
    };

    const onNext = () => {
      send('CONTINUE');
    };

    return () => (
      <div class="max-w-lg flex flex-col space-y-5 items-center w-full pb-16">
        <img src={require('@/assets/images/silver-surfer-1-light.png')} class="w-36 transform" />
        <h1 class="text-3 font-bold">{titleMap[name.value]}</h1>

        <div class="flex flex-col items-center justify-center">
          {name.value === 'transfer' ||
            (name.value.startsWith('ibc') && (
              <>
                <p class="font-medium text-1">
                  <AmountDisplay
                    amount={{
                      amount: (transaction.value.data as TransferData).amount.amount,
                      denom: getBaseDenomSync((transaction.value.data as TransferData).amount.denom),
                    }}
                  />
                </p>

                {name.value.startsWith('ibc') && (
                  <div class="mt-0.5 text-muted">
                    <ChainName name={(transaction.value.data as IBCForwardsData).from_chain} /> &rarr;&nbsp;
                    <ChainName name={(transaction.value.data as IBCForwardsData).to_chain} />
                  </div>
                )}
              </>
            ))}
        </div>

        {state.value.matches('success') && (
          <Collapse labelOpen="Show details" labelHide="Hide details" class="items-center pt-5 w-full">
            <div class="border border-border rounded-lg w-full py-4 px-6 flex flex-col">
              <PreviewTransfer
                response={state.value.context.input.steps[lastResult.value.stepIndex]}
                fees={{}}
                bordered={false}
                class="border-b"
              />

              {!!getExplorerTx(lastResult.value) && (
                <a
                  href={getExplorerTx(lastResult.value)}
                  rel="noopener noreferrer"
                  target="_blank"
                  class="self-center mt-8 mb-4 p-2 font-medium"
                >
                  {t('context.transaction.viewOnExplorer')} ↗️
                </a>
              )}
            </div>
          </Collapse>
        )}

        <div class="pt-5 flex flex-col space-y-3 w-full px-16">
          {state.value.matches('receipt') && <Button onClick={onNext}>Next</Button>}
          {state.value.matches('success') && (
            <Button variant="secondary" onClick={onDone}>
              Send another asset &rarr;
            </Button>
          )}
          {state.value.matches('success') && <Button onClick={onDone}>Done</Button>}
        </div>
      </div>
    );
  },
});

const StateFailed = defineComponent({
  name: 'StateFailed',
  setup() {
    const onAbort = () => {
      transactionStore.removePendingTransaction(props.stepHash);
      emits('close');
    };

    return () => (
      <div>
        <h1>Failed</h1>
        {state.value.can('ABORT') && <button onClick={onAbort}>Cancel</button>}
      </div>
    );
  },
});
</script>
