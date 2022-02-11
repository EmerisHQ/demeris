<template>
  <div class="w-full mx-auto">
    <template v-if="step == 'validator'">
      <h2 class="text-3 font-bold pt-8 text-left">{{ $t('components.switchForm.selectTitle') }}</h2>
      <ValidatorsTable
        :validator-list="validators"
        :disabled-list="validatorsToDisable"
        :table-style="'list'"
        @selectValidator="addValidator"
      />
    </template>
    <template v-else-if="step === 'amount'">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.stakeForm.title') }}</h2>

      <SwitchValidatorAmount
        :validators="validators"
        :size="'md'"
        :steps="steps"
        @previous="selectAnother"
        @next="generateSteps"
      />
    </template>

    <template v-else-if="['review', 'stake'].includes(step)">
      <FeatureRunningConditional name="TRANSACTIONS_CENTER">
        <template #deactivated>
          <TxStepsModal
            v-if="steps.length"
            :data="steps"
            :gas-price-level="gasPrice"
            :back-route="{ name: 'Portfolio' }"
            action-name="unstake"
            @transacting="goToStep('stake')"
            @failed="goToStep('review')"
            @reset="resetHandler"
            @finish="resetHandler"
          />
        </template>

        <TransactionProcessCreator
          v-if="steps.length"
          :steps="steps"
          action="unstake"
          @pending="closeModal"
          @close="closeModal"
          @previous="$emit('previous')"
        />
      </FeatureRunningConditional>
    </template>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, provide, reactive, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import SwitchValidatorAmount from '@/components/stake/SwitchForm/SwitchValidatorAmount.vue';
import ValidatorsTable from '@/components/stake/ValidatorsTable.vue';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { RedelegateAction, RedelegateForm } from '@/types/actions';
import { actionHandler } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';

type Step = 'validator' | 'amount' | 'review' | 'stake';

export default defineComponent({
  name: 'SwitchForm',

  components: {
    TransactionProcessCreator,
    TxStepsModal,
    FeatureRunningConditional,
    ValidatorsTable,
    SwitchValidatorAmount,
  },

  props: {
    step: {
      type: String as PropType<Step>,
      default: undefined,
    },
    validators: {
      type: Array as PropType<any[]>,
      required: true,
      default: () => {
        return [];
      },
    },
    preselected: {
      type: String as PropType<string>,
      required: false,
      default: undefined,
    },
  },

  emits: ['update:step', 'previous'],

  setup(props, { emit }) {
    const steps = ref([]);
    const store = useStore();
    const router = useRouter();

    const route = useRoute();
    const propsRef = toRefs(props);
    const baseDenom = route.params.denom as string;
    const gasPrice = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.USER.getPreferredGasPriceLevel];
    });

    const form: RedelegateForm = reactive({
      validatorAddress: propsRef.preselected.value,
      toValidatorAddress: '',
      amount: '',
      denom: baseDenom,
      chain_name: '',
    });

    const step = computed({
      get: () => props.step,
      set: (value) => emit('update:step', value),
    });

    const closeModal = () => {
      router.push('/');
    };
    const action = computed(() => {
      return {
        name: 'switch',
        params: {
          validatorSrcAddress: form.validatorAddress,
          validatorDstAddress: form.toValidatorAddress,
          amount: {
            amount: { amount: form.amount, denom: form.denom },
            chain_name: form.chain_name,
          },
        },
      } as RedelegateAction;
    });
    const isValid = (form: RedelegateForm) => {
      return (
        form.validatorAddress !== '' &&
        form.toValidatorAddress !== '' &&
        form.amount !== '' &&
        form.denom !== '' &&
        form.chain_name !== ''
      );
    };
    watch(form, async () => {
      if (isValid(form) && step.value != 'review') {
        steps.value = await actionHandler(action.value);
      } else {
        steps.value = [];
      }
    });

    const generateSteps = async () => {
      event('review_tx', { event_label: 'Reviewing stake tx', event_category: 'transactions' });
      goToStep('review');
    };
    const goToStep = (value: Step) => {
      step.value = value;
    };
    const selectAnother = () => {
      form.toValidatorAddress = '';
      goToStep('validator');
    };
    const resetHandler = () => {
      form.validatorAddress = propsRef.preselected.value;
      form.toValidatorAddress = '';
      form.amount = '';
      form.denom = baseDenom;
      form.chain_name = '';
      steps.value = [];

      goToStep('validator');
    };

    if (!props.step) {
      step.value = 'validator';
    }
    const addValidator = (validator) => {
      form.toValidatorAddress = validator.operator_address;
      form.chain_name = validator.chain_name;
      goToStep('amount');
    };
    const validatorsToDisable = computed(() => {
      return [form.validatorAddress];
    });
    provide('switchForm', form);

    return {
      gasPrice,
      steps,
      generateSteps,
      form,
      goToStep,
      resetHandler,
      closeModal,
      addValidator,
      selectAnother,
      validatorsToDisable,
    };
  },
});
</script>

<style lang="scss"></style>
