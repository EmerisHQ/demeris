<template>
  <div class="w-full max-w-lg mx-auto">
    <template v-if="step === 'amount'">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.unstakeForm.title') }}</h2>
      <UnstakeFormAmount v-if="validator" :validator="validator" :steps="steps" @next="goToReview" />
    </template>

    <template v-else-if="['review', 'unstake'].includes(step)">
      <FeatureRunningConditional name="TRANSACTIONS_CENTER">
        <template #deactivated>
          <TxStepsModal
            v-if="steps.length"
            :data="steps"
            :gas-price-level="gasPrice"
            :back-route="{ name: 'Portfolio' }"
            action-name="unstake"
            @transacting="goToStep('unstake')"
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
import BigNumber from 'bignumber.js';
import { computed, defineComponent, PropType, provide, reactive, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { ChainData } from '@/store/demeris-api/state';
import { UndelegateAction, UndelegateForm } from '@/types/actions';
import { actionHandler } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';

import UnstakeFormAmount from './UnstakeFormAmount.vue';

type Step = 'amount' | 'review' | 'unstake';

export default defineComponent({
  name: 'UnstakeForm',

  components: {
    TransactionProcessCreator,
    TxStepsModal,
    FeatureRunningConditional,
    UnstakeFormAmount,
  },

  props: {
    step: {
      type: String as PropType<Step>,
      default: undefined,
    },
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },

  emits: ['update:step', 'previous'],

  setup(props, { emit }) {
    const steps = ref([]);
    const store = useStore();
    const router = useRouter();

    const propsRef = toRefs(props);
    const chain = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getChain]({ chain_name: propsRef.validator.value.chain_name });
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

    const form: UndelegateForm = reactive({
      validatorAddress: propsRef.validator.value.operator_address,
      amount: '',
      denom: baseDenom,
      chain_name: propsRef.validator.value.chain_name,
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
          validatorAddress: propsRef.validator.value.operator_address,
          amount: {
            amount: {
              amount: new BigNumber(form.amount != '' ? form.amount ?? 0 : 0)
                .multipliedBy(10 ** precision.value)
                .toString(),
              denom: baseDenom,
            },
            chain_name: propsRef.validator.value.chain_name,
          },
        },
      } as UndelegateAction;
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

    return { gasPrice, steps, goToReview, form, goToStep, resetHandler, closeModal };
  },
});
</script>

<style lang="scss"></style>
