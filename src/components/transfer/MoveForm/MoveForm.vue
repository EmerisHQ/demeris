<template>
  <div class="move-form">
    <template v-if="step === 'amount'">
      <h2 class="move-form__title s-2">Move assets</h2>
      <MoveFormAmount :balances="balances" @next="generateSteps" />
    </template>

    <template v-if="step === 'review'">
      <TxStepsModal :data="steps" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, provide, reactive, ref } from 'vue';

import TxStepsModal from '@/components/common/TxStepsModal.vue';
import { useStore } from '@/store';
import { GasPriceLevel, MoveAction, MoveAssetsForm } from '@/types/actions';
import { Balances } from '@/types/api';
import { actionHandler, feeForSteps } from '@/utils/actionHandler';

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

    const generateSteps = async () => {
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

      const result = await actionHandler(action);
      console.log(await feeForSteps(result, GasPriceLevel.AVERAGE));
      debugger;
      steps.value = result;
      goToStep('review');
    };

    const goToStep = (value: Step) => {
      step.value = value;
    };

    if (!props.step) {
      step.value = 'amount';
    }

    provide('moveForm', form);

    return { steps, generateSteps, form, goToStep };
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
