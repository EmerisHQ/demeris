<template>
  <div class="w-full max-w-lg mx-auto">
    <template v-if="step === 'amount'">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.unstakeForm.title') }}</h2>
      <UnstakeFormAmount v-if="validatorObj" :validator="validatorObj" :steps="steps" @next="goToReview" />
    </template>

    <template v-else-if="['review', 'unstake', 'unstaked'].includes(step)">
      <FeatureRunningConditional name="TRANSACTIONS_CENTER">
        <TransactionProcessCreator
          v-if="steps.length"
          :steps="steps"
          action="unstake"
          @pending="closeModal"
          @close="closeModal"
          @previous="$emit('previous')"
          @onReceiptState="goToUnstaked"
        />
      </FeatureRunningConditional>
    </template>
  </div>
</template>

<script lang="ts">
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, defineComponent, PropType, provide, reactive, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { actionHandler } from '@/actionhandler';
import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { UnstakeAction, UnstakeForm } from '@/types/actions';
import { event } from '@/utils/analytics';

import UnstakeFormAmount from './UnstakeFormAmount.vue';

type Step = 'amount' | 'review' | 'unstaked';

export default defineComponent({
  name: 'UnstakeForm',

  components: {
    TransactionProcessCreator,
    FeatureRunningConditional,
    UnstakeFormAmount,
  },

  props: {
    step: {
      type: String as PropType<Step>,
      default: undefined,
    },
    validators: {
      type: Array as PropType<EmerisAPI.Validator[]>,
      required: true,
      default: () => {
        return [];
      },
    },
    validator: {
      type: String as PropType<string>,
      required: true,
    },
  },

  emits: ['update:step', 'previous'],

  setup(props, { emit }) {
    const steps = ref([]);
    const store = useStore() as RootStoreTyped;
    const router = useRouter();

    const propsRef = toRefs(props);
    const validatorObj = computed(() => {
      return propsRef.validators.value.find((x) => x.operator_address === propsRef.validator.value);
    });
    const chain = computed(() => {
      return store.getters[GlobalGetterTypes.API.getChain]({ chain_name: validatorObj.value.chain_name });
    });
    const baseDenom = chain.value?.denoms.find((x) => x.stakable).name;
    const precision = computed(() =>
      store.getters[GlobalGetterTypes.API.getDenomPrecision]({
        name: baseDenom,
      }),
    );
    const gasPrice = computed(() => {
      return store.getters[GlobalGetterTypes.USER.getPreferredGasPriceLevel];
    });

    const form: UnstakeForm = reactive({
      validatorAddress: validatorObj.value.operator_address,
      amount: '',
      denom: baseDenom,
      chain_name: validatorObj.value.chain_name,
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
        name: 'unstake',
        params: {
          validatorAddress: validatorObj.value.operator_address,
          amount: {
            amount: new BigNumber(form.amount != '' ? form.amount ?? 0 : 0)
              .multipliedBy(10 ** precision.value)
              .toString(),
            denom: baseDenom,
            chain_name: validatorObj.value.chain_name,
          },
        },
      } as UnstakeAction;
    });
    watch(form, async () => {
      if (
        form.validatorAddress != '' &&
        form.denom != '' &&
        form.chain_name != '' &&
        form.amount != '' &&
        step.value != 'review'
      ) {
        steps.value = await actionHandler(action.value);
      } else {
        steps.value = [];
      }
    });

    const goToReview = async () => {
      event('review_tx', { event_label: 'Reviewing unstake tx', event_category: 'transactions' });
      goToStep('review');
    };

    const goToStep = (value: Step) => {
      step.value = value;
    };

    const goToUnstaked = async () => {
      goToStep('unstaked');
    };

    const resetHandler = () => {
      form.validatorAddress = '';
      form.denom = '';
      form.amount = '';
      form.chain_name = '';
      steps.value = [];

      goToStep('amount');
    };

    if (!props.step) {
      step.value = 'amount';
    }

    provide('unstakeForm', form);

    return { gasPrice, steps, goToReview, form, goToStep, resetHandler, closeModal, validatorObj, goToUnstaked };
  },
});
</script>

<style lang="scss"></style>
