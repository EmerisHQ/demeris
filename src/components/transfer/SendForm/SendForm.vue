<template>
  <div class="send-form">
    <template v-if="step === 'recipient'">
      <h2 class="send-form__title s-2">Send to an address</h2>
      <SendFormRecipient @next="goToStep('amount')" />
    </template>

    <template v-if="step === 'amount'">
      <h2 class="send-form__title s-2">Enter an amount</h2>
      <SendFormAmount @next="goToStep('review')" />
    </template>

    <template v-if="step === 'review'">
      <h2 class="send-form__title s-2">Review your transfer details</h2>

      <dl>
        <dt class="w-bold">Recipient</dt>
        <dd>{{ form.recipient }}</dd>

        <dt class="w-bold mt-10">Memo</dt>
        <dd>{{ form.memo || '-' }}</dd>

        <dt class="w-bold mt-10">Amount</dt>
        <dd>{{ form.balance.amount }}{{ form.balance.denom }}</dd>
      </dl>

      <Button class="mt-10" name="Confirm and continue" @click="goToStep('send')" />
    </template>

    <template v-if="step === 'send'"> TODO </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, provide, reactive } from 'vue';

import Button from '@/components/ui/Button.vue';
import { SendAddressForm } from '@/types/actions';

import SendFormAmount from './SendFormAmount.vue';
import SendFormRecipient from './SendFormRecipient.vue';

type Step = 'recipient' | 'amount' | 'review';

export default defineComponent({
  name: 'SendForm',

  components: {
    Button,
    SendFormAmount,
    SendFormRecipient,
  },

  props: {
    step: {
      type: String as PropType<Step>,
      default: undefined,
    },
  },

  emits: ['update:step'],

  setup(props, { emit }) {
    const form: SendAddressForm = reactive({
      recipient: '',
      memo: '',
      balance: {
        denom: '',
        amount: undefined,
      },
      isTermChecked: false,
    });

    const step = computed({
      get: () => props.step,
      set: (value) => emit('update:step', value),
    });

    const goToStep = (value: Step) => {
      step.value = value;
    };

    if (!props.step) {
      step.value = 'recipient';
    }

    provide('transferForm', form);

    return { form, goToStep };
  },
});
</script>

<style lang="scss">
.send-form {
  &__title {
    text-align: center;
    margin-bottom: 3.2rem;
  }
}

.form {
  &__field {
    & > label {
      display: block;
      font-size: 1.2rem;
      color: var(--muted);
      margin-bottom: 0.8rem;
    }

    & + & {
      margin-top: 3.2rem;
    }
  }
}
</style>
