<template>
  <div class="w-full mx-auto">
    <template v-if="step == 'validator'">
      <ValidatorsTable
        :validator-list="validators"
        :disabled-list="validatorsToDisable"
        :currently-editing="currentlyEditing"
        :table-style="'actionlist'"
        :sorting-by="isStaking ? 'staked' : 'power'"
        sorting-order="desc"
        @selectValidator="addValidator"
      />
    </template>
    <template v-else-if="step === 'amount' && form.stakes.length > 0">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.stakeForm.title') }}</h2>
      <StakeFormAmount :validators="validators" :steps="steps" @next="goToReview" @selectanother="selectAnother" />
    </template>

    <template v-else-if="['review', 'stake', 'staked'].includes(step)">
      <FeatureRunningConditional name="TRANSACTIONS_CENTER">
        <TransactionProcessCreator
          v-if="steps.length"
          :steps="steps"
          action="stake"
          @pending="closeModal"
          @close="closeModal"
          @previous="$emit('previous')"
          @onReceiptState="goToStaked"
        />
      </FeatureRunningConditional>
    </template>
  </div>
</template>
<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, onMounted, PropType, provide, reactive, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import StakeFormAmount from '@/components/stake/StakeForm/StakeFormAmount.vue';
import ValidatorsTable from '@/components/stake/ValidatorsTable.vue';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { ChainData } from '@/store/demeris-api/state';
import { DelegateForm, MultiDelegateAction, MultiDelegateForm } from '@/types/actions';
import { actionHandler } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';

type Step = 'validator' | 'amount' | 'review' | 'staked';

export default defineComponent({
  name: 'StakeForm',

  components: {
    TransactionProcessCreator,
    FeatureRunningConditional,
    ValidatorsTable,
    StakeFormAmount,
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

    const propsRef = toRefs(props);
    const chain = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getChain]({
        chain_name: propsRef.validators.value[0].chain_name,
      });
    });
    const isStaking = computed(() => {
      return propsRef.validators.value.some((val) => parseInt(val.stakedAmount) > 0);
    });
    const baseDenom = (chain.value as ChainData)?.denoms.find((x) => x.stakable).name;
    const precision = computed(() =>
      store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
        name: baseDenom,
      }),
    );
    const gasPrice = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.USER.getPreferredGasPriceLevel];
    });

    const form: MultiDelegateForm = reactive({ stakes: [] });

    const valToEdit = ref(null as number);
    const step = computed({
      get: () => props.step,
      set: (value) => emit('update:step', value),
    });

    const closeModal = () => {
      router.push('/');
    };
    const action = computed(() => {
      return {
        name: 'multistake',
        params: form.stakes.map((x) => {
          return {
            validatorAddress: x.validatorAddress,
            amount: {
              amount: {
                amount: new BigNumber(x.amount != '' ? x.amount ?? 0 : 0)
                  .multipliedBy(10 ** precision.value)
                  .toString(),
                denom: x.denom,
              },
              chain_name: x.from_chain,
            },
            chain_name: x.chain_name,
          };
        }),
      } as MultiDelegateAction;
    });
    const isValid = (form: DelegateForm) => {
      return (
        form.validatorAddress !== '' &&
        form.amount !== '' &&
        form.denom !== '' &&
        form.chain_name !== '' &&
        form.from_chain !== ''
      );
    };
    watch(form, async () => {
      if (form.stakes.length > 0 && form.stakes.every((x) => isValid(x)) && step.value != 'review') {
        steps.value = await actionHandler(action.value);
      } else {
        steps.value = [];
      }
    });

    const goToReview = async () => {
      event('review_tx', { event_label: 'Reviewing stake tx', event_category: 'transactions' });
      goToStep('review');
    };
    const goToStaked = async () => {
      goToStep('staked');
    };
    const selectAnother = (e) => {
      valToEdit.value = e;
      goToStep('validator');
    };
    const goToStep = (value: Step) => {
      step.value = value;
    };

    const resetHandler = () => {
      form.stakes = [];
      steps.value = [];

      goToStep('validator');
    };

    if (!props.step) {
      step.value = 'validator';
    }
    const lookupValidator = (address) => {
      return propsRef.validators.value.find((x) => x.operator_address == address) ?? undefined;
    };
    const addValidator = (validator) => {
      if (valToEdit.value !== null) {
        form.stakes[valToEdit.value].validatorAddress = validator.operator_address;
        valToEdit.value = null;
      } else {
        form.stakes.push({
          validatorAddress: validator.operator_address,
          amount: '',
          denom: baseDenom,
          from_chain: validator.chain_name,
          chain_name: validator.chain_name,
        });
      }
      goToStep('amount');
    };
    const validatorsToDisable = computed(() => {
      return form.stakes.map((x) => x.validatorAddress);
    });
    const currentlyEditing = computed(() => {
      return valToEdit.value ? form.stakes[valToEdit.value].validatorAddress : null;
    });
    provide('stakeForm', form);
    onMounted(() => {
      if (propsRef.preselected.value) {
        addValidator(lookupValidator(propsRef.preselected.value));
      }
    });
    return {
      gasPrice,
      steps,
      goToReview,
      goToStaked,
      form,
      goToStep,
      resetHandler,
      closeModal,
      addValidator,
      validatorsToDisable,
      currentlyEditing,
      selectAnother,
      valToEdit,
      isStaking,
    };
  },
});
</script>

<style lang="scss"></style>
