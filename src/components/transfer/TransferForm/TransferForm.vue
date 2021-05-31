<template>
  <div>
    <TransferFormRecipient v-if="step === 'recipient'" :form="form" @next="goToStep('amount')" />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, reactive, ref } from 'vue';

import { TransferForm } from '@/types/actions';

import TransferFormRecipient from './TransferFormRecipient.vue';
// import TransferFormAmount from './TransferFormAmount';

type Step = 'recipient' | 'amount';

export default defineComponent({
  name: 'TransferForm',

  components: {
    // TransferFormAmount,
    TransferFormRecipient,
  },

  setup() {
    const form: TransferForm = reactive({
      recipient: '',
      memo: '',
      amount: {
        denom: '',
        amount: 0,
      },
      isTermChecked: true,
    });

    const currentStep = ref<Step>('recipient');
    const goToStep = (step: Step) => (currentStep.value = step);

    provide('transferForm', form);

    return { form, currentStep, goToStep };
  },
});
</script>
