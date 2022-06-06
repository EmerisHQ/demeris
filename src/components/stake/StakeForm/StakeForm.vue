<template>
  <div class="w-full mx-auto">
    <ValidatorsTable
      v-show="step == 'validator'"
      :validator-list="validators"
      :disabled-list="validatorsToDisable"
      :currently-editing="currentlyEditing"
      :table-title="$t('components.stakeForm.selectTitle')"
      :table-style="'actionlist'"
      :sorting-by="isStaking ? 'staked' : 'power'"
      sorting-order="desc"
      @selectValidator="addValidator"
    />

    <template v-if="step === 'amount' && form.stakes.length > 0">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.stakeForm.title') }}</h2>
      <StakeFormAmount
        :validators="validators"
        :steps="steps"
        @next="goToReview"
        @selectanother="selectAnother"
        @unselect="unselect"
      />
    </template>

    <template v-else-if="['review', 'stake', 'staked'].includes(step)">
      <TransactionProcessCreator
        v-if="steps.length"
        :steps="steps"
        action="stake"
        @pending="closeModal"
        @close="closeModal"
        @previous="emit('previous')"
        @onReceiptState="goToStaked"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, onMounted, provide, reactive, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { actionHandler } from '@/actionhandler';
import StakeFormAmount from '@/components/stake/StakeForm/StakeFormAmount.vue';
import ValidatorsTable from '@/components/stake/ValidatorsTable.vue';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { MultiStakeAction, MultiStakeForm, StakeForm } from '@/types/actions';
import { event } from '@/utils/analytics';

type Step = 'validator' | 'amount' | 'review' | 'staked';

interface Props {
  step?: Step;
  inModal: Step;
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
  (e: 'update:inModal', value: any): void;
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
const precision = computed(() =>
  store.getters[GlobalGetterTypes.API.getDenomPrecision]({
    name: baseDenom,
  }),
);

const form: MultiStakeForm = reactive({ stakes: [] });

const valToEdit = ref(null as number);
const step = computed({
  get: () => props.step,
  set: (value) => emit('update:step', value),
});
const inModal = computed({
  get: () => props.inModal,
  set: (value) => emit('update:inModal', value),
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
          amount: new BigNumber(x.amount != '' ? x.amount ?? 0 : 0).multipliedBy(10 ** precision.value).toString(),
          denom: x.denom,
          chain_name: x.from_chain,
        },
        chain_name: x.chain_name,
      };
    }),
  } as MultiStakeAction;
});
const isValid = (form: StakeForm) => {
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
  goToStepAsModal('validator');
};
const unselect = (validatorToRemove) => {
  form.stakes = form.stakes.filter((val) => val.validatorAddress !== validatorToRemove.validatorAddress);
  if (form.stakes.length === 0) {
    goToStep('validator');
  }
};
const goToStep = (value: Step) => {
  inModal.value = undefined;
  step.value = value;
};

const goToStepAsModal = (value: Step) => {
  inModal.value = 'amount';
  step.value = value;
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
  return valToEdit.value !== null ? form.stakes[valToEdit.value].validatorAddress : null;
});
provide('stakeForm', form);
onMounted(() => {
  if (propsRef.preselected.value) {
    addValidator(lookupValidator(propsRef.preselected.value));
  }
});
</script>
