<template>
  <div class="send-form">
    <template v-if="step === 'recipient'">
      <h2 class="send-form__title s-2">{{ $t('components.sendForm.title') }}</h2>
      <SendFormRecipient @next="goToStep('amount')" />
    </template>

    <template v-else-if="step === 'amount'">
      <h2 class="send-form__title s-2">{{ $t('components.sendForm.amountSelect') }}</h2>
      <SendFormAmount :balances="balances" @next="goToStep('review')" />
      <div class="send-form__fees">
        <FeeLevelSelector v-if="steps.length > 0" v-model:gasPriceLevel="gasPrice" :steps="steps" />
      </div>
    </template>

    <template v-else>
      <TxStepsModal
        :data="steps"
        :gas-price-level="gasPrice"
        :back-route="{ name: 'Portfolio' }"
        action-name="transfer"
        @transacting="goToStep('send')"
        @failed="goToStep('review')"
        @reset="resetHandler"
        @finish="resetHandler"
      />
    </template>
  </div>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, PropType, provide, reactive, ref, watch } from 'vue';

import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import { useStore } from '@/store';
import { SendAddressForm, TransferAction } from '@/types/actions';
import { Balances } from '@/types/api';
import { actionHandler } from '@/utils/actionHandler';
import { getChainFromRecipient } from '@/utils/basic';

import SendFormAmount from './SendFormAmount.vue';
import SendFormRecipient from './SendFormRecipient.vue';

type Step = 'recipient' | 'amount' | 'review' | 'send';

export default defineComponent({
  name: 'SendForm',

  components: {
    FeeLevelSelector,
    TxStepsModal,
    SendFormAmount,
    SendFormRecipient,
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

    const gasPrice = computed(() => {
      return store.getters['demeris/getPreferredGasPriceLevel'];
    });

    const step = computed({
      get: () => props.step,
      set: (value) => emit('update:step', value),
    });

    watch(
      () => [form.balance.amount, form.balance.denom, form.chain_name],
      async () => {
        if (form.balance.amount != '0' && form.balance.denom != '' && form.chain_name != '') {
          const precision = store.getters['demeris/getDenomPrecision']({ name: form.balance.denom }) || 6;

          const action: TransferAction = {
            name: 'transfer',
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

    return { steps, form, goToStep, generateSteps, resetHandler, gasPrice };
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
