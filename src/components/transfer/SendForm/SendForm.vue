<template>
  <div class="w-full max-w-lg mx-auto">
    <template v-if="step === 'recipient'">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.sendForm.title') }}</h2>
      <SendFormRecipient @next="goToStep('amount')" />
    </template>

    <template v-else-if="step === 'amount'">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.sendForm.amountSelect') }}</h2>
      <SendFormAmount :balances="balances" :steps="steps" :fees="state.fees" @next="goToReview" />
    </template>

    <template v-else-if="['review', 'send'].includes(step)">
      <TransactionProcessCreator
        :steps="steps"
        action="transfer"
        @pending="
          () => {
            closeModal();
            resetHandler();
          }
        "
        @close="
          (payload) => {
            closeModal(payload);
            resetHandler();
          }
        "
        @previous="$emit('previous')"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, provide, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { actionHandler } from '@/actionhandler';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { MemoTransferAction, SendAddressForm, TransferAction } from '@/types/actions';
import { getBaseDenom } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';
import { getChainFromRecipient } from '@/utils/basic';

import SendFormAmount from './SendFormAmount.vue';
import SendFormRecipient from './SendFormRecipient.vue';

type Step = 'recipient' | 'amount' | 'review' | 'send';

interface Props {
  balances: EmerisAPI.Balances;
  step?: Step;
}

const props = withDefaults(defineProps<Props>(), { step: undefined });

const emit = defineEmits<{
  (e: 'update:step', value: any): void;
  (e: 'previous'): void;
}>();

const steps = ref([]);
const store = useStore() as RootStoreTyped;
const router = useRouter();

const form: SendAddressForm = reactive({
  recipient: '',
  chain_name: '',
  memo: '',
  balance: {
    denom: '',
    amount: '',
  },
  isTermChecked: false,
});

const state = reactive({
  fees: {},
});

const step = computed({
  get: () => props.step,
  set: (value) => emit('update:step', value),
});

const closeModal = (payload?: any) => {
  if (payload?.source === 'send-btn' || payload?.source === 'move-btn') {
    return;
  }

  router.push('/');
};

watch(
  () => [form.balance.amount, form.balance.denom, form.chain_name],
  async () => {
    if (form.balance.amount != '0' && form.balance.denom != '' && form.chain_name != '' && step.value != 'review') {
      const precision =
        store.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: await getBaseDenom(form.balance.denom, form.chain_name),
        }) || 6;
      const action: TransferAction | MemoTransferAction = {
        name: form.memo && form.memo != '' ? 'memo-transfer' : 'transfer',
        memo: form.memo,
        params: {
          from: {
            amount: new BigNumber(form.balance.amount).shiftedBy(precision).toString(),
            denom: form.balance.denom,
            chain_name: form.chain_name,
          },
          to: {
            chain_name: getChainFromRecipient(form.recipient),
            address: form.recipient,
          },
        },
      };
      steps.value = await actionHandler(action);
    }
  },
);
const goToReview = async () => {
  event('review_tx', { event_label: 'Reviewing send tx', event_category: 'transactions' });
  goToStep('review');
};

const resetHandler = () => {
  form.recipient = '';
  form.chain_name = '';
  form.memo = '';
  form.balance = {
    denom: '',
    amount: undefined,
  };
  form.isTermChecked = false;
  steps.value = [];

  goToStep(undefined);
};
const goToStep = (value: Step) => {
  step.value = value;
};

if (!props.step) {
  step.value = 'recipient';
}

provide('transferForm', form);
</script>

<style lang="scss"></style>
