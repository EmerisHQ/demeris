<template>
  <div class="w-full max-w-lg mx-auto">
    <template v-if="step === 'recipient'">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.sendForm.title') }}</h2>
      <SendFormRecipient @next="goToStep('amount')" />
    </template>

    <template v-else-if="step === 'amount'">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.sendForm.amountSelect') }}</h2>
      <SendFormAmount :balances="balances" :steps="steps" :fees="state.fees" @next="generateSteps" />
    </template>

    <template v-else-if="['review', 'send'].includes(step)">
      <FeatureRunningConditional name="TRANSACTIONS_CENTER">
        <TxStepsModal
          :data="steps"
          :back-route="{ name: 'Portfolio' }"
          action-name="transfer"
          @transacting="goToStep('send')"
          @failed="goToStep('review')"
          @reset="resetHandler"
          @finish="resetHandler"
        />

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
            () => {
              closeModal();
              resetHandler();
            }
          "
          @previous="$emit('previous')"
        />
      </FeatureRunningConditional>
    </template>
  </div>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, PropType, provide, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { SendAddressForm, TransferAction } from '@/types/actions';
import { Balances } from '@/types/api';
import { actionHandler, getBaseDenom } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';
import { getChainFromRecipient } from '@/utils/basic';

import SendFormAmount from './SendFormAmount.vue';
import SendFormRecipient from './SendFormRecipient.vue';

type Step = 'recipient' | 'amount' | 'review' | 'send';

export default defineComponent({
  name: 'SendForm',

  components: {
    TxStepsModal,
    SendFormAmount,
    SendFormRecipient,
    TransactionProcessCreator,
    FeatureRunningConditional,
  },

  props: {
    balances: {
      type: Object as PropType<Balances>,
      required: true,
    },
    step: {
      type: String as PropType<Step>,
      default: undefined,
    },
  },

  emits: ['update:step', 'previous'],

  setup(props, { emit }) {
    const steps = ref([]);
    const store = useStore();
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

    const closeModal = () => {
      router.push('/');
    };

    watch(
      () => [form.balance.amount, form.balance.denom, form.chain_name],
      async () => {
        if (form.balance.amount != '0' && form.balance.denom != '' && form.chain_name != '' && step.value != 'review') {
          const precision =
            store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
              name: await getBaseDenom(form.balance.denom, form.chain_name),
            }) || 6;
          const action: TransferAction = {
            name: form.memo && form.memo != '' ? 'memo-transfer' : 'transfer',
            memo: form.memo,
            params: {
              from: {
                amount: {
                  amount: new BigNumber(form.balance.amount).shiftedBy(precision).toString(),
                  denom: form.balance.denom,
                },
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
    const generateSteps = async () => {
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

      goToStep('recipient');
    };
    const goToStep = (value: Step) => {
      step.value = value;
    };

    if (!props.step) {
      step.value = 'recipient';
    }

    provide('transferForm', form);

    return { steps, form, goToStep, generateSteps, resetHandler, state, closeModal };
  },
});
</script>

<style lang="scss"></style>
