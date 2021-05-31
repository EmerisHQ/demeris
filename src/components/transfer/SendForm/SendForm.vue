<template>
  <div>
    <template v-if="step === 'recipient'">
      <h2>Send to an address</h2>
      <SendFormRecipient @next="goToStep('amount')" />
    </template>

    <template v-if="step === 'amount'">
      <h2>Enter an amount</h2>
      <SendFormAmount :form="form" @next="goToStep('review')" />
    </template>

    <template v-if="step === 'review'">
      <h2>Review your transfer details</h2>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, provide, reactive, ref } from 'vue';

import { TransferForm } from '@/types/actions';

import SendFormAmount from './SendFormAmount.vue';
import SendFormRecipient from './SendFormRecipient.vue';

type Step = 'recipient' | 'amount' | 'review';

export default defineComponent({
  name: 'SendForm',

  components: {
    SendFormAmount,
    SendFormRecipient,
  },

  props: {
    step: {
      type: String as PropType<Step>,
      default: 'recipient',
    },
  },

  emits: ['update:step'],

  setup(props, { emit }) {
    const form: TransferForm = reactive({
      recipient: '',
      memo: '',
      amount: {
        denom: '',
        amount: 0,
      },
      isTermChecked: true,
    });

    const step = ref(props.step as Step);

    const goToStep = (value: Step) => {
      step.value = value;
      emit('update:step', step);
    };

    provide('transferForm', form);

    return { form, goToStep };
  },
});
</script>
