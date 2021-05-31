<template>
  <form class="send-form">
    <template v-if="step === 'recipient'">
      <h2 class="send-form__title s-2">Send to an address</h2>
      <SendFormRecipient @next="goToStep('amount')" />
    </template>

    <template v-if="step === 'amount'">
      <h2 class="send-form__title s-2">Enter an amount</h2>
      <SendFormAmount :form="form" @next="goToStep('review')" />
    </template>

    <template v-if="step === 'review'">
      <h2 class="send-form__title s-2">Review your transfer details</h2>
    </template>
  </form>
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
      isTermChecked: false,
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

<style lang="scss">
.send-form {
  &__title {
    text-align: center;
    margin-bottom: 4.8rem;
  }
}

.form {
  &__field {
    label {
      display: block;
      font-size: 1.2rem;
      color: var(--muted);
      margin-bottom: 0.8rem;
    }

    & + & {
      margin-top: 2.4rem;
    }
  }
}
</style>
