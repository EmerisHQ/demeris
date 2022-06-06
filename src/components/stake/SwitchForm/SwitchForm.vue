<template>
  <div class="w-full mx-auto">
    <ValidatorsTable
      v-show="step == 'validator'"
      :validator-list="validators"
      :disabled-list="validatorsToDisable"
      :table-title="$t('components.switchForm.selectTitle')"
      :table-style="'actionlist'"
      :sorting-by="isStaking ? 'staked' : 'power'"
      sorting-order="desc"
      @selectValidator="addValidator"
    />

    <template v-if="step === 'amount'">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.switchForm.title') }}</h2>

      <SwitchValidatorAmount
        :validators="validators"
        :size="'md'"
        :steps="steps"
        @previous="selectAnother"
        @next="goToReview"
      />
    </template>

    <template v-else-if="['review', 'restake'].includes(step)">
      <TransactionProcessCreator
        v-if="steps.length"
        :steps="steps"
        action="switch"
        @pending="closeModal"
        @close="closeModal"
        @previous="emit('previous')"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
/* eslint-disable max-lines-per-function */
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, provide, reactive, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { actionHandler } from '@/actionhandler';
import SwitchValidatorAmount from '@/components/stake/SwitchForm/SwitchValidatorAmount.vue';
import ValidatorsTable from '@/components/stake/ValidatorsTable.vue';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { RestakeAction, RestakeForm } from '@/types/actions';
import { event } from '@/utils/analytics';

type Step = 'validator' | 'amount' | 'review' | 'restake';

interface Props {
  step?: Step;
  validators: EmerisAPI.Validator[];
  preselected?: string;
}

const props = withDefaults(defineProps<Props>(), {
  step: undefined,
  validators: () => {
    return [];
  },
  preselected: undefined,
});

const emit = defineEmits<{
  (e: 'update:step', value: any): void;
  (e: 'previous'): void;
}>();

const steps = ref([]);
const store = useStore() as RootStoreTyped;
const router = useRouter();

const propsRef = toRefs(props);
const chain = computed(() => {
  return store.getters[GlobalGetterTypes.API.getChain]({
    chain_name: propsRef.validators.value[0].chain_name,
  });
});
const isStaking = computed(() => {
  return propsRef.validators.value.some((val) => parseInt(val.stakedAmount) > 0);
});
const baseDenom = chain.value?.denoms.find((x) => x.stakable).name;

const form: RestakeForm = reactive({
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

const precision = computed(() =>
  store.getters[GlobalGetterTypes.API.getDenomPrecision]({
    name: baseDenom,
  }),
);

const action = computed(() => {
  return {
    name: 'switch',
    params: {
      validatorSrcAddress: form.validatorAddress,
      validatorDstAddress: form.toValidatorAddress,
      amount: {
        amount: new BigNumber(form.amount != '' ? form.amount ?? 0 : 0).multipliedBy(10 ** precision.value).toString(),
        denom: form.denom,
        chain_name: form.chain_name,
      },
    },
  } as RestakeAction;
});
const isValid = (form: RestakeForm) => {
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

const goToReview = async () => {
  event('review_tx', { event_label: 'Reviewing switch tx', event_category: 'transactions' });
  goToStep('review');
};
const goToStep = (value: Step) => {
  step.value = value;
};
const selectAnother = () => {
  form.toValidatorAddress = '';
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
</script>

<style lang="scss"></style>
