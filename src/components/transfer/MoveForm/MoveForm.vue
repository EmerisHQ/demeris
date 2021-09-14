<template>
  <div class="w-full max-w-lg mx-auto">
    <template v-if="step === 'amount'">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.moveForm.title') }}</h2>
      <MoveFormAmount v-if="balances" :balances="balances" :steps="steps" @next="generateSteps" />
    </template>

    <template v-else>
      <TxStepsModal
        v-if="steps.length > 0"
        :data="steps"
        :gas-price-level="gasPrice"
        :back-route="{ name: 'Portfolio' }"
        action-name="move"
        @transacting="goToStep('move')"
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

import TxStepsModal from '@/components/common/TxStepsModal.vue';
import { useStore } from '@/store';
import { MoveAction, MoveAssetsForm } from '@/types/actions';
import { Balances } from '@/types/api';
import { actionHandler, getBaseDenom } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';

import MoveFormAmount from './MoveFormAmount.vue';

type Step = 'amount' | 'review' | 'move';

export default defineComponent({
  name: 'MoveForm',

  components: {
    MoveFormAmount,
    TxStepsModal,
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
    const gasPrice = computed(() => {
      return store.getters['demeris/getPreferredGasPriceLevel'];
    });

    const form: MoveAssetsForm = reactive({
      balance: {
        denom: '',
        amount: '',
      },
      on_chain: '',
      to_chain: '',
    });

    const step = computed({
      get: () => props.step,
      set: (value) => emit('update:step', value),
    });

    watch(form, async () => {
      if (form.balance.amount != '0' && form.balance.denom != '' && form.on_chain != '' && form.to_chain != '') {
        const precision =
          store.getters['demeris/getDenomPrecision']({ name: await getBaseDenom(form.balance.denom, form.on_chain) }) ||
          6;

        const action: MoveAction = {
          name: 'move',
          params: {
            from: {
              amount: {
                amount: new BigNumber(form.balance.amount).shiftedBy(precision).toString(),
                denom: await form.balance.denom,
              },
              chain_name: form.on_chain,
            },
            to: {
              chain_name: form.to_chain,
            },
          },
        };
        steps.value = await actionHandler(action);
      } else {
        steps.value = [];
      }
    });

    const generateSteps = async () => {
      event('review_tx', { event_label: 'Reviewing move tx', event_category: 'transactions' });
      goToStep('review');
    };

    const goToStep = (value: Step) => {
      step.value = value;
    };

    const resetHandler = () => {
      form.balance = {
        denom: '',
        amount: '',
      };
      form.on_chain = '';
      form.to_chain = '';
      steps.value = [];

      goToStep('amount');
    };

    if (!props.step) {
      step.value = 'amount';
    }

    provide('moveForm', form);

    return { gasPrice, steps, generateSteps, form, goToStep, resetHandler };
  },
});
</script>

<style lang="scss"></style>
