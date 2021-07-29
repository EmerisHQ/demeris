<template>
  <div class="move-form">
    <template v-if="step === 'amount'">
      <h2 class="move-form__title s-2">{{ $t('components.moveForm.title') }}</h2>
      <MoveFormAmount v-if="balances" :balances="balances" :fees="state.fees" @next="generateSteps" />

      <div class="move-form__fees">
        <FeeLevelSelector
          v-if="steps.length > 0"
          v-model:gasPriceLevel="state.gasPrice"
          :steps="steps"
          @update:fees="state.fees = $event"
        />
      </div>
    </template>

    <template v-else>
      <TxStepsModal
        v-if="steps.length > 0"
        :data="steps"
        :gas-price-level="state.gasPrice"
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

import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import { useStore } from '@/store';
import { MoveAction, MoveAssetsForm } from '@/types/actions';
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

    const state = reactive({
      fees: {},
      gasPrice: store.getters['demeris/getPreferredGasPriceLevel'],
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
        const precision = store.getters['demeris/getDenomPrecision']({ name: form.balance.denom }) || 6;
        const action: MoveAction = {
          name: 'move',
          params: {
            from: {
              amount: {
                amount: new BigNumber(form.balance.amount).shiftedBy(precision).toString(),
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
      } else {
        steps.value = [];
      }
    });

    const generateSteps = async () => {
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

    return { steps, state, generateSteps, form, goToStep, resetHandler };
  },
});
</script>

<style lang="scss">
.move-form {
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
</style>
