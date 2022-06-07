<template>
  <div class="w-full max-w-lg mx-auto">
    <template v-if="step === 'amount'">
      <h2 class="text-3 font-bold py-8 text-center">{{ $t('components.moveForm.title') }}</h2>
      <MoveFormAmount v-if="balances" :balances="balances" :steps="steps" @next="goToReview" />
    </template>

    <template v-else-if="['review', 'move'].includes(step)">
      <TransactionProcessCreator
        v-if="steps.length"
        :steps="steps"
        action="move"
        @pending="closeModal"
        @close="closeModal"
        @previous="emit('previous')"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, provide, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { actionHandler } from '@/actionhandler';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { MoveAction, MoveAssetsForm } from '@/types/actions';
import { getBaseDenom } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';

import MoveFormAmount from './MoveFormAmount.vue';

type Step = 'amount' | 'review' | 'move';

interface Props {
  balances: EmerisAPI.Balances;
  step?: Step;
}

const props = withDefaults(defineProps<Props>(), { step: undefined });

const emit = defineEmits<{
  (e: 'update:step', value: any): void;
  (e: 'previous'): void;
}>();

const steps = ref([]);
const store = useStore() as RootStoreTyped;
const router = useRouter();

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

const closeModal = () => {
  router.push('/');
};

watch(form, async () => {
  if (
    form.balance.amount != '0' &&
    form.balance.amount != '' &&
    form.balance.denom != '' &&
    form.on_chain != '' &&
    form.to_chain != '' &&
    step.value != 'review'
  ) {
    const precision =
      store.getters[GlobalGetterTypes.API.getDenomPrecision]({
        name: await getBaseDenom(form.balance.denom, form.on_chain),
      }) || 6;

    const action: MoveAction = {
      name: 'move',
      params: {
        from: {
          amount: new BigNumber(form.balance.amount).shiftedBy(precision).toString(),
          denom: await form.balance.denom,
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

const goToReview = async () => {
  event('review_tx', { event_label: 'Reviewing move tx', event_category: 'transactions' });
  goToStep('review');
};

const goToStep = (value: Step) => {
  step.value = value;
};

if (!props.step) {
  step.value = 'amount';
}

provide('moveForm', form);
</script>

<style lang="scss"></style>
