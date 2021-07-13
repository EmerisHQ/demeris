<template>
  <div class="move-form">
    <template v-if="step === 'amount'">
      <h2 class="move-form__title s-2">Move assets</h2>
      <MoveFormAmount :balances="balances" @next="generateSteps" />

      <FeeLevelSelector v-if="steps.length > 0" v-model:gasPriceLevel="gasPrice" :steps="steps" />
    </template>

    <template v-if="step === 'review'">
      <TxStepsModal :data="steps" :gas-price-level="gasPrice" @complete="goToStep(complete)" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, provide, reactive, ref, watch } from 'vue';

import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import { useStore } from '@/store';
import { MoveAction, MoveAssetsForm } from '@/types/actions';
import { GasPriceLevel } from '@/types/actions';
import { Balances } from '@/types/api';
import { actionHandler } from '@/utils/actionHandler';

import MoveFormAmount from './MoveFormAmount.vue';

type Step = 'amount' | 'review' | 'move';

export default defineComponent({
  name: 'MoveForm',

  components: {
    MoveFormAmount,
    TxStepsModal,
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
    const gasPrice = ref(store.getters['demeris/getPreferredGasPriceLevel']);
    const form: MoveAssetsForm = reactive({
      balance: {
        denom: '',
        amount: '0',
      },
      on_chain: '',
      to_chain: '',
    });

    const step = computed({
      get: () => props.step,
      set: (value) => emit('update:step', value),
    });

    watch(
      () => [form.balance.amount, form.balance.denom, form.on_chain, form.to_chain],
      async () => {
        if (form.balance.amount != '0' && form.balance.denom != '' && form.on_chain != '' && form.to_chain != '') {
          const precision = store.getters['demeris/getDenomPrecision']({
            name: form.balance.denom,
          });
          const action: MoveAction = {
            name: 'move',
            params: {
              from: {
                amount: {
                  amount: (+form.balance.amount * Math.pow(10, precision)).toString(),
                  denom: form.balance.denom,
                },
                chain_name: form.on_chain,
              },
              to: {
                chain_name: form.to_chain,
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

    const goToStep = (value: Step) => {
      step.value = value;
    };

    if (!props.step) {
      step.value = 'amount';
    }

    provide('moveForm', form);

    return { steps, generateSteps, form, goToStep, GasPriceLevel, gasPrice };
  },
});
</script>

<style lang="scss">
.move-form {
  &__title {
    text-align: center;
    margin-bottom: 3.2rem;
  }
}
</style>
