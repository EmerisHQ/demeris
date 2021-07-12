<template>
  <div class="send-form">
    <template v-if="step === 'recipient'">
      <h2 class="send-form__title s-2">Send to an address</h2>
      <SendFormRecipient @next="goToStep('amount')" />
    </template>

    <template v-if="step === 'amount'">
      <h2 class="send-form__title s-2">Enter an amount</h2>
      <SendFormAmount :balances="balances" @next="generateSteps" />
      <div class="send-form__fees">
        <FeeLevelSelector v-if="steps.length > 0" v-model:gasPriceLevel="gasPrice" :steps="steps" />
      </div>
    </template>

    <template v-if="step === 'review'">
      <TxStepsModal :data="steps" :gas-price-level="gasPrice" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, provide, reactive, ref } from 'vue';

import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import { useStore } from '@/store';
import { GasPriceLevel, SendAddressForm, TransferAction } from '@/types/actions';
import { Balances } from '@/types/api';
import { actionHandler } from '@/utils/actionHandler';

import SendFormAmount from './SendFormAmount.vue';
import SendFormRecipient from './SendFormRecipient.vue';

type Step = 'recipient' | 'amount' | 'review';

export default defineComponent({
  name: 'SendForm',

  components: {
    TxStepsModal,
    SendFormAmount,
    SendFormRecipient,
    FeeLevelSelector,
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

  emits: ['update:step'],

  setup(props, { emit }) {
    const steps = ref([]);
    const store = useStore();
    const gasPrice = ref(store.getters['getPreferredGasPriceLevel']);
    const form: SendAddressForm = reactive({
      recipient: '',
      chain_name: '',
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

    const generateSteps = async () => {
      const precision = store.getters['demeris/getDenomPrecision']({
        name: form.balance.denom,
      });

      const action: TransferAction = {
        name: 'transfer',
        params: {
          from: {
            amount: {
              amount: (+form.balance.amount * Math.pow(10, precision)).toString(),
              denom: form.balance.denom,
            },
            chain_name: form.chain_name,
          },
          to: {
            chain_name: form.chain_name,
            address: form.recipient,
          },
        },
      };

      const result = await actionHandler(action);
      steps.value = result;
      goToStep('review');
    };

    const goToStep = (value: Step) => {
      step.value = value;
    };

    if (!props.step) {
      step.value = 'recipient';
    }

    provide('transferForm', form);

    return { steps, form, goToStep, generateSteps, gasPrice };
  },
});
</script>

<style lang="scss">
.send-form {
  &__title {
    text-align: center;
    margin-bottom: 3.2rem;
  }

  &__fees {
    margin-top: 2.4rem;
    margin-left: -2.4rem;
    margin-right: -2.4rem;
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
